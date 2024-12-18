// routes/studentAttendanceRoutes.js

const express = require('express');
const router = express.Router();
const studentAttendanceSingleController = require('../controllers/studentAttendanceSingleController');
const authMiddleware = require('../middleware/authMiddleware');

// Fetch attendance records for a student
router.get('/get-attendance', authMiddleware, studentAttendanceSingleController.getAttendanceByStudentId);

module.exports = router;
