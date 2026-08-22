'use strict';

const Notification = require('../models/Notification.model');

/**
 * Creates a persistent notification in MongoDB and emits a real-time Socket.IO event
 * @param {Object} app - Express app instance (to access req.app.get('io'))
 * @param {Object} data - Notification fields { recipient, sender, type, title, message, relatedEntityType, relatedEntityId }
 */
const createAndSendNotification = async (app, { recipient, sender, type, title, message, relatedEntityType, relatedEntityId }) => {
  try {
    // Avoid sending notification if recipient is the sender
    if (recipient.toString() === sender.toString()) {
      return null;
    }

    // 1. Save Notification to MongoDB
    const notification = await Notification.create({
      recipient,
      sender,
      type,
      title,
      message,
      relatedEntityType,
      relatedEntityId,
    });

    const populatedNotification = await Notification.findById(notification._id)
      .populate('sender', 'name email avatar');

    // 2. Real-Time Socket.IO emission to user-specific room
    const io = app.get('io');
    if (io) {
      const roomName = `user_${recipient.toString()}`;
      io.to(roomName).emit('new_notification', populatedNotification);
      console.log(`[REAL-TIME NOTIFICATION] Emitted '${type}' to room ${roomName}`);
    }

    return populatedNotification;
  } catch (error) {
    console.error('[NOTIFICATION SERVICE ERROR]', error.message);
    return null;
  }
};

module.exports = { createAndSendNotification };
