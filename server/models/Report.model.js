'use strict';

const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    targetType: {
      type: String,
      enum: ['User', 'MarketplaceItem', 'RoommatePost', 'Review'],
      required: true,
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'targetType', // Dynamically reference based on targetType
    },
    reason: {
      type: String,
      enum: [
        'Scam or Fraud',
        'Fake Information',
        'Inappropriate Content',
        'Harassment or Abusive Behavior',
        'Already Sold / Unavailable',
        'Spam',
        'Other'
      ],
      required: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    status: {
      type: String,
      enum: ['PENDING', 'UNDER_REVIEW', 'RESOLVED', 'DISMISSED'],
      default: 'PENDING',
    },
    adminNote: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Prevent users from spamming identical reports
reportSchema.index({ reporter: 1, targetType: 1, targetId: 1 }, { unique: true });

module.exports = mongoose.model('Report', reportSchema);
