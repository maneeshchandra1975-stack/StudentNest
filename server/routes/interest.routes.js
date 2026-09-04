'use strict';

const express = require('express');
const router  = express.Router();

const {
  sendInterestRequest,
  getReceivedRequests,
  getSentRequests,
  respondToInterest,
  cancelInterestRequest,
  checkChatPermission,
  markInteractionCompleted,
} = require('../controllers/interest.controller');

const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.post('/', sendInterestRequest);
router.get('/received', getReceivedRequests);
router.get('/sent', getSentRequests);
router.patch('/:id/respond', respondToInterest);
router.patch('/:id/complete', markInteractionCompleted);
router.delete('/:id/cancel', cancelInterestRequest);
router.get('/permission/:targetUserId', checkChatPermission);

module.exports = router;
