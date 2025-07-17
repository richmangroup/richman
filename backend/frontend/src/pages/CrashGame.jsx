import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000"); // Update only if needed

const CrashGame = () => {
  const [multiplier, setMultiplier] = useState(1);
  const [betAmount, setBetAmount] = useState("");
  const [hasBet, setHasBet] = useState(false);
  const [hasCashedOut, setHasCashedOut] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    console.log("✅ CrashGame mounted");

    socket.on("multiplier_update", setMultiplier);
    socket.on("game_crashed", (crashPoint) => {
      if (!hasCashedOut && hasBet) {
        setResult(`❌ You lost ${betAmount} coins!`);
      }
      setHasBet(false);
      setHasCashedOut(false);
    });
    socket.on("cashed_out", ({ winAmount }) => {
      setResult(`✅ You cashed out ${winAmount.toFixed(2)} coins!`);
      setHasCashedOut(true);
    });

    socket.on("game_started", () => {
      setMultiplier(1);
      setResult(null);
      setHasBet(false);
      setHasCashedOut(false);
    });

    return () => socket.off();
  }, [betAmount, hasBet, hasCashedOut]);

  const placeBet = () => {
    if (!betAmount || isNaN(betAmount)) return;
    socket.emit("place_bet", { userId: "123", betAmount: parseFloat(betAmount) });
    setHasBet(true);
    setResult(null);
  };

  const cashOut = () => {
    socket.emit("cash_out");
  };

  const startGame = () => {
    socket.emit("start_game");
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-6">🔥 Crash Game</h1>
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
          <button className="bg-blue-600 px-4 py-2 rounded" onClick={placeBet}>Place Bet</button>
        ) : (
          <button className="bg-yellow-500 px-4 py-2 rounded" onClick={cashOut}>Cash Out</button>
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
