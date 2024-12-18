// routes/guardianAttendanceRoutes.js

const express = require('express');
const router = express.Router();
const guardianAttendanceController = require('../controllers/guardianAttendanceController');
const authMiddleware = require('../middleware/authMiddleware');

// Fetch attendance records for a student
router.get('/get-attendance', authMiddleware, guardianAttendanceController.getAttendanceByStudentId);

module.exports = router;
