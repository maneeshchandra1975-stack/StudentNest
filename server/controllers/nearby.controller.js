'use strict';

const { searchNearbyPlaces, getPlaceDetails } = require('../services/places.service');
const ApiResponse = require('../utils/ApiResponse');

const getNearbyPGs = async (req, res, next) => {
  try {
    const { lat, lng, radius, keyword } = req.query;
    
    // Default to VIT-AP coordinates if none provided
    const defaultLat = 16.500;
    const defaultLng = 80.500;

    const queryLat = lat ? parseFloat(lat) : defaultLat;
    const queryLng = lng ? parseFloat(lng) : defaultLng;

    const places = await searchNearbyPlaces(queryLat, queryLng, radius, 'lodging', keyword || 'pg hostel');

    return res.status(200).json(
      new ApiResponse(200, 'Nearby places fetched successfully via external provider', places)
    );
  } catch (error) {
    next(error);
  }
};

const getPlaceDetailsEndpoint = async (req, res, next) => {
  try {
    const { id } = req.params;
    const details = await getPlaceDetails(id);

    return res.status(200).json(
      new ApiResponse(200, 'Place details fetched successfully', details)
    );
  } catch (error) {
    next(error);
  }
};

module.exports = { 
  getNearbyPGs,
  getPlaceDetailsEndpoint 
};
