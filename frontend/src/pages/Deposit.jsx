// Deposit.jsx
import React, { useState } from 'react';
import axios from '../axios'; // ✅ Already includes /api/users
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft } from 'react-icons/fa';

const walletAddresses = {
  usdt: 'TYyeJuVT6WAJ62zANYDiZkaXfMMc8UCcML',
  bnb: '0x169510d670F116C9723F03C8E3EaE11F7f1fc6e5',
  btc: 'bc1qhegxttdq2qzc79cks073rpna32mnl5tz3ejrs8',
};

function Deposit() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [coin, setCoin] = useState('usdt');
  const [txId, setTxId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (parseFloat(amount) < 5) {
      alert('❌ Minimum deposit is $5');
      return;
    }

    setLoading(true);

    try {
      await axios.post("/submit-crypto-deposit", // ✅ Fixed path
        {
          amount: parseFloat(amount),
          coin,
          txId,
        }
      );

      alert('✅ Deposit submitted! Waiting for admin approval.');
      setAmount('');
      setCoin('usdt');
      setTxId('');
      navigate('/home');
    } catch (err) {
      console.error(err);
      alert('❌ Submission failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden text-white">
      <motion.form
        onSubmit={handleSubmit}
        className="relative z-10 p-10 w-full max-w-md rounded-3xl 
          bg-black/40 backdrop-blur-2xl border border-pink-300 
          shadow-[0_0_20px_#ff99cc]/30 transition duration-500 text-center"
        initial={{ scale: 1 }}
        animate={{ y: [0, -5, 0] }}
        transition={{ repeat: Infinity, duration: 4 }}
        whileHover={{ scale: 1.03, boxShadow: '0 0 30px #ff99cc' }}
      >
        <div className="absolute -inset-1 rounded-3xl 
          bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300 
          blur-lg opacity-30 pointer-events-none transition duration-700" />

        <button
          type="button"
          onClick={() => navigate('/home')}
          className="absolute top-4 left-4 p-2 rounded-full text-pink-300 
            hover:text-pink-100 hover:bg-pink-400/20 transition"
        >
          <FaArrowLeft size={20} />
        </button>

        <h2 className="text-3xl font-bold text-pink-300 mb-6">
          Crypto Deposit
        </h2>

        <select
          value={coin}
          onChange={(e) => setCoin(e.target.value)}
          className="w-full mb-4 px-4 py-2 rounded-lg bg-black/40 border border-pink-300 text-pink-100
            focus:outline-none focus:border-blue-300 focus:shadow-[0_0_10px_#99ccff] transition"
        >
          <option value="usdt">USDT (TRC20)</option>
          <option value="bnb">BNB (BEP20)</option>
          <option value="btc">BTC</option>
        </select>

        <div className="text-sm mb-4 text-white/80">
          <span className="block">Send crypto to the address below:</span>
          <span className="break-all text-pink-300 mt-2 inline-block font-mono">
            {walletAddresses[coin]}
          </span>
        </div>

        <input
          type="number"
          placeholder="Amount (USD)"
          className="w-full mb-4 px-4 py-2 rounded-lg bg-black/40 border border-pink-300 text-pink-100
            focus:outline-none focus:border-blue-300 focus:shadow-[0_0_10px_#99ccff] transition"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Transaction ID (txId)"
          className="w-full mb-6 px-4 py-2 rounded-lg bg-black/40 border border-pink-300 text-pink-100
            focus:outline-none focus:border-blue-300 focus:shadow-[0_0_10px_#99ccff] transition"
          value={txId}
          onChange={(e) => setTxId(e.target.value)}
          required
        />

        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 0 20px #99ccff' }}
          type="submit"
          className="w-full py-3 rounded-lg bg-gradient-to-r from-pink-400 to-blue-400 text-white font-bold
            relative overflow-hidden transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Deposit'}
        </motion.button>
      </motion.form>
    </div>
  );
}

export default Deposit;
