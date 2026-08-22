'use strict';

const RoommatePost = require('../models/RoommatePost.model');
const ApiResponse   = require('../utils/ApiResponse');
const ApiError      = require('../utils/ApiError');

const createRoommatePost = async (req, res, next) => {
  try {
    const { title, roomType, vacancy, rentShare, location, description, preferences } = req.body;

    if (!title || !roomType || !vacancy || !rentShare || !location || !description) {
      throw new ApiError(400, 'Please provide all required roommate post fields');
    }

    const post = await RoommatePost.create({
      author: req.user._id,
      title,
      roomType,
      vacancy,
      rentShare,
      location,
      description,
      preferences: preferences || [],
    });

    const populatedPost = await RoommatePost.findById(post._id).populate('author', 'name email');

    return res.status(201).json(
      new ApiResponse(201, 'Roommate vacancy posted successfully', populatedPost)
    );
  } catch (error) {
    next(error);
  }
};

const getRoommatePosts = async (req, res, next) => {
  try {
    const { roomType, maxRent, search } = req.query;
    const filter = {};

    if (roomType && roomType !== 'all') {
      filter.roomType = roomType;
    }

    if (maxRent) {
      filter.rentShare = { $lte: Number(maxRent) };
    }

    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    const posts = await RoommatePost.find(filter)
      .populate('author', 'name email')
      .sort({ createdAt: -1 });

    return res.status(200).json(
      new ApiResponse(200, 'Roommate posts fetched successfully', posts)
    );
  } catch (error) {
    next(error);
  }
};

const updateRoommateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Available', 'Filled'].includes(status)) {
      throw new ApiError(400, 'Invalid status');
    }

    const post = await RoommatePost.findById(id);
    if (!post) {
      throw new ApiError(404, 'Post not found');
    }

    if (post.author.toString() !== req.user._id.toString()) {
      throw new ApiError(403, 'Unauthorized');
    }

    post.status = status;
    await post.save();

    return res.status(200).json(
      new ApiResponse(200, `Status updated to ${status}`, post)
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRoommatePost,
  getRoommatePosts,
  updateRoommateStatus,
};
