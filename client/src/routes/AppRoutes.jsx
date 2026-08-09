import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMe } from '../redux/slices/authSlice';

// Layouts & Guards
import AuthLayout from '../layouts/AuthLayout';
import ProtectedRoutes from './ProtectedRoutes';

// Pages
import Register from '../pages/auth/Register';
import VerifyOtp from '../pages/auth/VerifyOtp';
import Login from '../pages/auth/Login';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';
import Dashboard from '../pages/Dashboard';

export default function AppRoutes() {
  const dispatch = useDispatch();
  const { isAuthenticated, accessToken } = useSelector((state) => state.auth);

  // Check initial session if token exists
  useEffect(() => {
    if (accessToken && !isAuthenticated) {
      dispatch(fetchMe());
    }
  }, [dispatch, accessToken, isAuthenticated]);

  return (
    <Routes>
      {/* ── Public Auth Routes ─────────────────────────────────── */}
      <Route element={<AuthLayout />}>
        <Route path="/register font" element={<Navigate to="/register" replace />} />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />}
        />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      {/* ── Protected Student Routes ───────────────────────────── */}
      <Route element={<ProtectedRoutes />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

      {/* ── Fallback Route ─────────────────────────────────────── */}
      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />}
      />
    </Routes>
  );
}
