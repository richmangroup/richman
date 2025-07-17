import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft } from 'react-icons/fa';

function Withdraw() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');

  const handleWithdraw = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/users/withdraw', 
        { amount: parseFloat(amount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('✅ Withdrawal successful!');
      navigate('/home');
    } catch (err) {
      alert('❌ Withdraw failed: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden text-white">
      <motion.form
        onSubmit={handleWithdraw}
        className="relative z-10 p-10 w-full max-w-md rounded-3xl 
          bg-black/40 backdrop-blur-2xl 
          border border-yellow-300 shadow-[0_0_20px_#facc15]/30
          transition duration-500 text-center"
        initial={{ scale: 1 }}
        animate={{ y: [0, -5, 0] }}
        transition={{ repeat: Infinity, duration: 4 }}
        whileHover={{ scale: 1.03, boxShadow: "0 0 30px #facc15" }}
      >
        <div className="absolute -inset-1 rounded-3xl 
          bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 
          blur-lg opacity-30 pointer-events-none transition duration-700" />

        {/* Back button - icon only, no border */}
        <button
          type="button"
          onClick={() => navigate('/home')}
          className="absolute top-4 left-4 p-2 rounded-full text-yellow-300 
            hover:text-yellow-100 hover:bg-yellow-400/20 transition"
        >
          <FaArrowLeft size={20} />
        </button>

        <h2 className="text-4xl font-bold text-yellow-300 mb-8 drop-shadow-[0_0_15px_#facc15]">
          Withdraw Funds
        </h2>

        <input
          type="number"
          placeholder="Amount"
          className="w-full mb-8 px-4 py-3 rounded-lg bg-black/40 border border-yellow-300 text-yellow-100
            focus:outline-none focus:border-pink-300 focus:shadow-[0_0_15px_#f472b6] transition"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        <motion.button
          whileHover={{ scale: 1.1, boxShadow: "0 0 20px #facc15" }}
          type="submit"
          className="w-full py-3 rounded-lg bg-gradient-to-r from-yellow-400 to-pink-400 text-white font-bold
            relative overflow-hidden transition"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-transparent 
            -translate-x-full hover:translate-x-full transition-transform duration-700"></span>
          <span className="relative z-10">Withdraw</span>
        </motion.button>
      </motion.form>
    </div>
  );
}

export default Withdraw;
