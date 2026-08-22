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
} = require('../controllers/interest.controller');

const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.post('/', sendInterestRequest);
router.get('/received', getReceivedRequests);
router.get('/sent', getSentRequests);
router.patch('/:id/respond', respondToInterest);
router.delete('/:id/cancel', cancelInterestRequest);
router.get('/permission/:targetUserId', checkChatPermission);

module.exports = router;
