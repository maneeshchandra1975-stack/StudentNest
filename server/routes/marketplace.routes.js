'use strict';

const express = require('express');
const router  = express.Router();

const {
  createMarketplaceItem,
  getMarketplaceItems,
  updateItemStatus,
  reportItem,
} = require('../controllers/marketplace.controller');

const { protect } = require('../middleware/auth.middleware');

router.get('/', getMarketplaceItems);
router.post('/', protect, createMarketplaceItem);
router.patch('/:id/status', protect, updateItemStatus);
router.post('/:id/report', protect, reportItem);

module.exports = router;
