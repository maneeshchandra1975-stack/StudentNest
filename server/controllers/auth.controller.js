'use strict';

const jwt          = require('jsonwebtoken');
const User         = require('../models/User.model');
const OTP          = require('../models/OTP.model');
const ApiError     = require('../utils/ApiError');
const ApiResponse  = require('../utils/ApiResponse');
const { generateOTP, verifyOTP }               = require('../utils/generateOTP');
const { generateAccessToken, generateRefreshToken, refreshTokenCookieOptions } = require('../utils/generateToken');
const { sendOTPEmail }                         = require('../services/email.service');

// ── REGISTER ────────────────────────────────────────────────
/**
 * POST /api/v1/auth/register
 * Creates a new unverified student account and sends OTP
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(409, 'An account with this email already exists.');
    }

    // 2. Create user (password auto-hashed via pre-save hook)
    const user = await User.create({ name, email, password });

    // 3. Generate OTP
    const { otp, hashedOTP } = await generateOTP();

    // 4. Delete any previous OTP for this email
    await OTP.deleteMany({ email });

    // 5. Store hashed OTP in DB with expiry
    const expiresAt = new Date(
      Date.now() + parseInt(process.env.OTP_EXPIRES_MINUTES, 10) * 60 * 1000
    );
    await OTP.create({ email, otp: hashedOTP, expiresAt });

    // 6. Send OTP via email
    await sendOTPEmail(email, otp, name);

    res.status(201).json(
      new ApiResponse(201, `Account created. An OTP has been sent to ${email}. Please verify your email.`, {
        userId: user._id,
        email:  user.email,
        name:   user.name,
      })
    );
  } catch (error) {
    next(error);
  }
};

// ── VERIFY OTP ──────────────────────────────────────────────
/**
 * POST /api/v1/auth/verify-otp
 * Verifies the OTP and marks the user as verified
 */
const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    // 1. Find the latest OTP record for this email
    const otpRecord = await OTP.findOne({ email }).sort({ createdAt: -1 });
    if (!otpRecord) {
      throw new ApiError(400, 'OTP not found or has expired. Please request a new OTP.');
    }

    // 2. Check if OTP has expired
    if (otpRecord.expiresAt < new Date()) {
      await OTP.deleteMany({ email });
      throw new ApiError(400, 'OTP has expired. Please request a new one.');
    }

    // 3. Verify OTP
    const isValid = await verifyOTP(otp, otpRecord.otp);
    if (!isValid) {
      throw new ApiError(400, 'Invalid OTP. Please try again.');
    }

    // 4. Mark user as verified
    await User.findOneAndUpdate({ email }, { isVerified: true });

    // 5. Delete used OTP
    await OTP.deleteMany({ email });

    res.status(200).json(
      new ApiResponse(200, 'Email verified successfully. You can now log in.')
    );
  } catch (error) {
    next(error);
  }
};

// ── RESEND OTP ──────────────────────────────────────────────
/**
 * POST /api/v1/auth/resend-otp
 * Resends a fresh OTP to the student's email
 */
const resendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;

    // 1. Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(404, 'No account found with this email.');
    }

    if (user.isVerified) {
      throw new ApiError(400, 'This email is already verified.');
    }

    // 2. Generate new OTP
    const { otp, hashedOTP } = await generateOTP();

    // 3. Delete old OTPs
    await OTP.deleteMany({ email });

    // 4. Store new hashed OTP
    const expiresAt = new Date(
      Date.now() + parseInt(process.env.OTP_EXPIRES_MINUTES, 10) * 60 * 1000
    );
    await OTP.create({ email, otp: hashedOTP, expiresAt });

    // 5. Send OTP email
    await sendOTPEmail(email, otp, user.name);

    res.status(200).json(
      new ApiResponse(200, `A new OTP has been sent to ${email}.`)
    );
  } catch (error) {
    next(error);
  }
};

