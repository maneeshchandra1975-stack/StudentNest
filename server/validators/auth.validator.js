'use strict';

const { body } = require('express-validator');

// ── Register Validator ──────────────────────────────────────
const registerValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Enter a valid email address')
    .custom((value) => {
      if (!value.endsWith('@vitapstudent.ac.in')) {
        throw new Error('Only VIT-AP student emails are allowed (@vitapstudent.ac.in)');
      }
      return true;
    }),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[0-9]/).withMessage('Password must contain at least one number'),
];

// ── Login Validator ─────────────────────────────────────────
const loginValidator = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Enter a valid email address'),

  body('password')
    .notEmpty().withMessage('Password is required'),
];

// ── OTP Validator ───────────────────────────────────────────
const otpValidator = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Enter a valid email address'),

  body('otp')
    .trim()
    .notEmpty().withMessage('OTP is required')
    .isLength({ min: 6, max: 6 }).withMessage('OTP must be exactly 6 digits')
    .isNumeric().withMessage('OTP must be numeric'),
];

module.exports = { registerValidator, loginValidator, otpValidator };
