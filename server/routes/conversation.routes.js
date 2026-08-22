'use strict';

const express = require('express');
const router  = express.Router();

const {
  getUserConversations,
  getConversationById,
  getMessages,
  sendMessage,
  getOrCreateByInterest,
} = require('../controllers/conversation.controller');

const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.get('/', getUserConversations);
router.get('/by-interest/:interestRequestId', getOrCreateByInterest);
router.get('/:id', getConversationById);
router.get('/:id/messages', getMessages);
router.post('/:id/messages', sendMessage);

module.exports = router;
