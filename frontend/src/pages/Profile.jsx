import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Particles from 'react-tsparticles';
import { FaArrowLeft, FaUserCircle } from 'react-icons/fa';

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
        if (!token) {
          navigate('/');
          return;
        }
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
      const response = await axios.patch(
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
    if (!selectedFile) {
      setUploadStatus('Please select a file.');
      return;
    }
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
    return <div className="h-screen flex items-center justify-center bg-black text-white">Loading...</div>;
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black px-4">
      <Particles
        options={{
          fullScreen: { enable: false },
          fpsLimit: 60,
          interactivity: {
            events: { onHover: { enable: false }, resize: true },
          },
          particles: {
            number: { value: 50, density: { enable: true, area: 800 } },
            color: { value: ['#ff99cc', '#99ccff', '#ffffff'] },
            links: {
              enable: true,
              distance: 120,
              color: '#ffffff',
              opacity: 0.15,
              width: 1,
            },
            move: { enable: true, speed: 0.3, random: true },
            opacity: { value: 0.3, random: true },
            shape: { type: 'circle' },
            size: { value: { min: 0.8, max: 2 } },
          },
          detectRetina: true,
        }}
        className="absolute inset-0 z-0"
      />

      <div className="relative z-10 p-10 w-full max-w-md rounded-3xl bg-black/40 backdrop-blur-2xl border border-pink-300 text-center">
        <button
          onClick={() => {
            playClickSound();
            navigate('/home');
          }}
          className="absolute top-4 left-4 text-pink-300 hover:text-pink-100 transition"
        >
          <FaArrowLeft size={24} />
        </button>

        <div className="mb-4">
          {user.profilePic ? (
            <img
              src={user.profilePic}
              alt="Profile"
              className="mx-auto rounded-full w-24 h-24 object-cover border-2 border-pink-300"
            />
          ) : (
            <FaUserCircle className="text-pink-300 mx-auto" size={80} />
          )}
        </div>

        <h2 className="text-4xl font-bold text-pink-300 mb-6">Profile</h2>
        <p className="mb-3"><strong>Username:</strong> {user.username}</p>
        <p className="mb-3"><strong>Email:</strong> {user.email}</p>
        <p className="mb-6"><strong>Balance:</strong> ${user.balance}</p>

        <div className="mb-6">
          <input
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            placeholder="New username"
            className="mb-3 px-3 py-2 rounded w-full text-pink-100 bg-black/40 border border-pink-300 focus:outline-none"
          />
          <button
            onClick={handleUsernameUpdate}
            className="w-full py-2 rounded-lg bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold"
          >
            Update Username
          </button>
          {usernameStatus && <p className="mt-2 text-sm text-pink-200">{usernameStatus}</p>}
        </div>

        <div className="mb-6">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setSelectedFile(e.target.files[0])}
            className="mb-3 text-pink-200"
          />
          <button
            onClick={handleProfilePicUpload}
            className="w-full py-2 rounded-lg bg-gradient-to-r from-purple-400 to-pink-500 text-white font-bold"
          >
            Upload Picture
          </button>
          {uploadStatus && <p className="mt-2 text-sm text-pink-200">{uploadStatus}</p>}
        </div>

        <hr className="border-pink-300 mb-6" />

        <h3 className="text-xl font-semibold text-pink-200 mb-4">Reset Password</h3>
        <form onSubmit={handleResetPassword} className="flex flex-col items-center">
          <input
            type="email"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="mb-4 px-3 py-2 rounded w-full text-pink-100 bg-black/40 border border-pink-300 focus:outline-none"
          />
          <button
            type="submit"
            onClick={playClickSound}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-red-400 to-pink-500 text-white font-bold"
          >
            Send Reset Link
          </button>
        </form>
        {resetStatus && <p className="mt-4 text-sm text-pink-200">{resetStatus}</p>}
      </div>
    </div>
  );
}

export default Profile;
