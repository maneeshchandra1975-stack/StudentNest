'use strict';

const express = require('express');
const router = express.Router();

const {
  createReport,
  getMyReports,
  getReportDetails,
} = require('../controllers/report.controller');

const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.post('/', createReport);
router.get('/my', getMyReports);
router.get('/:id', getReportDetails);

module.exports = router;
