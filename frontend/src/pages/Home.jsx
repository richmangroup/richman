import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from '../axios';

import Sidebar from '../components/Sidebar';
import TrendingGames from '../components/TrendingGames';
import Promotions from '../components/Promotions';
import ComingSoon from '../components/ComingSoon';
import NFTShowcase from '../components/NFTShowcase';
import homeBg from '../assets/home-bg.jpg';
import ownersGroup from '../assets/owners-group.png';
import afaLogo from '../assets/afa-logo.png';
import blockchainLogo from '../assets/blockchain-logo.png';
import thirdLogo from '../assets/third-logo.png';
import { FaBars } from 'react-icons/fa';
import BalanceCard from '../components/BalanceCard';
import CrashGame from '../components/CrashGame';
import VideoEarnSection from "../components/VideoEarnSection";

function Home() {
  const [balance, setBalance] = useState(0);
  const [pending, setPending] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  const fetchUser = useCallback(async () => {
    try {
      const res = await axios.get('/me');
      const userData = res.data;
      setBalance(userData?.balance || 0);
      setPending(userData?.pendingDeposits?.length > 0);
    } catch (err) {
      console.error('Error fetching user:', err);
    }
  }, []);

  useEffect(() => {
    fetchUser();
    if (location.state?.depositSuccess) {
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate, fetchUser]);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : 'auto';
  }, [sidebarOpen]);

  return (
    <div
      className="flex flex-col md:flex-row min-h-screen bg-cover bg-center text-white relative"
      style={{ backgroundImage: `url(${homeBg})` }}
    >
      <button
        className="fixed top-4 left-4 z-50 md:hidden text-white bg-black/50 p-2 rounded-md"
        onClick={toggleSidebar}
      >
        <FaBars size={20} />
      </button>

      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex-1 p-4 sm:p-6 md:p-8 space-y-12 mt-16 md:mt-0">
        <div className="bg-[#1f1c2c]/50 border border-[#3a3a5e] rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6 overflow-hidden">
          <div className="flex flex-col items-start space-y-4 flex-1 p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mt-4 w-full flex flex-col items-start space-y-5"
            >
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.9, delay: 0.2 }}
              >
                <h2 className="text-2xl sm:text-3xl font-extrabold">
                  🔥 Great to see you again!
                </h2>

                <BalanceCard balance={balance} />

                {pending && (
                  <div className="bg-yellow-100/10 text-yellow-300 p-3 rounded-lg border border-yellow-500 text-sm mt-2">
                    Your deposit is pending admin approval. Balance will update once approved.
                  </div>
                )}
              </motion.div>
            </motion.div>
          </div>

          <div className="flex-1 h-full flex justify-center items-end">
            <img src={ownersGroup} alt="Casino Owners" className="w-full h-full object-contain" />
          </div>

          <div className="flex flex-row md:flex-col items-center justify-center gap-4 p-4">
            {[afaLogo, blockchainLogo, thirdLogo].map((logo, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <img src={logo} alt="Partner Logo" className="w-14 sm:w-16" />
                <span className="text-sm text-gray-400 mt-1">Official Partner</span>
              </div>
            ))}
          </div>
        </div>
        {/* ✅ NEW WATCH & EARN SECTION */}
        <VideoEarnSection />

        <TrendingGames />
        <ComingSoon />
        <NFTShowcase />
        <Promotions />
      </div>
    </div>
  );
}

export default Home;
