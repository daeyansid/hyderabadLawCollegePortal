// routes/guardianAttendanceRoutes.js

const express = require('express');
const router = express.Router();
const guardianAttendanceSingleController = require('../controllers/guardianAttendanceSingleController');
const authMiddleware = require('../middleware/authMiddleware');

// Fetch attendance records for a student
router.get('/get-attendance', authMiddleware, guardianAttendanceSingleController.getAttendanceByStudentId);

module.exports = router;
