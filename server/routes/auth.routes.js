'use strict';

const express  = require('express');
const router   = express.Router();

const {
  register,
  verifyOtp,
  resendOtp,
  login,
  refreshToken,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
} = require('../controllers/auth.controller');

const { protect }                                                     = require('../middleware/auth.middleware');
const { validate }                                                    = require('../middleware/validate.middleware');
const { registerValidator, loginValidator, otpValidator, resetPasswordValidator } = require('../validators/auth.validator');

// ── Public Routes ───────────────────────────────────────────
router.post('/register',        registerValidator,      validate, register);
router.post('/verify-otp',      otpValidator,           validate, verifyOtp);
router.post('/resend-otp',      loginValidator.slice(0, 1), validate, resendOtp);
router.post('/login',           loginValidator,         validate, login);
router.post('/refresh-token',   refreshToken);
router.post('/forgot-password', loginValidator.slice(0, 1), validate, forgotPassword);
router.post('/reset-password',  resetPasswordValidator, validate, resetPassword);

// ── Protected Routes ────────────────────────────────────────
router.post('/logout', protect, logout);
router.get('/me',      protect, getMe);

module.exports = router;
