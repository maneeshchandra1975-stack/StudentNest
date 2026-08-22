import express from 'express';
import {
  createMarketplaceItem,
  getMarketplaceItems,
  updateItemStatus,
  reportItem,
} from '../controllers/marketplace.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', getMarketplaceItems);
router.post('/', protect, createMarketplaceItem);
router.patch('/:id/status', protect, updateItemStatus);
router.post('/:id/report', protect, reportItem);

export default router;
