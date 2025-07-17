// crashGame/gameSocket.js
import CrashGameEngine from "./crashEngine.js";
const engine = new CrashGameEngine();

let players = [];

export default function setupGameSocket(io) {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("place_bet", ({ userId, betAmount }) => {
      if (engine.isRunning) {
        socket.emit("game_error", "Game already running.");
        return;
      }

      players.push({
        userId,
        betAmount,
        hasCashedOut: false,
        socketId: socket.id,
      });

      socket.emit("bet_placed", { betAmount });
    });

    socket.on("cash_out", () => {
      const player = players.find((p) => p.socketId === socket.id);
      if (player && !player.hasCashedOut && engine.isRunning) {
        player.hasCashedOut = true;
        const winAmount = player.betAmount * engine.getMultiplier();
        socket.emit("cashed_out", { winAmount });
        // TODO: Update wallet in DB here
      }
    });

    socket.on("start_game", () => {
      if (engine.isRunning) return;

      players = []; // reset previous round
      io.emit("game_started");

      engine.start((multiplier) => {
        if (multiplier === "CRASHED") {
          io.emit("game_crashed", engine.getCrashPoint());
          players.forEach((player) => {
            if (!player.hasCashedOut) {
              io.to(player.socketId).emit("lost", { lostAmount: player.betAmount });
              // TODO: Deduct from wallet here
            }
          });
        } else {
          io.emit("multiplier_update", multiplier);
        }
      });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      players = players.filter((p) => p.socketId !== socket.id);
    });
  });
}
