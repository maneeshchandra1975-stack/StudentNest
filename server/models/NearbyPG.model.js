import mongoose from 'mongoose';

const nearbyPGSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['Gents PG', 'Ladies PG', 'Co-ed PG', 'Apartment'],
      required: true,
    },
    rentStarting: {
      type: Number,
      required: true,
    },
    distanceFromCampus: {
      type: Number,
      required: true,
    },
    ownerName: {
      type: String,
      required: true,
    },
    ownerPhone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
    amenities: [
      {
        type: String,
      },
    ],
    image: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const NearbyPG = mongoose.model('NearbyPG', nearbyPGSchema);
