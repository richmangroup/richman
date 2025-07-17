import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ResetPassword() {
  const { token } = useParams(); // Get token from URL
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setStatus('');
    setLoading(true);

    try {
      const response = await axios.post(`http://localhost:5000/api/users/reset-password/${token}`, {
        password,
      });

      setStatus('✅ Password reset successful! Redirecting to login...');
      setTimeout(() => navigate('/'), 2000); // Redirect to login/home after 2 sec
    } catch (err) {
      console.error(err);
      setStatus('❌ Failed to reset password. Token may be expired or invalid.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="p-8 bg-black/40 rounded-xl border border-pink-300 backdrop-blur-md w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-pink-300 text-center">Reset Your Password</h2>

        <form onSubmit={handleReset} className="space-y-4">
          <input
            type="password"
            placeholder="Enter new password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded bg-black/30 border border-pink-300 focus:outline-none text-white"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-gradient-to-r from-red-400 to-pink-500 text-white font-bold rounded-lg"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        {status && <p className="mt-4 text-center text-sm text-pink-200">{status}</p>}
      </div>
    </div>
  );
}

export default ResetPassword;
