import React from 'react';

const upcomingFeatures = [
  { name: "Blackjack", icon: "🃏" },
  { name: "Roulette", icon: "🎡" },
  { name: "Dice", icon: "🎲" },
  { name: "Poker", icon: "♠️" },
  { name: "Baccarat", icon: "♥️" },
  { name: "Keno", icon: "🎯" },
  { name: "Sic Bo", icon: "🎲" },
  { name: "Mega Ball", icon: "⚽" },
  { name: "Wheel", icon: "🎡" },
  { name: "Mines", icon: "💣" },
  { name: "Aviator", icon: "✈️" },
  { name: "Hi-Lo", icon: "⬆️" },
  { name: "Dragon Tiger", icon: "🐉" },
  { name: "Slots", icon: "🎰" },
];

const ComingSoon = () => {
  return (
    <div className="-mx-2.5">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 flex items-center gap-2 text-yellow-400 mx-2.5">
        ⏳ Coming Soon
      </h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
        {upcomingFeatures.map((item, idx) => (
          <div
            key={idx}
            className="cursor-default bg-[#1f1c2c]/50 border border-[#3a3a5e] w-full aspect-square
            rounded-xl hover:border-yellow-400 hover:scale-105 transition duration-300 flex flex-col items-center justify-center group"
          >
            <span className="text-5xl sm:text-6xl md:text-7xl group-hover:drop-shadow-[0_0_8px_gold]">
              {item.icon}
            </span>
            <span className="text-sm sm:text-base font-semibold mt-2">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComingSoon;
