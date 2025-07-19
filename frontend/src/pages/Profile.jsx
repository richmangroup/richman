import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Particles from 'react-tsparticles';
import { FaArrowLeft, FaUserCircle, FaCamera } from 'react-icons/fa';
import { motion } from 'framer-motion';

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [resetEmail, setResetEmail] = useState('');
  const [resetStatus, setResetStatus] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [usernameStatus, setUsernameStatus] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const clickSound = useRef(null);

  useEffect(() => {
    clickSound.current = new Audio(process.env.PUBLIC_URL + '/sounds/click.mp3');
    clickSound.current.volume = 0.3;
  }, []);

  const playClickSound = () => {
    if (clickSound.current) {
      clickSound.current.currentTime = 0;
      clickSound.current.play();
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/');
        const res = await axios.get('http://localhost:5000/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        setResetEmail(res.data.email);
        setNewUsername(res.data.username);
      } catch (err) {
        alert('❌ Could not fetch profile.');
        navigate('/');
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleUsernameUpdate = async () => {
    playClickSound();
    setUsernameStatus('Updating...');
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        'http://localhost:5000/api/users/update-username',
        { username: newUsername },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser({ ...user, username: newUsername });
      setUsernameStatus('✅ Username updated!');
    } catch (error) {
      setUsernameStatus('❌ Failed to update username.');
    }
  };

  const handleProfilePicUpload = async () => {
    if (!selectedFile) return setUploadStatus('Please select a file.');
    playClickSound();
    setUploadStatus('Uploading...');
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('profilePic', selectedFile);
      const res = await axios.post(
        'http://localhost:5000/api/users/upload-profile-pic',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setUser({ ...user, profilePic: res.data.profilePicUrl });
      setUploadStatus('✅ Profile picture uploaded!');
    } catch (err) {
      setUploadStatus('❌ Failed to upload picture.');
    }
  };
  const handleResetPassword = async (e) => {
    e.preventDefault();
    playClickSound();
    setResetStatus('Sending...');
    try {
      await axios.post('http://localhost:5000/api/users/reset-password-request', {
        email: resetEmail,
      });
      setResetStatus('✅ Reset link sent!');
    } catch (err) {
      setResetStatus('❌ Failed to send reset email.');
    }
  };

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white text-xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-tr from-[#0f0c29] via-[#302b63] to-[#24243e] px-4 overflow-hidden">
      <Particles
        options={{
          fullScreen: { enable: false },
          particles: {
            number: { value: 50, density: { enable: true, area: 800 } },
            color: { value: ['#00ffe7', '#ff00ff'] },
            links: {
              enable: true,
              distance: 130,
              color: '#ffffff',
              opacity: 0.1,
              width: 1,
            },
            move: { enable: true, speed: 0.4, random: true },
            opacity: { value: 0.3, random: true },
            shape: { type: 'circle' },
            size: { value: { min: 1, max: 3 } },
          },
        }}
        className="absolute inset-0 z-0"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-5xl bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-6 grid md:grid-cols-2 gap-6 text-white"
      >
        {/* Back Button */}
        <button
          onClick={() => {
            playClickSound();
            navigate('/home');
          }}
          className="absolute top-4 left-4 text-white hover:text-pink-300 transition"
        >
          <FaArrowLeft size={22} />
        </button>

        {/* Profile Info Card */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="relative group">
            {user.profilePic ? (
              <img
                src={user.profilePic}
                alt="Profile"
                className="w-36 h-36 object-cover rounded-full border-4 border-pink-500 shadow-lg"
              />
            ) : (
              <FaUserCircle className="text-pink-300" size={120} />
            )}
            <label className="absolute bottom-2 right-2 bg-pink-600 p-2 rounded-full cursor-pointer hover:scale-105 transition-transform">
              <FaCamera />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                className="hidden"
              />
            </label>
          </div>
          <button
            onClick={handleProfilePicUpload}
            className="px-4 py-2 bg-pink-500 hover:bg-pink-400 transition rounded-lg text-sm font-semibold"
          >
            Upload Picture
          </button>
          {uploadStatus && (
            <p className="text-sm text-pink-200">{uploadStatus}</p>
          )}

          <div className="text-lg">
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Balance:</strong> ${user.balance}</p>
          </div>
        </div>

        {/* Actions Form Card */}
        <div className="space-y-8">
          {/* Username */}
          <div>
            <label className="block mb-2 text-pink-200 font-semibold">Change Username</label>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="New username"
              className="w-full px-4 py-2 rounded-lg bg-black/30 border border-pink-300 focus:outline-none text-white"
            />
            <button
              onClick={handleUsernameUpdate}
              className="w-full mt-3 py-2 rounded-lg bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold hover:scale-105 transition-transform"
            >
              Update Username
            </button>
            {usernameStatus && (
              <p className="mt-2 text-sm text-pink-200">{usernameStatus}</p>
            )}
          </div>

          {/* Password Reset */}
          <div>
            <label className="block mb-2 text-pink-200 font-semibold">Reset Password</label>
            <form onSubmit={handleResetPassword} className="space-y-3">
              <input
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="Your email"
                required
                className="w-full px-4 py-2 rounded-lg bg-black/30 border border-pink-300 focus:outline-none text-white"
              />
              <button
                type="submit"
                onClick={playClickSound}
                className="w-full py-2 rounded-lg bg-gradient-to-r from-red-400 to-pink-500 text-white font-bold hover:scale-105 transition-transform"
              >
                Send Reset Link
              </button>
              {resetStatus && (
                <p className="text-sm text-pink-200">{resetStatus}</p>
              )}
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Profile;
