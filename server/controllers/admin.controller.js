'use strict';

const User = require('../models/User.model');
const MarketplaceItem = require('../models/MarketplaceItem.model');
const RoommatePost = require('../models/RoommatePost.model');
const Report = require('../models/Report.model');
const Review = require('../models/Review.model');
const InterestRequest = require('../models/InterestRequest.model');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

// --------------------------------------------------------
// ANALYTICS & DASHBOARD
// --------------------------------------------------------

exports.getDashboardAnalytics = async (req, res, next) => {
  try {
    const totalStudents = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'ACTIVE' });
    
    const totalListings = await MarketplaceItem.countDocuments();
    const activeListings = await MarketplaceItem.countDocuments({ status: 'Available' });

    const totalHousing = await RoommatePost.countDocuments();
    const activeHousing = await RoommatePost.countDocuments({ status: 'Available' });

    const totalReports = await Report.countDocuments();
    const pendingReports = await Report.countDocuments({ status: 'PENDING' });

    const totalInterests = await InterestRequest.countDocuments();
    const totalReviews = await Review.countDocuments();

    // Calculate marketplace breakdown
    const categoryBreakdown = await MarketplaceItem.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    // Calculate recent signups (last 7 days by day)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const userGrowth = await User.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json(new ApiResponse(200, 'Analytics fetched successfully', {
      kpis: {
        totalStudents,
        activeUsers,
        totalListings,
        activeListings,
        totalHousing,
        activeHousing,
        totalReports,
        pendingReports,
        totalInterests,
        totalReviews
      },
      categoryBreakdown,
      userGrowth
    }));
  } catch (error) {
    next(error);
  }
};

// --------------------------------------------------------
// USER MANAGEMENT
// --------------------------------------------------------

exports.getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, status, role } = req.query;
    
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (status) query.status = status;
    if (role) query.role = role;

    const skip = (page - 1) * limit;
    
    const users = await User.find(query)
      .select('-password -refreshToken')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
      
    const total = await User.countDocuments(query);

    res.status(200).json(new ApiResponse(200, 'Users fetched', {
      users,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page)
    }));
  } catch (error) {
    next(error);
  }
};

exports.updateUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // ACTIVE, SUSPENDED, BANNED

    if (!['ACTIVE', 'SUSPENDED', 'BANNED'].includes(status)) {
      throw new ApiError(400, 'Invalid status');
    }

    // Don't allow admins to ban themselves
    if (req.user._id.toString() === id) {
      throw new ApiError(403, 'Cannot change your own status');
    }

    const user = await User.findByIdAndUpdate(id, { status }, { new: true }).select('-password -refreshToken');
    
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    res.status(200).json(new ApiResponse(200, 'User status updated', user));
  } catch (error) {
    next(error);
  }
};

// --------------------------------------------------------
// MARKETPLACE MODERATION
// --------------------------------------------------------

exports.getMarketplaceListings = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    
    const query = {};
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const skip = (page - 1) * limit;
    
    const listings = await MarketplaceItem.find(query)
      .populate('seller', 'name email avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
      
    const total = await MarketplaceItem.countDocuments(query);

    res.status(200).json(new ApiResponse(200, 'Listings fetched', {
      listings,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page)
    }));
  } catch (error) {
    next(error);
  }
};

exports.deleteMarketplaceListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const listing = await MarketplaceItem.findByIdAndDelete(id);
    if (!listing) {
      throw new ApiError(404, 'Listing not found');
    }

    res.status(200).json(new ApiResponse(200, 'Listing removed permanently'));
  } catch (error) {
    next(error);
  }
};

// --------------------------------------------------------
// HOUSING MODERATION
// --------------------------------------------------------

exports.getHousingPosts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    
    const query = {};
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const skip = (page - 1) * limit;
    
    const posts = await RoommatePost.find(query)
      .populate('user', 'name email avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
      
    const total = await RoommatePost.countDocuments(query);

    res.status(200).json(new ApiResponse(200, 'Housing posts fetched', {
      posts,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page)
    }));
  } catch (error) {
    next(error);
  }
};

exports.deleteHousingPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const post = await RoommatePost.findByIdAndDelete(id);
    if (!post) {
      throw new ApiError(404, 'Post not found');
    }

    res.status(200).json(new ApiResponse(200, 'Housing post removed permanently'));
  } catch (error) {
    next(error);
  }
};

// --------------------------------------------------------
// REPORT MANAGEMENT
// --------------------------------------------------------

exports.getReports = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    const query = {};
    if (status) query.status = status;

    const skip = (page - 1) * limit;
    
    const reports = await Report.find(query)
      .populate('reporter', 'name email avatar')
      .populate('targetId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
      
    const total = await Report.countDocuments(query);

    res.status(200).json(new ApiResponse(200, 'Reports fetched', {
      reports,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page)
    }));
  } catch (error) {
    next(error);
  }
};

exports.updateReportStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, adminNote } = req.body;

    if (!['PENDING', 'UNDER_REVIEW', 'RESOLVED', 'DISMISSED'].includes(status)) {
      throw new ApiError(400, 'Invalid status');
    }

    const report = await Report.findByIdAndUpdate(
      id,
      { status, adminNote },
      { new: true }
    )
      .populate('reporter', 'name email avatar')
      .populate('targetId');

    if (!report) {
      throw new ApiError(404, 'Report not found');
    }

    res.status(200).json(new ApiResponse(200, 'Report updated', report));
  } catch (error) {
    next(error);
  }
};

// --------------------------------------------------------
// REVIEW MODERATION
// --------------------------------------------------------

exports.getReviews = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    
    const reviews = await Review.find()
      .populate('reviewer', 'name email avatar')
      .populate('reviewee', 'name email avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
      
    const total = await Review.countDocuments();

    res.status(200).json(new ApiResponse(200, 'Reviews fetched', {
      reviews,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page)
    }));
  } catch (error) {
    next(error);
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const review = await Review.findByIdAndDelete(id);
    if (!review) {
      throw new ApiError(404, 'Review not found');
    }

    res.status(200).json(new ApiResponse(200, 'Review removed permanently'));
  } catch (error) {
    next(error);
  }
};
