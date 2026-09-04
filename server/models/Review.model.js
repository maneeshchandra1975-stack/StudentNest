'use strict';

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reviewee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    targetType: {
      type: String,
      enum: ['Marketplace', 'Roommate'],
      required: true,
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'targetTypeRef',
    },
    interestRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'InterestRequest',
      required: true,
    }
  },
  { timestamps: true }
);

reviewSchema.virtual('targetTypeRef').get(function () {
  return this.targetType === 'Marketplace' ? 'MarketplaceItem' : 'RoommatePost';
});

// Prevent duplicate reviews by the same reviewer on the same interaction
reviewSchema.index({ reviewer: 1, interestRequest: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
