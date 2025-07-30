import React, { useEffect, useState, useCallback } from "react";
import io from "socket.io-client";
import axios from "../axios"; // Use your configured axios instance

const socket = io("http://localhost:5000"); // or use env if set

const CrashGame = () => {
  const [multiplier, setMultiplier] = useState(1);
  const [betAmount, setBetAmount] = useState("");
  const [hasBet, setHasBet] = useState(false);
  const [hasCashedOut, setHasCashedOut] = useState(false);
  const [result, setResult] = useState(null);
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);

  const fetchUser = useCallback(async () => {
    try {
      const res = await axios.get("/me");
      setUser(res.data);
      setBalance(res.data.balance);
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  }, []);

  useEffect(() => {
    fetchUser();

    socket.on("multiplier_update", setMultiplier);

    socket.on("game_crashed", (crashPoint) => {
      if (!hasCashedOut && hasBet) {
        setResult(`❌ You lost ${betAmount} coins!`);
        fetchUser(); // update balance after loss
      }
      setHasBet(false);
      setHasCashedOut(false);
    });

    socket.on("cashed_out", ({ winAmount }) => {
      setResult(`✅ You cashed out ${winAmount.toFixed(2)} coins!`);
      setHasCashedOut(true);
      fetchUser(); // update balance after win
    });

    socket.on("game_started", () => {
      setMultiplier(1);
      setResult(null);
      setHasBet(false);
      setHasCashedOut(false);
    });

    return () => socket.off();
  }, [fetchUser, betAmount, hasBet, hasCashedOut]);

  const placeBet = () => {
    if (!betAmount || isNaN(betAmount) || parseFloat(betAmount) <= 0) return;
    if (parseFloat(betAmount) > balance) {
      setResult("❌ Insufficient balance");
      return;
    }

    socket.emit("place_bet", {
      userId: user._id,
      betAmount: parseFloat(betAmount),
    });

    setHasBet(true);
    setResult(null);
  };

  const cashOut = () => {
    socket.emit("cash_out", { userId: user._id });
  };

  const startGame = () => {
    socket.emit("start_game");
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-6">🔥 Crash Game</h1>

      <div className="text-2xl mb-2">Balance: {balance.toFixed(2)} coins</div>
      <div className="text-6xl font-mono text-green-400 mb-4">{multiplier}x</div>

      <div className="flex gap-4 mb-4">
        <input
          type="number"
          className="px-4 py-2 text-black rounded"
          placeholder="Bet Amount"
          value={betAmount}
          onChange={(e) => setBetAmount(e.target.value)}
          disabled={hasBet}
        />
        {!hasBet ? (
          <button className="bg-blue-600 px-4 py-2 rounded" onClick={placeBet}>
            Place Bet
          </button>
        ) : (
          <button className="bg-yellow-500 px-4 py-2 rounded" onClick={cashOut}>
            Cash Out
          </button>
        )}
      </div>

      {result && <p className="text-xl mb-4">{result}</p>}

      <button onClick={startGame} className="bg-red-600 px-6 py-2 rounded mt-4">
        🔁 Start Game (Test)
      </button>
    </div>
  );
};

export default CrashGame;
