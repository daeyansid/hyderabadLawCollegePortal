const express = require('express');
const router = express.Router();
const teacherAttendanceController = require('../controllers/teacherAttendance');
const authMiddleware = require('../middleware/authMiddleware');

// Create attendance
router.post('/create', authMiddleware ,teacherAttendanceController.createAttendance);

// Get all attendance records
router.get('/all', authMiddleware ,teacherAttendanceController.getAllAttendance);

// Get attendance by ID
router.get('/:id', authMiddleware ,teacherAttendanceController.getAttendanceById);

// Get attendance by teacher ID
router.get('/teacher/:teacherId', authMiddleware ,teacherAttendanceController.getAttendanceByTeacher);

// Check existing attendance
router.post('/check', authMiddleware ,teacherAttendanceController.checkExistingAttendance);

// Update attendance
router.put('/:id', authMiddleware ,teacherAttendanceController.updateAttendance);

// Get attendance count by month and year
router.get('/count/:teacherId/:month/:year', authMiddleware ,teacherAttendanceController.getAttendanceCount);

module.exports = router;