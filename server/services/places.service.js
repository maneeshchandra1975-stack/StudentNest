'use strict';

const axios = require('axios');

/**
 * Places Service Abstraction
 * Supports real location API (e.g., Google Places / Mapbox) or safely falls back
 * to realistic mock data during development if API keys are absent.
 */

const searchNearbyPlaces = async (lat, lng, radius = 5000) => {
  const API_KEY = process.env.GEOAPIFY_API_KEY;

  if (API_KEY && API_KEY !== 'mock') {
    try {
      // Geoapify Places API for accommodation (hostels, guest houses)
      const categories = 'accommodation.hostel,accommodation.guest_house';
      const url = `https://api.geoapify.com/v2/places?categories=${categories}&filter=circle:${lng},${lat},${radius}&bias=proximity:${lng},${lat}&limit=20&apiKey=${API_KEY}`;
      
      const response = await axios.get(url);
      
      if (response.status === 200 && response.data.features) {
        return response.data.features.map(feature => {
          const props = feature.properties;
          return {
            id: props.place_id,
            name: props.name || 'Student Accommodation',
            address: props.formatted,
            rating: null, // Geoapify doesn't reliably provide star ratings
            distance: `${(props.distance / 1000).toFixed(1)} km`,
            location: { lat: props.lat, lng: props.lon },
            mapLink: `https://www.google.com/maps/search/?api=1&query=${props.lat},${props.lon}`,
          };
        }).filter(place => place.name !== 'Student Accommodation'); // Filter out unnamed places
      } else {
        throw new Error('Geoapify API did not return expected data');
      }
    } catch (error) {
      console.error('Geoapify API failed, falling back to mock data:', error.message);
      return getMockNearbyPlaces(lat, lng);
    }
  } else {
    // Development fallback
    return getMockNearbyPlaces(lat, lng);
  }
};

const getPlaceDetails = async (placeId) => {
  const API_KEY = process.env.GEOAPIFY_API_KEY;

  if (API_KEY && API_KEY !== 'mock') {
    try {
      const url = `https://api.geoapify.com/v2/place-details?id=${placeId}&apiKey=${API_KEY}`;
      const response = await axios.get(url);

      if (response.status === 200 && response.data.features && response.data.features.length > 0) {
        const props = response.data.features[0].properties;
        return {
          id: props.place_id,
          name: props.name || 'Accommodation',
          address: props.formatted,
          phone: props.contact?.phone || null,
          website: props.website || null,
          location: { lat: props.lat, lng: props.lon },
          mapLink: `https://www.google.com/maps/search/?api=1&query=${props.lat},${props.lon}`,
        };
      } else {
        throw new Error('Place details not found in Geoapify');
      }
    } catch (error) {
      console.error('Geoapify API failed for details, falling back to mock data:', error.message);
      return getMockPlaceDetails(placeId);
    }
  } else {
    return getMockPlaceDetails(placeId);
  }
};

// --- MOCK DATA FOR DEVELOPMENT ---

const mockDatabase = [
  {
    id: 'mock_pg_1',
    name: 'Sri Sai Executive PG for Gents',
    address: 'Near VIT-AP Inavolu Gate, Amaravati',
    phone: '+91 98765 43210',
    rating: 4.2,
    location: { lat: 16.500, lng: 80.500 },
    distance: '1.2 km',
    mapLink: 'https://maps.google.com/?q=16.500,80.500'
  },
  {
    id: 'mock_pg_2',
    name: 'Lakshmi Ladies Hostel & PG',
    address: 'APCRDA Region, Opposite Campus',
    phone: '+91 91234 56789',
    rating: 4.5,
    location: { lat: 16.505, lng: 80.502 },
    distance: '1.5 km',
    mapLink: 'https://maps.google.com/?q=16.505,80.502'
  },
  {
    id: 'mock_pg_3',
    name: 'Student Hub Premium Living',
    address: 'Thullur Main Road',
    phone: null, // intentionally missing to test UI fallback
    rating: 3.8,
    location: { lat: 16.510, lng: 80.490 },
    distance: '2.8 km',
    mapLink: 'https://maps.google.com/?q=16.510,80.490'
  }
];

const getMockNearbyPlaces = (lat, lng) => {
  // Normally we would calculate distance using Haversine formula here if lat/lng are provided.
  // Returning the static mock list for demonstration.
  return Promise.resolve(mockDatabase.map(p => ({
    id: p.id,
    name: p.name,
    address: p.address,
    rating: p.rating,
    distance: p.distance,
    mapLink: p.mapLink
  })));
};

const getMockPlaceDetails = (placeId) => {
  const place = mockDatabase.find(p => p.id === placeId);
  if (place) return Promise.resolve(place);
  return Promise.reject(new Error('Mock Place Not Found'));
};

module.exports = {
  searchNearbyPlaces,
  getPlaceDetails,
};
