import React from 'react';
import { Link } from 'react-router-dom';

function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white flex flex-col items-center py-14 px-4 relative overflow-hidden">

      {/* Glowing overlay background */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-green-500/20 animate-pulse blur-3xl"></div>

      <h1 className="text-5xl font-extrabold mb-16 text-center drop-shadow-2xl z-10">
        🎰 Casino Dashboard
      </h1>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full max-w-7xl z-10">
        <div className="bg-white/10 backdrop-blur-lg p-10 rounded-3xl border-2 border-purple-500 shadow-[0_0_50px_#8B5CF6] hover:shadow-[0_0_80px_#EC4899] hover:scale-105 transition duration-500">
          <h2 className="text-4xl font-bold mb-4">💰 Balance</h2>
          <p className="text-3xl text-green-400">$2,500</p>
        </div>
        <div className="bg-white/10 backdrop-blur-lg p-10 rounded-3xl border-2 border-pink-500 shadow-[0_0_50px_#EC4899] hover:shadow-[0_0_80px_#8B5CF6] hover:scale-105 transition duration-500">
          <h2 className="text-4xl font-bold mb-4">🏆 Total Winnings</h2>
          <p className="text-3xl text-yellow-400">$1,200</p>
        </div>
        <div className="bg-white/10 backdrop-blur-lg p-10 rounded-3xl border-2 border-green-500 shadow-[0_0_50px_#22C55E] hover:shadow-[0_0_80px_#84CC16] hover:scale-105 transition duration-500">
          <h2 className="text-4xl font-bold mb-4">🎯 Transactions</h2>
          <p className="text-3xl text-cyan-300">48</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-20 w-full max-w-4xl z-10">
        <h3 className="text-4xl font-bold mb-8 text-center">📝 Recent Activity</h3>
        <div className="space-y-4">
          {[
            'Deposited $200 via PayPal',
            'Won $400 on Slots',
            'Withdrew $150 to Bank',
            'Played Blackjack - Lost $50',
            'Claimed 20 Free Spins Promo'
          ].map((activity, idx) => (
            <div key={idx}
              className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-purple-400 shadow hover:scale-105 transition duration-300">
              {activity}
            </div>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap justify-center gap-12 mt-20 z-10">
        <Link
          to="/home"
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-pink-600 hover:to-purple-600 text-white py-4 px-12 rounded-full text-2xl shadow-xl transition-transform hover:scale-110"
        >
          🏠 Go to Home
        </Link>
        <Link
          to="/promo"
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-emerald-600 hover:to-green-600 text-white py-4 px-12 rounded-full text-2xl shadow-xl transition-transform hover:scale-110"
        >
          🎟️ Enter Promo Code
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;
