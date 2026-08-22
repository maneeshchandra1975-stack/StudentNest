'use strict';

const express = require('express');
const router  = express.Router();

const { getNearbyPGs } = require('../controllers/nearby.controller');

router.get('/', getNearbyPGs);

module.exports = router;
