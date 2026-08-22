import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMe } from '../redux/slices/authSlice';

// Layouts & Guards
import AuthLayout from '../layouts/AuthLayout';
import StartupLayout from '../components/layout/StartupLayout';
import ProtectedRoutes from './ProtectedRoutes';

// Pages
import Home from '../pages/Home';
import HousingHub from '../pages/HousingHub';
import Dashboard from '../pages/Dashboard';
import Chat from '../pages/Chat';
import Profile from '../pages/Profile';
import Notifications from '../pages/Notifications';

// Auth Pages
import Register from '../pages/auth/Register';
import VerifyOtp from '../pages/auth/VerifyOtp';
import Login from '../pages/auth/Login';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';

export default function AppRoutes() {
  const dispatch = useDispatch();
  const { isAuthenticated, accessToken } = useSelector((state) => state.auth);

  useEffect(() => {
    if (accessToken) {
      dispatch(fetchMe());
    }
  }, [dispatch, accessToken]);

  return (
    <Routes>
      {/* ── Public Auth Pages (AuthLayout) ──────────────────────── */}
      <Route element={<AuthLayout />}>
        <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      {/* ── Main Platform Pages (StartupLayout) ──────────────────── */}
      <Route element={<StartupLayout />}>
        {/* Landing Page */}
        <Route path="/" element={<Home />} />
        
        {/* Protected Student Routes — Requires Login */}
        <Route element={<ProtectedRoutes />}>
          <Route path="/housing" element={<HousingHub />} />
          <Route path="/nearby-pgs" element={<HousingHub />} />
          <Route path="/roommates" element={<HousingHub />} />
          <Route path="/marketplace" element={<HousingHub />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/messages" element={<Chat />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/notifications" element={<Notifications />} />
        </Route>
      </Route>

      {/* ── Fallback Route ──────────────────────────────────────── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
