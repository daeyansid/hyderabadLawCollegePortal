// routes/branchAdminDashboardRoutes.js

const express = require('express');
const router = express.Router();
const branchAdminDashboardController = require('../controllers/branchAdminDashboardController');
const authMiddleware = require('../middleware/authMiddleware');

// Fetch dashboard stats for a branch admin
router.get('/get-dashboard-stats', authMiddleware, branchAdminDashboardController.getDashboardStats);

module.exports = router;
