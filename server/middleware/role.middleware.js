'use strict';

const ApiError = require('../utils/ApiError');

/**
 * authorise(...roles) — Role-based access control middleware
 * Usage: router.get('/admin', protect, authorise('admin'), handler)
 *
 * @param  {...string} roles - allowed roles e.g. 'admin', 'student'
 */
const authorise = (...roles) => {
  return (req, _res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(403, `Access denied. Required role: ${roles.join(' or ')}`)
      );
    }
    next();
  };
};

module.exports = { authorise };
