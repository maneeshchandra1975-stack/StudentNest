'use strict';

const express = require('express');
const router = express.Router();

const {
  createReview,
  getUserReviews,
  getListingReviews,
  updateReview,
  deleteReview,
} = require('../controllers/review.controller');

const { protect } = require('../middleware/auth.middleware');

// Public routes for reading reviews
router.get('/user/:id', getUserReviews);
router.get('/listing/:id', getListingReviews);

// Protected routes for creating/updating/deleting reviews
router.use(protect);
router.post('/', createReview);
router.patch('/:id', updateReview);
router.delete('/:id', deleteReview);

module.exports = router;
