import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMe } from '../redux/slices/authSlice';

// Layouts & Guards
import AuthLayout from '../layouts/AuthLayout';
import StartupLayout from '../components/layout/StartupLayout';
import ProtectedRoutes from './ProtectedRoutes';
import AdminRoute from '../components/routing/AdminRoute';
import AdminLayout from '../layouts/AdminLayout';

// Pages
import Home from '../pages/Home';
import HousingHub from '../pages/HousingHub';
import RoommateFinder from '../pages/RoommateFinder';
import NearbyPGsPage from '../pages/NearbyPGsPage';
import Marketplace from '../pages/Marketplace';
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

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminMarketplace from '../pages/admin/AdminMarketplace';
import AdminHousing from '../pages/admin/AdminHousing';
import AdminReports from '../pages/admin/AdminReports';
import AdminReviews from '../pages/admin/AdminReviews';

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

      {/* 🛡️ Admin Platform Pages (AdminLayout) */}
      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/marketplace" element={<AdminMarketplace />} />
          <Route path="/admin/housing" element={<AdminHousing />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/admin/reviews" element={<AdminReviews />} />
        </Route>
      </Route>

      {/* ── Main Platform Pages (StartupLayout) ──────────────────── */}
      <Route element={<StartupLayout />}>
        {/* Landing Page */}
        <Route path="/" element={<Home />} />
        
        {/* Protected Student Routes — Requires Login */}
        <Route element={<ProtectedRoutes />}>
          <Route path="/housing" element={<Navigate to="/roommates" replace />} />
          <Route path="/pgs" element={<NearbyPGsPage />} />
          <Route path="/roommates" element={<RoommateFinder />} />
          <Route path="/marketplace" element={<Marketplace />} />
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
