'use strict';

const Review = require('../models/Review.model');
const InterestRequest = require('../models/InterestRequest.model');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const { createAndSendNotification } = require('../services/notification.service');

const createReview = async (req, res, next) => {
  try {
    const { interestRequestId, rating, comment } = req.body;

    if (!interestRequestId || !rating) {
      throw new ApiError(400, 'Interest request ID and rating are required');
    }

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      throw new ApiError(400, 'Rating must be an integer between 1 and 5');
    }

    const request = await InterestRequest.findById(interestRequestId);
    if (!request) {
      throw new ApiError(404, 'Interest request not found');
    }

    if (!['Accepted', 'Completed'].includes(request.status)) {
      throw new ApiError(400, 'You can only rate users after your interest request has been accepted');
    }

    const isSender = request.sender.toString() === req.user._id.toString();
    const isRecipient = request.recipient.toString() === req.user._id.toString();

    if (!isSender && !isRecipient) {
      throw new ApiError(403, 'You were not part of this interaction');
    }

    const revieweeId = isSender ? request.recipient : request.sender;

    if (revieweeId.toString() === req.user._id.toString()) {
      throw new ApiError(400, 'You cannot review yourself');
    }

    const existingReview = await Review.findOne({
      reviewer: req.user._id,
      interestRequest: request._id,
    });

    if (existingReview) {
      throw new ApiError(400, 'You have already reviewed this interaction');
    }

    const review = await Review.create({
      reviewer: req.user._id,
      reviewee: revieweeId,
      rating,
      comment,
      targetType: request.listingType,
      targetId: request.listingType === 'Marketplace' ? request.marketplaceItem : request.roommatePost,
      interestRequest: request._id,
    });

    // Notify the reviewee
    await createAndSendNotification(req.app, {
      recipient: revieweeId,
      sender: req.user._id,
      type: 'INTEREST_ACCEPTED', // Using existing enum, can customize if needed
      title: 'New Review Received',
      message: `${req.user.name} left you a ${rating}-star review.`,
      relatedEntityType: request.listingType,
      relatedEntityId: request._id,
    });

    return res.status(201).json(new ApiResponse(201, 'Review created successfully', review));
  } catch (error) {
    if (error.code === 11000) {
      next(new ApiError(400, 'You have already reviewed this interaction'));
    } else {
      next(error);
    }
  }
};

const getUserReviews = async (req, res, next) => {
  try {
    const { id } = req.params;
    const reviews = await Review.find({ reviewee: id })
      .populate('reviewer', 'name email')
      .sort({ createdAt: -1 });

    const avgRating = reviews.length > 0 
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : 0;

    return res.status(200).json(new ApiResponse(200, 'User reviews fetched', { reviews, avgRating, totalReviews: reviews.length }));
  } catch (error) {
    next(error);
  }
};

const getListingReviews = async (req, res, next) => {
  try {
    const { id } = req.params;
    const reviews = await Review.find({ targetId: id })
      .populate('reviewer', 'name email')
      .sort({ createdAt: -1 });

    const avgRating = reviews.length > 0 
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : 0;

    return res.status(200).json(new ApiResponse(200, 'Listing reviews fetched', { reviews, avgRating, totalReviews: reviews.length }));
  } catch (error) {
    next(error);
  }
};

const updateReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.findById(id);
    if (!review) {
      throw new ApiError(404, 'Review not found');
    }

    if (review.reviewer.toString() !== req.user._id.toString()) {
      throw new ApiError(403, 'Unauthorized to update this review');
    }

    if (rating !== undefined) {
      if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
        throw new ApiError(400, 'Rating must be an integer between 1 and 5');
      }
      review.rating = rating;
    }
    
    if (comment !== undefined) {
      review.comment = comment;
    }

    await review.save();

    return res.status(200).json(new ApiResponse(200, 'Review updated successfully', review));
  } catch (error) {
    next(error);
  }
};

const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const review = await Review.findById(id);

    if (!review) {
      throw new ApiError(404, 'Review not found');
    }

    if (review.reviewer.toString() !== req.user._id.toString()) {
      throw new ApiError(403, 'Unauthorized to delete this review');
    }

    await review.deleteOne();

    return res.status(200).json(new ApiResponse(200, 'Review deleted successfully', null));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReview,
  getUserReviews,
  getListingReviews,
  updateReview,
  deleteReview,
};
