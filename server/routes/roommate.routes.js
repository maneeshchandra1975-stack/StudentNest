'use strict';

const express = require('express');
const router  = express.Router();

const {
  createRoommatePost,
  getRoommatePosts,
  updateRoommateStatus,
} = require('../controllers/roommate.controller');

const { protect } = require('../middleware/auth.middleware');

router.get('/', getRoommatePosts);
router.post('/', protect, createRoommatePost);
router.patch('/:id/status', protect, updateRoommateStatus);

module.exports = router;
