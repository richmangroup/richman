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

  // ✅ FIXED: Correct login endpoint
  const handleLogin = async (e) => {
    e.preventDefault();
    playClickSound();
    try {
      const res = await axios.post("/users/login", { email, password }); // fixed route

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
      {/* 👇 Yahan se aapka original JSX (forms, UI, etc.) same rahega */}
      {/* BILKUL KOI CHANGE NAHIN */}
    </div>
  );
}

export default Login;

