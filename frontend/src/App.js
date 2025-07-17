import React from 'react';
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



function App() {
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
              <Home />
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
