import express from 'express';
import {
  sendInterestRequest,
  getReceivedRequests,
  getSentRequests,
  respondToInterest,
  cancelInterestRequest,
  checkChatPermission,
} from '../controllers/interest.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.post('/', sendInterestRequest);
router.get('/received', getReceivedRequests);
router.get('/sent', getSentRequests);
router.patch('/:id/respond', respondToInterest);
router.delete('/:id/cancel', cancelInterestRequest);
router.get('/permission/:targetUserId', checkChatPermission);

export default router;
