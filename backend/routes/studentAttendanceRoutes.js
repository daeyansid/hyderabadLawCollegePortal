// routes/studentAttendanceRoutes.js

const express = require('express');
const router = express.Router();
const studentAttendanceController = require('../controllers/studentAttendanceController');
const authMiddleware = require('../middleware/authMiddleware');

// Fetch attendance records for a student
router.get('/get-attendance', authMiddleware, studentAttendanceController.getAttendanceByStudentId);

module.exports = router;
