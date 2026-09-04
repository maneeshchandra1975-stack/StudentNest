'use strict';

const MarketplaceItem = require('../models/MarketplaceItem.model');
const ApiResponse     = require('../utils/ApiResponse');
const ApiError        = require('../utils/ApiError');

const createMarketplaceItem = async (req, res, next) => {
  try {
    const { title, category, price, condition, description, images, location } = req.body;

    if (!title || !category || !price || !condition || !description) {
      throw new ApiError(400, 'Please provide all required fields');
    }

    const item = await MarketplaceItem.create({
      seller: req.user._id,
      title,
      category,
      price,
      condition,
      description,
      images: images || [],
      location: location || 'VIT-AP Campus',
    });

    const populatedItem = await MarketplaceItem.findById(item._id).populate('seller', 'name email');

    return res.status(201).json(
      new ApiResponse(201, 'Marketplace item listed successfully', populatedItem)
    );
  } catch (error) {
    next(error);
  }
};

const getMarketplaceItems = async (req, res, next) => {
  try {
    const { category, minPrice, maxPrice, condition, search, seller, status } = req.query;
    const filter = {};

    if (seller) {
      filter.seller = seller;
    }

    if (status) {
      filter.status = status;
    } else if (!seller) {
      // By default, hide Sold items unless viewing a specific seller's profile
      filter.status = 'Active';
    }

    if (category && category !== 'all') {
      filter.category = category;
    }

    if (condition && condition !== 'all') {
      filter.condition = condition;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    const items = await MarketplaceItem.find(filter)
      .populate('seller', 'name email')
      .sort({ createdAt: -1 });

    return res.status(200).json(
      new ApiResponse(200, 'Marketplace items fetched successfully', items)
    );
  } catch (error) {
    next(error);
  }
};

const updateItemStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Available', 'Reserved', 'Sold'].includes(status)) {
      throw new ApiError(400, 'Invalid status value');
    }

    const item = await MarketplaceItem.findById(id);
    if (!item) {
      throw new ApiError(404, 'Item not found');
    }

    if (item.seller.toString() !== req.user._id.toString()) {
      throw new ApiError(403, 'Unauthorized to update this item');
    }

    item.status = status;
    await item.save();

    return res.status(200).json(
      new ApiResponse(200, `Item status updated to ${status}`, item)
    );
  } catch (error) {
    next(error);
  }
};

const reportItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const item = await MarketplaceItem.findById(id);
    if (!item) {
      throw new ApiError(404, 'Item not found');
    }

    item.reports.push({
      reporter: req.user._id,
      reason: reason || 'Inappropriate content',
    });

    await item.save();

    return res.status(200).json(
      new ApiResponse(200, 'Listing reported successfully', null)
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createMarketplaceItem,
  getMarketplaceItems,
  updateItemStatus,
  reportItem,
};
