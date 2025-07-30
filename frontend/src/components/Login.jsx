import React, { useState, useEffect, useRef } from 'react';
import axios from '../axios';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import loginBg from '../assets/login-bg.jpg';
import { useGoogleLogin } from '@react-oauth/google';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [quote, setQuote] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const hoverSound = useRef(null);
  const clickSound = useRef(null);

  const motivationalQuotes = [
    "Get\nEverything\nYou Want",
    "Success\nComes To\nThose Who Hustle",
    "Dream\nBig And\nNever Stop",
    "Push\nYour Limits\nEvery Day",
    "Work\nSmart And\nStay Consistent"
  ];

  useEffect(() => {
    setQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);
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

  const showToastMessage = (message, duration = 2500) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), duration);
  };

 const handleLogin = async (e) => {
  e.preventDefault();
  playClickSound();
  try {
    const res = await axios.post("/login", { email, password });
 // ✅ FIXED
    const userData = res.data.user || {};
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(userData));
    showToastMessage('✅ Login successful!');
    const isAdmin = userData?.isAdmin === true;
    setTimeout(() => navigate(isAdmin ? '/admin' : '/home'), 2000);
  } catch (err) {
    showToastMessage('❌ Login failed: ' + (err.response?.data?.message || err.message));
  }
};


  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log('Google token:', tokenResponse);
      showToastMessage('✅ Google login successful!');
      setTimeout(() => navigate('/home'), 2000);
    },
    onError: () => {
      showToastMessage('❌ Google login failed!');
    },
    flow: 'implicit',
  });

  return (
    <div className="relative w-full min-h-screen">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${loginBg})`, zIndex: -1 }}
      >
        <div className="w-full h-full bg-black bg-opacity-60 backdrop-blur-sm"></div>
      </div>

      <div className="flex flex-col lg:flex-row w-full min-h-screen p-4 gap-6">
        {/* Quote Block */}
        <div className="lg:w-3/5 w-full flex items-center justify-center text-white">
          <div className="backdrop-blur-lg bg-white/10 border border-white/20 w-full max-w-3xl p-6 md:p-12 rounded-2xl shadow-lg">
            <p className="text-sm mb-4 opacity-80">A WISE QUOTE</p>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6 whitespace-pre-line">
              {quote}
            </h1>
            <p className="text-sm opacity-70">
              You can get everything you want if you work hard, trust the process, and stick to the plan.
            </p>
          </div>
        </div>

        {/* Login Form */}
        <div className="lg:w-2/5 w-full flex items-center justify-center">
          <div className="w-full max-w-md backdrop-blur-lg bg-white/10 border border-white/20 p-6 md:p-8 rounded-2xl shadow-xl">
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-2">Welcome Back</h2>
            <p className="text-white/70 mb-6 text-sm md:text-base">
              Enter your email and password to access your account
            </p>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-white">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onMouseEnter={playHoverSound}
                  required
                  className="mt-1 w-full px-4 py-2 border border-white/20 bg-white/20 text-white rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onMouseEnter={playHoverSound}
                  required
                  className="mt-1 w-full px-4 py-2 border border-white/20 bg-white/20 text-white rounded-md"
                />
              </div>

              <button
                type="submit"
                onMouseEnter={playHoverSound}
                className="w-full py-2 px-4 bg-black text-white font-semibold rounded-md hover:bg-gray-800 transition"
              >
                Sign In
              </button>

              <button
                type="button"
                onClick={googleLogin}
                onMouseEnter={playHoverSound}
                className="w-full py-2 px-4 border border-white/30 text-white font-semibold rounded-md flex items-center justify-center hover:bg-white/10 transition"
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  className="w-5 h-5 mr-2"
                />
                Sign In with Google
              </button>

              <p className="text-center text-sm text-white mt-6">
                Don’t have an account?{' '}
                <Link to="/register" className="text-pink-400 hover:underline">
                  Sign Up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Toast Animation */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-80 text-white px-6 py-4 rounded-xl shadow-2xl z-50 text-lg font-semibold backdrop-blur"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Login;
