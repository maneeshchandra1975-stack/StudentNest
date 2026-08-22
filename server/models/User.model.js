'use strict';

const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: [true, 'Name is required'],
      trim:     true,
      minlength: [2,  'Name must be at least 2 characters'],
      maxlength: [50, 'Name must be at most 50 characters'],
    },

    email: {
      type:      String,
      required:  [true, 'Email is required'],
      unique:    true,
      lowercase: true,
      trim:      true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please enter a valid email address',
      ],
    },

    password: {
      type:      String,
      required:  [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select:    false, // never return password in queries
    },

    role: {
      type:    String,
      enum:    ['student', 'admin'],
      default: 'student',
    },

    isVerified: {
      type:    Boolean,
      default: false,
    },

    avatar: {
      type:    String,
      default: '',
    },

    phone: {
      type:    String,
      default: '',
      trim:    true,
    },

    refreshToken: {
      type:   String,
      select: false, // never expose refresh token
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

// ── Hash password before saving ─────────────────────────────
userSchema.pre('save', async function () {
  // Only hash if password field was modified
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// ── Instance method: compare password ──────────────────────
userSchema.methods.isPasswordCorrect = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
