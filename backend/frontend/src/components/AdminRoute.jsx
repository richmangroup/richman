import React from 'react';
import { Navigate } from 'react-router-dom';

function AdminRoute({ children }) {
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('user');

  // ✅ Safe parse only if data exists
  let user = null;
  try {
    if (userData) {
      user = JSON.parse(userData);
    }
  } catch (err) {
    console.error('Invalid user JSON:', err);
    return <Navigate to="/login" />;
  }

  // 🚫 Not logged in or invalid user
  if (!token || !user) return <Navigate to="/login" />;

  // 🚫 Not admin
  if (!user.isAdmin) return <Navigate to="/home" />;

  // ✅ Admin user
  return children;
}

export default AdminRoute;
