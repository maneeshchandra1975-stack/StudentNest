'use strict';

const { validationResult } = require('express-validator');
const ApiError             = require('../utils/ApiError');

/**
 * validate — runs after express-validator checks
 * If any validation errors exist, throws a 400 ApiError
 */
const validate = (req, _res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => e.msg).join(', ');
    return next(new ApiError(400, messages));
  }
  next();
};

module.exports = { validate };
