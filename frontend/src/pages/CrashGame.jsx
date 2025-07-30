import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "../axios"; // Your axios instance

const socket = io("http://localhost:5000");

const CrashGame = () => {
  const [multiplier, setMultiplier] = useState(1);
  const [betAmount, setBetAmount] = useState("");
  const [hasBet, setHasBet] = useState(false);
  const [hasCashedOut, setHasCashedOut] = useState(false);
  const [result, setResult] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await axios.get("/me");
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };
    fetchMe();
  }, []);

  useEffect(() => {
    socket.on("multiplierUpdate", setMultiplier);

    socket.on("crashed", (crashData) => {
      if (!hasCashedOut && hasBet) {
        setResult(`❌ You lost ${betAmount} coins!`);
      }
      setHasBet(false);
      setHasCashedOut(false);
    });

    socket.on("cashedOut", ({ won }) => {
      setResult(`✅ You cashed out ${won} coins!`);
      setHasCashedOut(true);
    });

    socket.on("gameStart", () => {
      setMultiplier(1);
      setResult(null);
      setHasBet(false);
      setHasCashedOut(false);
    });

    return () => {
      socket.off("multiplierUpdate");
      socket.off("crashed");
      socket.off("cashedOut");
      socket.off("gameStart");
    };
  }, [betAmount, hasBet, hasCashedOut]);

  const placeBet = () => {
    if (!user || !betAmount || isNaN(betAmount)) return;
    if (parseFloat(betAmount) > user.balance) {
      return setResult("❌ Insufficient balance!");
    }

    socket.emit("joinGame", {
      userId: user._id,
      username: user.username,
      bet: parseFloat(betAmount),
    });

    setHasBet(true);
    setResult(null);
  };

  const cashOut = () => {
    socket.emit("cashOut", { userId: user._id });
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
    </div>
  );
};

export default CrashGame;
