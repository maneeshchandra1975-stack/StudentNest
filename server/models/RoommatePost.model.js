'use strict';

const mongoose = require('mongoose');

const roommatePostSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    roomType: {
      type: String,
      enum: ['Shared Room', 'Private Room', '2BHK Flatshare', '3BHK Flatshare'],
      required: true,
    },
    vacancy: {
      type: Number,
      required: true,
      min: 1,
    },
    rentShare: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    preferences: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      enum: ['Available', 'Filled'],
      default: 'Available',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('RoommatePost', roommatePostSchema);
