import React from 'react';
import { Link } from 'react-router-dom';

const games = [
  { name: "Crash", icon: "💥" },
  { name: "Plinko", icon: "🔺" },
  
];

const TrendingGames = () => {
  return (
    <div className="-mx-2.5">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 flex items-center gap-2 text-pink-400 mx-2.5">
        🔥 Trending Games
      </h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
        {games.map((game, idx) => {
          const content = (
            <div
              key={idx}
              className="cursor-pointer bg-[#1f1c2c]/50 border border-[#3a3a5e] w-full aspect-square
              rounded-xl hover:border-pink-500 hover:scale-105 transition duration-300 flex flex-col items-center justify-center group"
            >
              <span className="text-5xl sm:text-6xl md:text-7xl group-hover:drop-shadow-[0_0_8px_pink]">
                {game.icon}
              </span>
              <span className="text-sm sm:text-base font-semibold mt-2">{game.name}</span>
            </div>
          );
          return game.name === "Crash" ? (
            <Link to="/crash-game" key={idx}>{content}</Link>
          ) : (
            content
          );
        })}
      </div>
    </div>
  );
};

export default TrendingGames;
