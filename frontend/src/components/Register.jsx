import React, { useState, useEffect, useRef } from 'react';
import axios from '../axios'; // ✅ Yeh aapki custom axios instance hai
import { Link, useNavigate } from 'react-router-dom';
import loginBg from '../assets/login-bg.jpg'; // ✅ same background

function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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

  const handleRegister = async (e) => {
    e.preventDefault();
    playClickSound();
    try {
      const res = await axios.post('/register', {
        username,
        email,
        password
      });
      alert('✅ Registration successful!');
      navigate('/login');
    } catch (err) {
      alert('❌ Registration failed: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="relative w-full min-h-screen">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${loginBg})`, zIndex: -1 }}
      >
        <div className="w-full h-full bg-black bg-opacity-60 backdrop-blur-sm"></div>
      </div>

      <div className="flex w-full min-h-screen">
        {/* ✅ FORM ON LEFT SIDE */}
        <div className="w-2/5 flex items-center justify-center px-10">
          <div className="w-full max-w-md backdrop-blur-lg bg-white/10 border border-white/20 p-8 rounded-2xl shadow-xl">
            <h2 className="text-3xl font-semibold text-white mb-2">Create Account</h2>
            <p className="text-white/70 mb-6">Fill in the details to start your journey</p>

            <form onSubmit={handleRegister} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onMouseEnter={playHoverSound}
                  required
                  className="mt-1 w-full px-4 py-2 border border-white/20 bg-white/20 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onMouseEnter={playHoverSound}
                  required
                  className="mt-1 w-full px-4 py-2 border border-white/20 bg-white/20 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
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
                  className="mt-1 w-full px-4 py-2 border border-white/20 bg-white/20 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
              </div>

              <button
                type="submit"
                onMouseEnter={playHoverSound}
                onClick={playClickSound}
                className="w-full py-2 px-4 bg-black text-white font-semibold rounded-md hover:bg-gray-800 transition"
              >
                Sign Up
              </button>

              <p className="text-center text-sm text-white mt-6">
                Already have an account?{' '}
                <Link to="/login" className="text-pink-400 hover:underline">
                  Login
                </Link>
              </p>
            </form>
          </div>
        </div>

        {/* ✅ QUOTE ON RIGHT SIDE */}
        <div className="w-3/5 z-10 flex items-center px-24 text-white">
          <div className="backdrop-blur-lg bg-white/10 border border-white/20 w-full p-12 rounded-2xl shadow-lg">
            <p className="text-sm mb-4 opacity-80">A WISE QUOTE</p>
            <h1 className="text-7xl font-extrabold leading-tight mb-6 whitespace-pre-line">
              Join{'\n'}the Journey
            </h1>
            <p className="text-sm opacity-70">
              You can get everything you want if you work hard, trust the process, and stick to the plan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
