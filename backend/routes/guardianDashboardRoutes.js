// routes/guardianDashboardRoutes.js

const express = require('express');
const router = express.Router();
const guardianDashboardController = require('../controllers/guardianDashboardController');
const authMiddleware = require('../middleware/authMiddleware');

// Fetch dashboard stats for a guardian
router.get('/get-dashboard-stats', authMiddleware, guardianDashboardController.getDashboardStats);

module.exports = router;
