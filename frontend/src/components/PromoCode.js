import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Particles from 'react-tsparticles';
import { FaGift, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function PromoCode() {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const hoverSound = useRef(null);
  const clickSound = useRef(null);

  useEffect(() => {
    const initAudio = () => {
      hoverSound.current = new Audio(process.env.PUBLIC_URL + '/sounds/hover.mp3');
      clickSound.current = new Audio(process.env.PUBLIC_URL + '/sounds/click.mp3');
      hoverSound.current.volume = 0.2;
      clickSound.current.volume = 0.3;
      document.removeEventListener('click', initAudio);
      document.removeEventListener('keydown', initAudio);
    };
    document.addEventListener('click', initAudio);
    document.addEventListener('keydown', initAudio);
    return () => {
      document.removeEventListener('click', initAudio);
      document.removeEventListener('keydown', initAudio);
    };
  }, []);

  const playHoverSound = () => {
    if (hoverSound.current) {
      hoverSound.current.currentTime = 0;
      hoverSound.current.play();
    }
  };

  const playClickSound = () => {
    if (clickSound.current) {
      clickSound.current.currentTime = 0;
      clickSound.current.play();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    playClickSound();
    if (code === 'FREE100') {
      setMessage('✅ Promo code applied successfully!');
    } else {
      setMessage('❌ Invalid promo code.');
    }
  };

  const handleBack = () => {
    playClickSound();
    navigate('/home');
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden">
      <Particles
        options={{
          fullScreen: { enable: false },
          fpsLimit: 60,
          interactivity: {
            events: { onHover: { enable: true, mode: 'grab' }, resize: true },
            modes: { grab: { distance: 150, line_linked: { opacity: 0.5 } } },
          },
          particles: {
            number: { value: 60, density: { enable: true, area: 800 } },
            color: { value: ['#ff99cc', '#99ccff', '#ffffff'] },
            links: {
              enable: true,
              distance: 140,
              color: '#ffffff',
              opacity: 0.2,
              width: 1,
            },
            move: { enable: true, speed: 0.6, random: true, outModes: 'out' },
            opacity: { value: 0.4, random: true },
            shape: { type: 'circle' },
            size: { value: { min: 1, max: 3 } },
            twinkle: {
              particles: { enable: true, frequency: 0.05, opacity: 0.4 },
              lines: { enable: true, frequency: 0.02, opacity: 0.2 },
            },
          },
          detectRetina: true,
        }}
        className="absolute inset-0 z-0"
      />

      <motion.form
        onSubmit={handleSubmit}
        className="relative z-10 w-[90%] max-w-md p-8 sm:p-10 rounded-[28px] bg-[#0c0c1a]/60 backdrop-blur-2xl
        border border-white/10 shadow-[inset_0_0_20px_#00000099,_0_0_40px_#ffffff0d] group overflow-hidden transition-all duration-500"
        initial={{ scale: 1 }}
        animate={{ y: [0, -3, 0] }}
        transition={{ repeat: Infinity, duration: 6 }}
        whileHover={{ scale: 1.015 }}
      >
        <div className="absolute -inset-1 rounded-[28px] bg-gradient-to-tr from-pink-400 via-indigo-500 to-blue-500 
        blur-xl opacity-0 group-hover:opacity-60 transition duration-700 pointer-events-none" />

        <motion.button
          onClick={handleBack}
          onMouseEnter={playHoverSound}
          whileHover={{ scale: 1.2 }}
          className="absolute top-4 left-4 text-pink-300 hover:text-pink-400 text-2xl transition"
          type="button"
        >
          <FaArrowLeft />
        </motion.button>

        <h2 className="text-center text-4xl sm:text-5xl font-bold mb-8 text-transparent bg-clip-text 
        bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300 drop-shadow-[0_0_15px_#ffffff22]">
          <FaGift className="inline-block mr-2 mb-1" />
          Promo Code
        </h2>

        <div className="relative mb-8">
          <FaGift className="absolute top-3.5 left-4 text-pink-300" />
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onMouseEnter={playHoverSound}
            required
            placeholder=" "
            className="peer w-full pl-10 pr-4 py-3 rounded-xl bg-[#111827]/60 text-pink-100 border 
            border-pink-400/40 focus:outline-none focus:ring-2 focus:ring-pink-400/50 
            focus:shadow-[0_0_20px_#ff99cc60] placeholder-transparent transition-all duration-300"
          />
          <label className="absolute left-10 top-2.5 text-sm text-pink-300 transition-all duration-300 
          peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-pink-400/50">
            Enter Your Code
          </label>
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.05 }}
          onMouseEnter={playHoverSound}
          onClick={playClickSound}
          className="relative w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 
            text-white font-bold shadow-xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_25px_#99ccff80]"
        >
          <span className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-full 
            transition-transform duration-700 ease-in-out" />
          <span className="relative z-10">Apply Code</span>
        </motion.button>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={`mt-6 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium tracking-wide 
              ${message.includes('✅')
                ? 'bg-green-500/10 text-green-300 border border-green-400/30'
                : 'bg-red-500/10 text-red-300 border border-red-400/30'}`}
          >
            <span className="text-lg">{message.includes('✅') ? '🎉' : '⚠️'}</span>
            {message}
          </motion.div>
        )}
      </motion.form>
    </div>
  );
}

export default PromoCode;
