import { InterestRequest } from '../models/InterestRequest.model.js';
import { MarketplaceItem } from '../models/MarketplaceItem.model.js';
import { RoommatePost } from '../models/RoommatePost.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';

export const sendInterestRequest = async (req, res, next) => {
  try {
    const { listingType, listingId, recipientId, message } = req.body;

    if (!listingType || !listingId || !recipientId) {
      throw new ApiError(400, 'Listing details and recipient are required');
    }

    if (req.user._id.toString() === recipientId) {
      throw new ApiError(400, 'You cannot express interest in your own listing');
    }

    // Check if an active interest request already exists
    const existing = await InterestRequest.findOne({
      listingType,
      sender: req.user._id,
      recipient: recipientId,
      status: { $in: ['Pending', 'Accepted'] },
      ...(listingType === 'Marketplace' ? { marketplaceItem: listingId } : { roommatePost: listingId }),
    });

    if (existing) {
      throw new ApiError(400, 'You have already sent an interest request for this item');
    }

    const request = await InterestRequest.create({
      listingType,
      marketplaceItem: listingType === 'Marketplace' ? listingId : undefined,
      roommatePost: listingType === 'Roommate' ? listingId : undefined,
      sender: req.user._id,
      recipient: recipientId,
      message: message || 'I am interested in your listing.',
    });

    return res.status(201).json(
      new ApiResponse(201, request, 'Interest request sent successfully')
    );
  } catch (error) {
    next(error);
  }
};

export const getReceivedRequests = async (req, res, next) => {
  try {
    const requests = await InterestRequest.find({ recipient: req.user._id })
      .populate('sender', 'name email')
      .populate('marketplaceItem', 'title price images status')
      .populate('roommatePost', 'title rentShare roomType status')
      .sort({ createdAt: -1 });

    return res.status(200).json(
      new ApiResponse(200, requests, 'Received interest requests fetched')
    );
  } catch (error) {
    next(error);
  }
};

export const getSentRequests = async (req, res, next) => {
  try {
    const requests = await InterestRequest.find({ sender: req.user._id })
      .populate('recipient', 'name email')
      .populate('marketplaceItem', 'title price images status')
      .populate('roommatePost', 'title rentShare roomType status')
      .sort({ createdAt: -1 });

    return res.status(200).json(
      new ApiResponse(200, requests, 'Sent interest requests fetched')
    );
  } catch (error) {
    next(error);
  }
};

export const respondToInterest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // 'Accepted' | 'Rejected'

    if (!['Accepted', 'Rejected'].includes(action)) {
      throw new ApiError(400, 'Action must be Accepted or Rejected');
    }

    const request = await InterestRequest.findById(id);
    if (!request) {
      throw new ApiError(404, 'Request not found');
    }

    if (request.recipient.toString() !== req.user._id.toString()) {
      throw new ApiError(403, 'Unauthorized to respond to this request');
    }

    request.status = action;
    await request.save();

    // If accepted, set item status to Reserved automatically
    if (action === 'Accepted' && request.listingType === 'Marketplace' && request.marketplaceItem) {
      await MarketplaceItem.findByIdAndUpdate(request.marketplaceItem, { status: 'Reserved' });
    }

    return res.status(200).json(
      new ApiResponse(200, request, `Interest request ${action.toLowerCase()}`)
    );
  } catch (error) {
    next(error);
  }
};

export const cancelInterestRequest = async (req, res, next) => {
  try {
    const { id } = req.params;

    const request = await InterestRequest.findById(id);
    if (!request) {
      throw new ApiError(404, 'Request not found');
    }

    if (request.sender.toString() !== req.user._id.toString()) {
      throw new ApiError(403, 'Unauthorized to cancel this request');
    }

    request.status = 'Cancelled';
    await request.save();

    return res.status(200).json(
      new ApiResponse(200, request, 'Interest request cancelled')
    );
  } catch (error) {
    next(error);
  }
};

// Check if chat access is permitted between current user and target user
export const checkChatPermission = async (req, res, next) => {
  try {
    const { targetUserId } = req.params;

    const acceptedRequest = await InterestRequest.findOne({
      $or: [
        { sender: req.user._id, recipient: targetUserId, status: 'Accepted' },
        { sender: targetUserId, recipient: req.user._id, status: 'Accepted' },
      ],
    });

    return res.status(200).json(
      new ApiResponse(200, { isAllowed: !!acceptedRequest }, 'Chat permission status')
    );
  } catch (error) {
    next(error);
  }
};
