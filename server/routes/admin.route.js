'use strict';

const express = require('express');
const { protect, restrictTo } = require('../middleware/auth.middleware');
const adminController = require('../controllers/admin.controller');

const router = express.Router();

// All admin routes must be protected and restricted to 'admin' role
router.use(protect);
router.use(restrictTo('admin'));

// 1. Dashboard Analytics
router.get('/dashboard', adminController.getDashboardAnalytics);

// 2. User Management
router.get('/users', adminController.getUsers);
router.patch('/users/:id/status', adminController.updateUserStatus);

// 3. Marketplace Moderation
router.get('/marketplace', adminController.getMarketplaceListings);
router.delete('/marketplace/:id', adminController.deleteMarketplaceListing);

// 4. Housing / Vacancy Moderation
router.get('/housing', adminController.getHousingPosts);
router.delete('/housing/:id', adminController.deleteHousingPost);

// 5. Report Management
router.get('/reports', adminController.getReports);
router.patch('/reports/:id/status', adminController.updateReportStatus);

// 6. Review Moderation
router.get('/reviews', adminController.getReviews);
router.delete('/reviews/:id', adminController.deleteReview);

module.exports = router;
