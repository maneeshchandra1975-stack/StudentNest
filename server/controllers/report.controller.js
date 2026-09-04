'use strict';

const Report = require('../models/Report.model');
const User = require('../models/User.model');
const MarketplaceItem = require('../models/MarketplaceItem.model');
const RoommatePost = require('../models/RoommatePost.model');
const Review = require('../models/Review.model');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');

const createReport = async (req, res, next) => {
  try {
    const { targetType, targetId, reason, description } = req.body;

    if (!targetType || !targetId || !reason) {
      throw new ApiError(400, 'Target type, target ID, and reason are required');
    }

    // Self-report prevention
    if (targetType === 'User' && targetId === req.user._id.toString()) {
      throw new ApiError(400, 'You cannot report yourself');
    }

    // Validate target existence
    let targetExists = false;
    switch (targetType) {
      case 'User':
        targetExists = await User.exists({ _id: targetId });
        break;
      case 'MarketplaceItem':
        targetExists = await MarketplaceItem.exists({ _id: targetId });
        break;
      case 'RoommatePost':
        targetExists = await RoommatePost.exists({ _id: targetId });
        break;
      case 'Review':
        targetExists = await Review.exists({ _id: targetId });
        break;
      default:
        throw new ApiError(400, 'Invalid target type');
    }

    if (!targetExists) {
      throw new ApiError(404, 'The item you are trying to report does not exist');
    }

    // Check for duplicate report by same user
    const existingReport = await Report.findOne({
      reporter: req.user._id,
      targetType,
      targetId,
    });

    if (existingReport) {
      throw new ApiError(400, 'You have already reported this item');
    }

    const report = await Report.create({
      reporter: req.user._id,
      targetType,
      targetId,
      reason,
      description,
    });

    return res.status(201).json(new ApiResponse(201, 'Report submitted successfully', report));
  } catch (error) {
    if (error.code === 11000) {
      next(new ApiError(400, 'You have already reported this item'));
    } else {
      next(error);
    }
  }
};

const getMyReports = async (req, res, next) => {
  try {
    const reports = await Report.find({ reporter: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json(new ApiResponse(200, 'Your reports fetched', reports));
  } catch (error) {
    next(error);
  }
};

const getReportDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const report = await Report.findById(id).populate('targetId'); // basic population

    if (!report) {
      throw new ApiError(404, 'Report not found');
    }

    // Security check: only the reporter (or an admin, if roles existed) can view
    if (report.reporter.toString() !== req.user._id.toString()) {
      throw new ApiError(403, 'Unauthorized to view this report');
    }

    return res.status(200).json(new ApiResponse(200, 'Report details fetched', report));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReport,
  getMyReports,
  getReportDetails,
};
