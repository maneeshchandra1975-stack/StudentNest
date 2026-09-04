'use strict';

const express = require('express');
const router  = express.Router();

const { getNearbyPGs, getPlaceDetailsEndpoint } = require('../controllers/nearby.controller');

router.get('/', getNearbyPGs);
router.get('/:id', getPlaceDetailsEndpoint);

module.exports = router;
