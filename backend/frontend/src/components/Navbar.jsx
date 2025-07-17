import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center">
      <div className="text-xl font-bold">🎮 GameZone</div>
      <div className="flex gap-6">
        <Link to="/home" className="hover:text-yellow-400">Home</Link>
        <Link to="/deposit" className="hover:text-yellow-400">Deposit</Link>
        <Link to="/withdraw" className="hover:text-yellow-400">Withdraw</Link>
        <Link to="/profile" className="hover:text-yellow-400">Profile</Link>
        <Link to="/about" className="hover:text-yellow-400">About</Link>
        <Link to="/crash-game" className="hover:text-yellow-400">Crash Game</Link>
      </div>
    </nav>
  );
};

export default Navbar;
