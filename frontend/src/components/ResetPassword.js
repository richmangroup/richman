import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ResetPassword() {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setStatus('❌ Passwords do not match.');
      return;
    }

    try {
      const res = await axios.post(`http://localhost:5000/api/users/reset-password/${token}`, {
        newPassword,
      });
      setStatus('✅ Password reset successful.');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setStatus('❌ Failed to reset password.');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <form onSubmit={handleReset} className="bg-black/40 border border-pink-300 p-8 rounded-xl max-w-sm w-full text-center">
        <h2 className="text-2xl font-bold text-pink-300 mb-4">Reset Password</h2>
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="mb-3 w-full px-3 py-2 rounded bg-black/40 border border-pink-300 text-pink-100"
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="mb-3 w-full px-3 py-2 rounded bg-black/40 border border-pink-300 text-pink-100"
          required
        />
        <button
          type="submit"
          className="w-full py-2 rounded-lg bg-gradient-to-r from-red-400 to-pink-500 text-white font-bold"
        >
          Reset Password
        </button>
        {status && <p className="mt-4 text-sm text-pink-200">{status}</p>}
      </form>
    </div>
  );
}

export default ResetPassword;
