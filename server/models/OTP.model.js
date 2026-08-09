'use strict';

const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema(
  {
    email: {
      type:     String,
      required: true,
      lowercase: true,
      trim:     true,
    },

    otp: {
      type:     String,
      required: true,
      // stored as bcrypt hash — never plain text
    },

    expiresAt: {
      type:     Date,
      required: true,
      // MongoDB TTL index auto-deletes expired documents
      index:    { expires: 0 },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('OTP', otpSchema);
