import mongoose from 'mongoose';

const interestRequestSchema = new mongoose.Schema(
  {
    listingType: {
      type: String,
      enum: ['Marketplace', 'Roommate'],
      required: true,
    },
    marketplaceItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MarketplaceItem',
    },
    roommatePost: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RoommatePost',
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      default: 'I am interested in your listing.',
    },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Rejected', 'Cancelled'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

export const InterestRequest = mongoose.model('InterestRequest', interestRequestSchema);
