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
            events: { onHover: { enable: true, mode: "grab" }, resize: true },
            modes: { grab: { distance: 150, line_linked: { opacity: 0.5 } } },
          },
          particles: {
            number: { value: 60, density: { enable: true, area: 800 } },
            color: { value: ["#ff99cc", "#99ccff", "#ffffff"] },
            links: {
              enable: true, distance: 140, color: "#ffffff", opacity: 0.2, width: 1,
            },
            move: { enable: true, speed: 0.6, random: true, outModes: "out" },
            opacity: { value: 0.4, random: true },
            shape: { type: "circle" },
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
        className="relative z-10 p-10 w-96 rounded-3xl bg-black/40 backdrop-blur-2xl 
          border border-transparent hover:border-pink-300 group transition duration-500 
          shadow-[0_0_25px_#ff99cc]/30"
        initial={{ scale: 1 }}
        animate={{ y: [0, -5, 0] }}
        transition={{ repeat: Infinity, duration: 4 }}
        whileHover={{ scale: 1.03 }}
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300 
          rounded-3xl blur-lg opacity-0 group-hover:opacity-70 transition duration-700 pointer-events-none" />

        <motion.button
          onClick={handleBack}
          onMouseEnter={playHoverSound}
          whileHover={{ scale: 1.2, color: '#99ccff', textShadow: '0 0 10px #99ccff' }}
          className="absolute top-4 left-4 text-pink-300 text-2xl"
          type="button"
        >
          <FaArrowLeft />
        </motion.button>

        <h2 className="text-4xl font-bold text-pink-300 mb-8 text-center drop-shadow-[0_0_15px_#99ccff]">
          <FaGift className="inline-block mr-2" /> Promo Code
        </h2>

        <div className="relative mb-8">
          <FaGift className="absolute top-3 left-3 text-pink-300" />
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onMouseEnter={playHoverSound}
            required
            className="w-full pl-10 pr-4 py-3 bg-black/40 border border-pink-300 rounded-lg text-pink-100
              placeholder-transparent focus:outline-none focus:border-blue-300 focus:shadow-[0_0_15px_#99ccff]
              transition"
          />
          <label
            className={`absolute left-10 top-1 text-pink-300 text-sm pointer-events-none transition-all duration-300
            ${code ? '-translate-y-6 scale-90' : ''}`}>
            Enter Code
          </label>
        </div>

        <motion.button
          whileHover={{ scale: 1.1, boxShadow: "0 0 20px #99ccff" }}
          onMouseEnter={playHoverSound}
          onClick={playClickSound}
          className="w-full py-3 rounded-lg bg-gradient-to-r from-pink-400 to-blue-400 text-white font-bold 
            relative overflow-hidden transition"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-transparent 
            translate-x-[-100%] group-hover:translate-x-full transition-transform duration-700"></span>
          <span className="relative z-10">Apply Code</span>
        </motion.button>

        {/* Message with animation */}
        {message && (
          <motion.p
            className={`mt-6 text-center font-semibold ${
              message.includes('✅') ? 'text-green-400' : 'text-red-400'
            }`}
            initial={{ scale: 1, rotate: 0, x: 0 }}
            animate={
              message.includes('✅')
                ? { scale: [1, 1.5, 1], rotate: [0, 10, -10, 0] }
                : { x: [-10, 10, -10, 10, 0] }
            }
            transition={{ duration: 0.6 }}
          >
            {message}
          </motion.p>
        )}
      </motion.form>
    </div>
  );
}

export default PromoCode;
