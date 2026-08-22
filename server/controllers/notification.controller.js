'use strict';

const Notification = require('../models/Notification.model');
const ApiResponse  = require('../utils/ApiResponse');
const ApiError     = require('../utils/ApiError');

/**
 * GET /api/v1/notifications
 * Fetch authenticated user's notifications (paginated, newest first)
 */
const getUserNotifications = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const page  = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '20', 10);

    const notifications = await Notification.find({ recipient: userId })
      .populate('sender', 'name email avatar')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Notification.countDocuments({ recipient: userId });
    const unreadCount = await Notification.countDocuments({ recipient: userId, isRead: false });

    return res.status(200).json(
      new ApiResponse(200, 'Notifications fetched successfully', {
        notifications,
        unreadCount,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      })
    );
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/notifications/unread-count
 * Returns the unread notification count for the authenticated user
 */
const getUnreadCount = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const unreadCount = await Notification.countDocuments({ recipient: userId, isRead: false });

    return res.status(200).json(
      new ApiResponse(200, 'Unread count fetched', { unreadCount })
    );
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/v1/notifications/:id/read
 * Mark a single notification as read (with authorization verification)
 */
const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const notification = await Notification.findById(id);
    if (!notification) {
      throw new ApiError(404, 'Notification not found');
    }

    // Strict Authorization Check: Users can only mark their OWN notifications as read
    if (notification.recipient.toString() !== userId.toString()) {
      throw new ApiError(403, 'Unauthorized access to this notification');
    }

    notification.isRead = true;
    await notification.save();

    const unreadCount = await Notification.countDocuments({ recipient: userId, isRead: false });

    return res.status(200).json(
      new ApiResponse(200, 'Notification marked as read', { notification, unreadCount })
    );
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/v1/notifications/read-all
 * Mark all notifications for the authenticated user as read
 */
const markAllAsRead = async (req, res, next) => {
  try {
    const userId = req.user._id;

    await Notification.updateMany(
      { recipient: userId, isRead: false },
      { isRead: true }
    );

    return res.status(200).json(
      new ApiResponse(200, 'All notifications marked as read', { unreadCount: 0 })
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
};
