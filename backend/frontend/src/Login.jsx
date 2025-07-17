import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/users/login', { email, password });
      alert('✅ Login successful!');
      localStorage.setItem('token', res.data.token);
      navigate("/home"); // ya jis page pe jana hai
    } catch (err) {
      alert('❌ Login failed: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-900">
      <form
        onSubmit={handleLogin}
        className="bg-gray-800 p-8 rounded-xl shadow-lg w-96"
      >
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          Login
        </h2>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Email"
          className="w-full mb-4 px-4 py-2 rounded bg-gray-700 text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          className="w-full mb-6 px-4 py-2 rounded bg-gray-700 text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded"
        >
          Login
        </button>
        <div className="mt-4 text-center">
          <Link to="/register" className="text-blue-400 hover:underline">
            Don't have an account? Register
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
