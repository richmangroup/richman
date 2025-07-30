import CrashGameEngine from "./crashEngine.js";
import User from "../models/user.js"; // or correct path to your user model

const players = new Map();
let game = null;

const setupGameSocket = (io) => {
  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    if (game && game.isRunning) {
      socket.emit("gameState", {
        gameState: "running",
        multiplier: game.getMultiplier(),
        crashPoint: game.getCrashPoint(),
      });
    } else {
      socket.emit("gameState", { gameState: "waiting" });
    }

    // ✅ Handle Bet with Real User
    socket.on("joinGame", async ({ userId, username, bet }) => {
      try {
        const user = await User.findById(userId);
        if (!user || user.balance < bet) {
          socket.emit("message", "Insufficient balance");
          return;
        }

        // Deduct balance immediately
        user.balance -= bet;
        await user.save();

        players.set(socket.id, {
          userId,
          username,
          bet,
          cashedOut: false,
          cashOutMultiplier: null,
          socket,
        });

        io.emit("playersUpdate", Array.from(players.values()).map((p) => ({
          username: p.username,
          bet: p.bet,
          cashedOut: p.cashedOut,
          cashOutMultiplier: p.cashOutMultiplier,
        })));

        if (!game || !game.isRunning) {
          startGame(io);
        }
      } catch (err) {
        console.error("Error joining game:", err);
        socket.emit("message", "Internal error");
      }
    });

    socket.on("cashOut", async ({ userId }) => {
      const player = players.get(socket.id);
      if (player && game && game.isRunning && !player.cashedOut) {
        player.cashedOut = true;
        player.cashOutMultiplier = game.getMultiplier();

        const wonAmount = player.bet * player.cashOutMultiplier;

        // ✅ Credit winnings
        await User.findByIdAndUpdate(userId, { $inc: { balance: wonAmount } });

        socket.emit("cashedOut", {
          at: player.cashOutMultiplier.toFixed(2),
          won: wonAmount.toFixed(2),
        });

        io.emit("playersUpdate", Array.from(players.values()).map((p) => ({
          username: p.username,
          bet: p.bet,
          cashedOut: p.cashedOut,
          cashOutMultiplier: p.cashOutMultiplier,
        })));
      }
    });

    socket.on("disconnect", () => {
      players.delete(socket.id);
      console.log(`Socket disconnected: ${socket.id}`);

      io.emit("playersUpdate", Array.from(players.values()).map((p) => ({
        username: p.username,
        bet: p.bet,
        cashedOut: p.cashedOut,
        cashOutMultiplier: p.cashOutMultiplier,
      })));
    });
  });
};

function startGame(io) {
  game = new CrashGameEngine();
  io.emit("gameStart", { crashPoint: game.getCrashPoint() });

  game.start((data) => {
    if (data === "CRASHED") {
      io.emit("crashed", {
        crashPoint: game.getCrashPoint(),
        players: Array.from(players.values()).map((p) => ({
          username: p.username,
          bet: p.bet,
          cashedOut: p.cashedOut,
          cashOutMultiplier: p.cashOutMultiplier,
        })),
      });
      players.clear();
      setTimeout(() => {
        io.emit("waitingForPlayers");
      }, 5000);
    } else {
      io.emit("multiplierUpdate", parseFloat(data));
    }
  });
}

export default setupGameSocket;
