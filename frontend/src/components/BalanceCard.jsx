import React from 'react';
import { motion } from 'framer-motion';
import { FaWallet } from 'react-icons/fa';

function BalanceCard({ balance }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="mt-4 w-full flex flex-col items-start space-y-5"
    >
      <h4 className="text-base md:text-lg text-white/90 font-medium tracking-wide">
        Welcome back, ready to win big?
      </h4>

      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, delay: 0.2 }}
        className="relative w-full max-w-sm rounded-2xl px-6 py-5
        bg-gradient-to-br from-[#1e1f2a]/80 to-[#2a2b3d]/80
        backdrop-blur-lg border border-white/10
        shadow-[0_0_25px_rgba(59,130,246,0.25)] flex items-center gap-5
        hover:scale-[1.02] transition-all duration-300 overflow-hidden"
      >
        {/* Background blur lights */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-cyan-400/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Wallet Icon */}
        <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-400/30 
                        flex items-center justify-center shadow-inner shadow-cyan-500/10">
          <FaWallet className="text-cyan-300 text-2xl" />
        </div>

        {/* Balance Info */}
        <div className="z-10">
          <p className="text-sm text-gray-400">Your Balance</p>
          <motion.p
            key={balance}
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-semibold text-cyan-300 tracking-wide"
          >
            ${balance.toFixed(2)}
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default BalanceCard;
