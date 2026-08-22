'use strict';

const NearbyPG    = require('../models/NearbyPG.model');
const ApiResponse = require('../utils/ApiResponse');

const defaultNearbyPGs = [
  {
    name: 'Anand Executive Student PG',
    type: 'Gents PG',
    rentStarting: 8500,
    distanceFromCampus: 0.8,
    ownerName: 'Anand Kumar',
    ownerPhone: '+91 98765 43210',
    address: 'Near VIT-AP North Gate, Inavolu Road',
    coordinates: { lat: 16.4985, lng: 80.5015 },
    amenities: ['3 Times Meals', 'High-Speed Wi-Fi', 'Daily Housekeeping', '24/7 Power Backup', 'AC Rooms'],
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80',
    isVerified: true,
  },
  {
    name: 'Sri Sai Women’s Executive Hostel',
    type: 'Ladies PG',
    rentStarting: 9000,
    distanceFromCampus: 1.1,
    ownerName: 'Smt. Lakshmi Reddy',
    ownerPhone: '+91 91234 56789',
    address: 'Opposite Amaravati Main Arch',
    coordinates: { lat: 16.4950, lng: 80.5040 },
    amenities: ['CCTV Security', 'Biometric Entry', 'Home Cooked Food', 'Washing Machine', 'Study Hall'],
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80',
    isVerified: true,
  },
  {
    name: 'Capital Green Valley Apartments',
    type: 'Apartment',
    rentStarting: 12500,
    distanceFromCampus: 1.8,
    ownerName: 'Venkatesh Rao',
    ownerPhone: '+91 99887 76655',
    address: 'Mandadam High Road, Vijayawada Sector 4',
    coordinates: { lat: 16.5020, lng: 80.4950 },
    amenities: ['Covered Bike Parking', 'Elevator', 'Gym Access', 'Water Purifier', 'Balcony View'],
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80',
    isVerified: true,
  },
];

const getNearbyPGs = async (req, res, next) => {
  try {
    let pgs = await NearbyPG.find().sort({ distanceFromCampus: 1 });

    if (pgs.length === 0) {
      pgs = await NearbyPG.insertMany(defaultNearbyPGs);
    }

    return res.status(200).json(
      new ApiResponse(200, 'Nearby PGs and accommodations fetched successfully', pgs)
    );
  } catch (error) {
    next(error);
  }
};

module.exports = { getNearbyPGs };
