const express = require('express');
const router = express.Router();
const teacherAttendanceController = require('../controllers/teacherAttendance');

// Create attendance
router.post('/create', teacherAttendanceController.createAttendance);

// Get all attendance records
router.get('/all', teacherAttendanceController.getAllAttendance);

// Get attendance by ID
router.get('/:id', teacherAttendanceController.getAttendanceById);

// Get attendance by teacher ID
router.get('/teacher/:teacherId', teacherAttendanceController.getAttendanceByTeacher);

// Check existing attendance
router.post('/check', teacherAttendanceController.checkExistingAttendance);

// Update attendance
router.put('/:id', teacherAttendanceController.updateAttendance);

// Get attendance count by month and year
router.get('/count/:teacherId/:month/:year', teacherAttendanceController.getAttendanceCount);

module.exports = router;