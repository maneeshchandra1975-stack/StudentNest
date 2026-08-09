'use strict';

const jwt = require('jsonwebtoken');

/**
 * Generate JWT Access Token (short-lived: 15 minutes)
 */
const generateAccessToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m' }
  );
};

/**
 * Generate JWT Refresh Token (long-lived: 7 days)
 */
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES || '7d' }
  );
};

/**
 * Cookie options for refresh token
 * httpOnly = JS cannot access it (XSS protection)
 * secure   = only sent over HTTPS in production
 */
const refreshTokenCookieOptions = {
  httpOnly: true,
  secure:   process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge:   7 * 24 * 60 * 60 * 1000, // 7 days in ms
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  refreshTokenCookieOptions,
};
