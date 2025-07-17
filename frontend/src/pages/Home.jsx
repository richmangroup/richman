import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaHome, FaWallet, FaMoneyBillWave, FaTrophy, FaGift,
  FaFire, FaCrown, FaCommentDots, FaSignOutAlt
} from 'react-icons/fa';

import homeBg from '../assets/home-bg.jpg';
import ownersGroup from '../assets/owners-group.png';
import afaLogo from '../assets/afa-logo.png';
import blockchainLogo from '../assets/blockchain-logo.png';
import thirdLogo from '../assets/third-logo.png';
function Home() {

  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/user/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setBalance(res.data.balance || 0);
      } catch (err) {
        console.error('Error fetching user:', err);
      }
    };

    fetchUser();
  }, []);
  const location = useLocation();
  const navigate = useNavigate();

  const trendingBets = [
    { user: "CasinoKing23", game: "Slots", amount: "$2,500", emoji: "🎰" },
    { user: "LuckyLisa", game: "Blackjack", amount: "$1,200", emoji: "🃏" },
    { user: "BigBaller77", game: "Roulette", amount: "$4,800", emoji: "🎡" },
    { user: "MinesMaster", game: "Mines", amount: "$900", emoji: "💣" },
    { user: "CrashBoss", game: "Crash", amount: "$3,100", emoji: "💥" },
    { user: "DiceDealer", game: "Dice", amount: "$600", emoji: "🎲" },
  ];
  const [currentBetIndex, setCurrentBetIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBetIndex((prev) => (prev + 1) % trendingBets.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  const linkClass = (path) =>
    `flex items-center space-x-3 transition duration-200 
    ${location.pathname === path ? 'text-pink-400 font-bold' : 'hover:text-pink-400'}`;

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };
  return (
    <div
      className="flex flex-col lg:flex-row min-h-screen bg-cover bg-center text-white"
      style={{ backgroundImage: `url(${homeBg})` }}
    >
      {/* Sidebar */}
      <div className="hidden lg:flex w-64 bg-[#1f1c2c]/80 border-r border-[#3a3a5e] flex-col py-10 px-6 space-y-8">
        <h1 className="text-3xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-8 text-center">
          🎲 Casino
        </h1>
        <div className="space-y-4">
          <h3 className="text-sm text-gray-400 uppercase tracking-wide mb-1">Menu</h3>
          <Link to="/home" className={linkClass('/home')}>
            <FaHome size={18} /> <span>Home</span>
          </Link>
          <Link to="/promo" className={linkClass('/promo')}>
            <FaGift size={18} /> <span>Free Bonus</span>
          </Link>
          <Link to="/support" className={linkClass('/support')}>
            <FaTrophy size={18} /> <span>Live Support</span>
          </Link>
        </div>
        <div className="space-y-4 mt-8">
          <h3 className="text-sm text-gray-400 uppercase tracking-wide mb-1">Profile</h3>
          <Link to="/profile" className={linkClass('/profile')}>
            <FaHome size={18} /> <span>Profile</span>
          </Link>
          <Link to="/vip" className={linkClass('/vip')}>
            <FaCrown size={18} /> <span>VIP Club</span>
          </Link>
          <Link to="/deposit" className={linkClass('/deposit')}>
            <FaWallet size={18} /> <span>Deposit</span>
          </Link>
          <Link to="/withdraw" className={linkClass('/withdraw')}>
            <FaMoneyBillWave size={18} /> <span>Withdraw</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 text-left w-full hover:text-pink-400 transition duration-200"
          >
            <FaSignOutAlt size={18} /> <span>Logout</span>
          </button>
        </div>
        <div className="space-y-4 mt-8">
          <h3 className="text-sm text-gray-400 uppercase tracking-wide mb-1">Info</h3>
          <Link to="/about" className={linkClass('/about')}>
            <FaTrophy size={18} /> <span>About Us</span>
          </Link>
          <Link to="/sponsors" className={linkClass('/sponsors')}>
            <FaFire size={18} /> <span>Sponsors</span>
          </Link>
          <Link to="/license" className={linkClass('/license')}>
            <FaHome size={18} /> <span>License & Security</span>
          </Link>
        </div>
      </div>
      {/* Main Content */}
      <div className="flex-1 p-6 sm:p-8 md:p-10 space-y-12">
        {/* Greeting + Logos */}
        <div className="bg-[#1f1c2c]/50 border border-[#3a3a5e] rounded-2xl flex flex-col md:flex-row justify-between items-center gap-8 overflow-hidden">
          <div className="flex flex-col items-start space-y-4 flex-1 p-6 sm:p-8">
            <h2 className="text-3xl sm:text-4xl font-extrabold">🔥 Great to see you again!</h2>
            {/* Balance Block Under CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mt-4 w-full flex flex-col items-start space-y-5"
            >
              {/* CTA Text */}
              <h4 className="text-base md:text-lg text-white/90">
                Ready to try your luck today?
              </h4>
              {/* 💰 Animated Balance Card */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.9, delay: 0.2 }}
                className="bg-gradient-to-r from-yellow-400/20 via-yellow-300/10 to-yellow-100/10
      backdrop-blur-md border border-yellow-300/40 text-white rounded-2xl px-5 py-4 w-full max-w-sm 
      flex items-center gap-4 shadow-2xl hover:scale-[1.03] transition-all duration-300"
              >
                {/* 🪙 Coin */}
                <div className="w-12 h-12 animate-spin-slow">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="gold" viewBox="0 0 24 24" className="w-full h-full drop-shadow-lg">
                    <circle cx="12" cy="12" r="10" fill="gold" />
                    <text x="12" y="16" textAnchor="middle" fontSize="10" fill="black" fontWeight="bold">$</text>
                  </svg>
                </div>
                {/* Amount */}
                <div>
                  <p className="text-sm text-gray-300">Your Balance</p>
                  <motion.p
                    key={balance}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="text-2xl font-extrabold text-white tracking-wide"
                  >
                    ${balance.toFixed(2)}
                  </motion.p>
                </div>
              </motion.div>
            </motion.div>
          </div>
          <div className="flex-1 relative h-full flex justify-center items-end">
            <img src={ownersGroup} alt="Casino Owners" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-row md:flex-col items-center justify-center gap-6 w-full md:w-1/3 p-6 sm:p-8">
            {[afaLogo, blockchainLogo, thirdLogo].map((logo, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <img src={logo} alt="Partner Logo" className="w-16 sm:w-20" />
                <span className="text-sm text-gray-400 mt-1">Official Partner</span>
              </div>
            ))}
          </div>
        </div>
        {/* Trending Games */}
        <div className="-mx-2.5">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2 text-pink-400 mx-2.5">
            <FaFire /> Trending Games
          </h2>
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-4">
            {[
              { name: "Slots", icon: "🎰" },
              { name: "Blackjack", icon: "🃏" },
              { name: "Roulette", icon: "🎡" },
              { name: "Dice", icon: "🎲" },
              { name: "Crash", icon: "💥" },
              { name: "Plinko", icon: "🔺" },
              { name: "Mines", icon: "💣" },
              { name: "Poker", icon: "♠️" },
              { name: "Baccarat", icon: "♥️" },
              { name: "Keno", icon: "🎯" },
              { name: "Dragon Tiger", icon: "🐉" },
              { name: "Sic Bo", icon: "🎲" },
              { name: "Mega Ball", icon: "⚽" },
              { name: "Aviator", icon: "✈️" },
              { name: "Hi-Lo", icon: "⬆️" },
              { name: "Wheel", icon: "🎡" },
            ].map((game, idx) => {
              const content = (
                <div
                  key={idx}
                  className="cursor-pointer bg-[#1f1c2c]/50 border border-[#3a3a5e] w-full aspect-square
                  rounded-xl hover:border-pink-500 hover:scale-105 transition duration-300 flex flex-col items-center justify-center group"
                >
                  <span className="text-6xl sm:text-7xl md:text-8xl group-hover:drop-shadow-[0_0_8px_pink]">
                    {game.icon}
                  </span>
                  <span className="text-base font-semibold mt-3">{game.name}</span>
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
        {/* Promotions */}
        <div>
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-2 text-emerald-400">
            <FaCrown /> Latest Promotions & Bonuses
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {[
              { title: "100% Welcome Bonus", desc: "Get double on your first deposit!", color: "from-pink-600 to-purple-600" },
              { title: "Cashback Fridays", desc: "10% cashback every Friday.", color: "from-green-600 to-emerald-500" },
              { title: "Free Spins Saturday", desc: "50 free spins on Slots.", color: "from-yellow-500 to-orange-500" },
            ].map((promo, idx) => (
              <div
                key={idx}
                className={`bg-gradient-to-r ${promo.color} p-6 rounded-2xl hover:scale-105 transition duration-300`}
              >
                <h3 className="text-2xl font-bold mb-2">{promo.title}</h3>
                <p className="text-sm">{promo.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Live Winner Notification */}
      <div className="fixed bottom-4 left-0 w-72 sm:w-80 bg-[#1f1c2c]/80 border border-pink-500 p-4 sm:p-6 rounded-r-3xl animate-[slideFadeLoop_8s_ease-in-out_infinite]">
        <h3 className="text-lg sm:text-xl font-bold mb-4 text-pink-400">
          <FaFire className="inline mr-2" />Live Winner
        </h3>
        <div className="flex justify-between">
          <span>{trendingBets[currentBetIndex].emoji} {trendingBets[currentBetIndex].user}</span>
          <span className="text-pink-300">{trendingBets[currentBetIndex].amount}</span>
        </div>
      </div>
    </div>
  );
}

export default Home;
