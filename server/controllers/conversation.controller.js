'use strict';

const Conversation    = require('../models/Conversation.model');
const Message         = require('../models/Message.model');
const InterestRequest = require('../models/InterestRequest.model');
const ApiResponse     = require('../utils/ApiResponse');
const ApiError        = require('../utils/ApiError');

/**
 * GET /api/v1/conversations
 * Fetch all conversations for current user where interest request status is Accepted
 */
const getUserConversations = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Find conversations where user is a participant
    const conversations = await Conversation.find({ participants: userId })
      .populate('participants', 'name email avatar phone')
      .populate({
        path: 'interestRequest',
        select: 'status listingType marketplaceItem roommatePost sender recipient',
        populate: [
          { path: 'marketplaceItem', select: 'title price images status' },
          { path: 'roommatePost', select: 'title rentShare roomType status' },
        ],
      })
      .sort({ lastMessageAt: -1 });

    // Strictly filter out any conversation whose associated InterestRequest is NOT Accepted
    const authorizedConversations = conversations.filter(
      (c) => c.interestRequest && c.interestRequest.status === 'Accepted'
    );

    return res.status(200).json(
      new ApiResponse(200, 'Conversations fetched successfully', authorizedConversations)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/conversations/:id
 * Fetch single conversation details with strict authorization check
 */
const getConversationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const conversation = await Conversation.findById(id)
      .populate('participants', 'name email avatar phone')
      .populate({
        path: 'interestRequest',
        select: 'status listingType marketplaceItem roommatePost sender recipient',
        populate: [
          { path: 'marketplaceItem', select: 'title price images status' },
          { path: 'roommatePost', select: 'title rentShare roomType status' },
        ],
      });

    if (!conversation) {
      throw new ApiError(404, 'Conversation not found');
    }

    // 1. Participant Check
    const isParticipant = conversation.participants.some(
      (p) => p._id.toString() === userId.toString()
    );
    if (!isParticipant) {
      throw new ApiError(403, 'Unauthorized access to this conversation');
    }

    // 2. Accepted Status Check
    if (!conversation.interestRequest || conversation.interestRequest.status !== 'Accepted') {
      throw new ApiError(403, 'Chat is not available for this interaction.');
    }

    return res.status(200).json(
      new ApiResponse(200, 'Conversation fetched successfully', conversation)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/conversations/:id/messages
 * Fetch paginated messages for an authorized conversation
 */
const getMessages = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const page  = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '50', 10);

    const conversation = await Conversation.findById(id).populate('interestRequest');
    if (!conversation) {
      throw new ApiError(404, 'Conversation not found');
    }

    // Authorization Verification
    const isParticipant = conversation.participants.some(
      (p) => p.toString() === userId.toString()
    );
    if (!isParticipant) {
      throw new ApiError(403, 'Unauthorized access to this conversation');
    }

    if (!conversation.interestRequest || conversation.interestRequest.status !== 'Accepted') {
      throw new ApiError(403, 'Chat is not available for this interaction.');
    }

    const messages = await Message.find({ conversation: id })
      .populate('sender', 'name email avatar')
      .sort({ createdAt: 1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return res.status(200).json(
      new ApiResponse(200, 'Messages fetched successfully', messages)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/conversations/:id/messages
 * Send a message REST endpoint
 */
const sendMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { text, messageType, imageUrl } = req.body;
    const userId = req.user._id;

    if (!text || !text.trim()) {
      throw new ApiError(400, 'Message text is required');
    }

    const conversation = await Conversation.findById(id).populate('interestRequest');
    if (!conversation) {
      throw new ApiError(404, 'Conversation not found');
    }

    // Authorization Verification
    const isParticipant = conversation.participants.some(
      (p) => p.toString() === userId.toString()
    );
    if (!isParticipant) {
      throw new ApiError(403, 'Unauthorized access to this conversation');
    }

    if (!conversation.interestRequest || conversation.interestRequest.status !== 'Accepted') {
      throw new ApiError(403, 'Chat is not available for this interaction.');
    }

    const message = await Message.create({
      conversation: id,
      sender: userId,
      text: text.trim(),
      messageType: messageType || 'text',
      imageUrl: imageUrl || '',
    });

    conversation.lastMessage = text.trim();
    conversation.lastMessageSender = userId;
    conversation.lastMessageAt = new Date();
    await conversation.save();

    const populatedMessage = await Message.findById(message._id).populate('sender', 'name email avatar');

    // Emit to socket room if socket server is attached
    if (req.app.get('io')) {
      req.app.get('io').to(`conversation_${id}`).emit('receive_message', populatedMessage);
    }

    return res.status(201).json(
      new ApiResponse(201, 'Message sent successfully', populatedMessage)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/conversations/by-interest/:interestRequestId
 * Get or create unique conversation for an accepted interest request
 */
const getOrCreateByInterest = async (req, res, next) => {
  try {
    const { interestRequestId } = req.params;
    const userId = req.user._id;

    const interestRequest = await InterestRequest.findById(interestRequestId);
    if (!interestRequest) {
      throw new ApiError(404, 'Interest request not found');
    }

    // Is user sender or recipient?
    const isUserInvolved =
      interestRequest.sender.toString() === userId.toString() ||
      interestRequest.recipient.toString() === userId.toString();

    if (!isUserInvolved) {
      throw new ApiError(403, 'Unauthorized access');
    }

    if (interestRequest.status !== 'Accepted') {
      throw new ApiError(403, 'Chat is not available for this interaction.');
    }

    let conversation = await Conversation.findOne({ interestRequest: interestRequestId })
      .populate('participants', 'name email avatar phone')
      .populate({
        path: 'interestRequest',
        select: 'status listingType marketplaceItem roommatePost sender recipient',
        populate: [
          { path: 'marketplaceItem', select: 'title price images status' },
          { path: 'roommatePost', select: 'title rentShare roomType status' },
        ],
      });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [interestRequest.sender, interestRequest.recipient],
        interestRequest: interestRequestId,
        lastMessage: 'Conversation started. Say hello!',
        lastMessageAt: new Date(),
      });

      conversation = await Conversation.findById(conversation._id)
        .populate('participants', 'name email avatar phone')
        .populate({
          path: 'interestRequest',
          select: 'status listingType marketplaceItem roommatePost sender recipient',
          populate: [
            { path: 'marketplaceItem', select: 'title price images status' },
            { path: 'roommatePost', select: 'title rentShare roomType status' },
          ],
        });
    }

    return res.status(200).json(
      new ApiResponse(200, 'Conversation fetched', conversation)
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserConversations,
  getConversationById,
  getMessages,
  sendMessage,
  getOrCreateByInterest,
};
