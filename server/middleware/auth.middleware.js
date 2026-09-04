'use strict';

const jwt     = require('jsonwebtoken');
const User    = require('../models/User.model');
const ApiError = require('../utils/ApiError');

/**
 * protect — verifies JWT access token
 * Attaches req.user to the request if valid
 */
const protect = async (req, _res, next) => {
  try {
    // 1. Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'Access denied. No token provided.');
    }

    const token = authHeader.split(' ')[1];

    // 2. Verify the token
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    // 3. Find the user in DB
    const user = await User.findById(decoded.userId).select('-password -refreshToken');
    if (!user) {
      throw new ApiError(401, 'User no longer exists.');
    }

    // 4. Check if user email is verified
    if (!user.isVerified) {
      throw new ApiError(403, 'Please verify your email address first.');
    }

    // 5. Check if user is active
    if (user.status !== 'ACTIVE') {
      throw new ApiError(403, `Account is ${user.status.toLowerCase()}. Please contact support.`);
    }

    // 6. Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new ApiError(401, 'Invalid token.'));
    }
    if (error.name === 'TokenExpiredError') {
      return next(new ApiError(401, 'Token expired. Please login again.'));
    }
    next(error);
  }
};

/**
 * restrictTo ?" verifies if the authenticated user has a specific role
 */
const restrictTo = (...roles) => {
  return (req, _res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ApiError(403, 'You do not have permission to perform this action.'));
    }
    next();
  };
};

module.exports = { protect, restrictTo };
