// routes/studentDashboardRoutes.js

const express = require('express');
const router = express.Router();
const studentDashboardController = require('../controllers/studentDashboardController');
const authMiddleware = require('../middleware/authMiddleware');

// Fetch dashboard stats for a student
router.get('/get-dashboard-stats', authMiddleware, studentDashboardController.getDashboardStats);

module.exports = router;
