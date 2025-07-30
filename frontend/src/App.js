import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import PromoCode from './components/PromoCode';
import Home from './pages/Home';
import Deposit from './pages/Deposit';
import Withdraw from './pages/Withdraw';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import ResetPassword from './pages/ResetPassword';
import About from './pages/About';
import AdminRoute from './components/AdminRoute';
import AdminPanel from './pages/AdminPanel';
import CrashGame from './components/CrashGame';
import AdminVideos from "./pages/AdminVideos";

function App() {
  const [balance, setBalance] = useState(0);

  // Load balance on first render
  useEffect(() => {
    const fetchBalance = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        // ✅ Backend ka URL REACT_APP_API_URL se lena
        const res = await fetch(`${process.env.REACT_APP_API_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setBalance(data.balance || 0);
      } catch (err) {
        console.error('Failed to fetch user balance:', err);
      }
    };

    fetchBalance();
  }, []);

  const updateBalance = (amount) => {
    setBalance((prev) => parseFloat((prev + amount).toFixed(2)));
  };
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login key="login" />} />
        <Route path="/register" element={<Register key="register" />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/videos"
          element={<AdminVideos />}
        />
        <Route
          path="/promo"
          element={
            <ProtectedRoute>
              <PromoCode />
            </ProtectedRoute>
          }
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home balance={balance} updateBalance={updateBalance} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/deposit"
          element={
            <ProtectedRoute>
              <Deposit />
            </ProtectedRoute>
          }
        />
        <Route
          path="/crash-game"
          element={
            <ProtectedRoute>
              <CrashGame
                balance={balance}
                updateBalance={(amount) =>
                  setBalance((prev) => parseFloat((prev + amount).toFixed(2)))
                }
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/withdraw"
          element={
            <ProtectedRoute>
              <Withdraw />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPanel />
            </AdminRoute>
          }
        />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </>
  );
}

export default App;