// ── LOGIN ───────────────────────────────────────────────────
/**
 * POST /api/v1/auth/login
 * Authenticates user, returns access token + sets refresh token cookie
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Find user (include password for comparison)
    const user = await User.findOne({ email }).select('+password +refreshToken');
    if (!user) {
      throw new ApiError(401, 'Invalid email or password.');
    }

    // 2. Check password
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      throw new ApiError(401, 'Invalid email or password.');
    }

    // 3. Check if email is verified
    if (!user.isVerified) {
      throw new ApiError(403, 'Please verify your email address before logging in.');
    }

    // 4. Generate tokens
    const accessToken  = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    // 5. Save refresh token in DB (hashed storage optional — storing plain for now)
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    // 6. Set refresh token in httpOnly cookie
    res.cookie('refreshToken', refreshToken, refreshTokenCookieOptions);

    res.status(200).json(
      new ApiResponse(200, 'Logged in successfully.', {
        accessToken,
        user: {
          _id:        user._id,
          name:       user.name,
          email:      user.email,
          role:       user.role,
          isVerified: user.isVerified,
          avatar:     user.avatar,
        },
      })
    );
  } catch (error) {
    next(error);
  }
};

// ── REFRESH TOKEN ───────────────────────────────────────────
/**
 * POST /api/v1/auth/refresh-token
 * Issues a new access token using the refresh token from cookie
 */
const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
      throw new ApiError(401, 'No refresh token. Please login again.');
    }

    // 1. Verify refresh token
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    // 2. Find user
    const user = await User.findById(decoded.userId).select('+refreshToken');
    if (!user || user.refreshToken !== token) {
      throw new ApiError(401, 'Invalid refresh token. Please login again.');
    }

    // 3. Issue new access token
    const accessToken = generateAccessToken(user._id, user.role);

    res.status(200).json(
      new ApiResponse(200, 'Access token refreshed.', { accessToken })
    );
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(new ApiError(401, 'Refresh token expired. Please login again.'));
    }
    next(error);
  }
};

// ── LOGOUT ──────────────────────────────────────────────────
/**
 * POST /api/v1/auth/logout
 * Clears refresh token cookie and removes from DB
 */
const logout = async (req, res, next) => {
  try {
    // Remove refresh token from DB
    await User.findByIdAndUpdate(req.user._id, { refreshToken: '' });

    // Clear cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(200).json(new ApiResponse(200, 'Logged out successfully.'));
  } catch (error) {
    next(error);
  }
};

// ── GET CURRENT USER ────────────────────────────────────────
/**
 * GET /api/v1/auth/me
 * Returns the currently logged-in user's profile
 */
const getMe = async (req, res, next) => {
  try {
    res.status(200).json(
      new ApiResponse(200, 'User profile fetched.', { user: req.user })
    );
  } catch (error) {
    next(error);
  }
};

// ── FORGOT PASSWORD ─────────────────────────────────────────
/**
 * POST /api/v1/auth/forgot-password
 * Sends a password reset OTP to the student's email
 */
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(404, 'No user found with this email address.');
    }

    const { otp, hashedOTP } = await generateOTP();
    await OTP.deleteMany({ email });

    const expiresAt = new Date(
      Date.now() + parseInt(process.env.OTP_EXPIRES_MINUTES || '10', 10) * 60 * 1000
    );
    await OTP.create({ email, otp: hashedOTP, expiresAt });

    await sendOTPEmail(email, otp, user.name);

    res.status(200).json(
      new ApiResponse(200, `Password reset OTP sent to ${email}.`)
    );
  } catch (error) {
    next(error);
  }
};

// ── RESET PASSWORD ──────────────────────────────────────────
/**
 * POST /api/v1/auth/reset-password
 * Resets user password after verifying OTP
 */
const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;

    const otpRecord = await OTP.findOne({ email }).sort({ createdAt: -1 });
    if (!otpRecord) {
      throw new ApiError(400, 'OTP not found or expired. Request a new OTP.');
    }

    if (otpRecord.expiresAt < new Date()) {
      await OTP.deleteMany({ email });
      throw new ApiError(400, 'OTP has expired. Please request a new one.');
    }

    const isValid = await verifyOTP(otp, otpRecord.otp);
    if (!isValid) {
      throw new ApiError(400, 'Invalid OTP code.');
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(404, 'User not found.');
    }

    user.password = newPassword; // pre('save') hook will hash it automatically
    await user.save();

    await OTP.deleteMany({ email });

    res.status(200).json(
      new ApiResponse(200, 'Password reset successful. You can now login with your new password.')
    );
  } catch (error) {
    next(error);
  }
};

module.exports = { register, verifyOtp, resendOtp, login, refreshToken, logout, getMe, forgotPassword, resetPassword };
