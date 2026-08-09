'use strict';

const crypto = require('crypto');
const bcrypt = require('bcryptjs');

/**
 * Generate a 6-digit numeric OTP
 * Returns both plain OTP (to send via email) and hashed OTP (to store in DB)
 */
const generateOTP = async () => {
  // Generate cryptographically secure 6-digit OTP
  const otp = crypto.randomInt(100000, 999999).toString();

  // Hash the OTP before storing in DB
  const hashedOTP = await bcrypt.hash(otp, 10);

  return { otp, hashedOTP };
};

/**
 * Verify OTP against stored hash
 */
const verifyOTP = async (plainOTP, hashedOTP) => {
  return bcrypt.compare(plainOTP, hashedOTP);
};

module.exports = { generateOTP, verifyOTP };
