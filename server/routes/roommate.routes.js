import express from 'express';
import {
  createRoommatePost,
  getRoommatePosts,
  updateRoommateStatus,
} from '../controllers/roommate.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', getRoommatePosts);
router.post('/', protect, createRoommatePost);
router.patch('/:id/status', protect, updateRoommateStatus);

export default router;
