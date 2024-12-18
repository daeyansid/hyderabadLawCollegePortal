const express = require('express');
const router = express.Router();
const classAttendanceController = require('../controllers/classAttendanceController');
const authMiddleware = require('../middleware/authMiddleware');

// Routes
router.get('/check-attendance', authMiddleware, classAttendanceController.checkAttendanceExists);
router.get('/attendance-records', authMiddleware, classAttendanceController.getAttendanceRecords);
router.get('/students-list', authMiddleware, classAttendanceController.getStudentsList);
router.post('/save-attendance', authMiddleware, classAttendanceController.saveAttendanceRecords);
router.get('/check-holiday', authMiddleware, classAttendanceController.checkHoliday);
router.get('/check-teacher-attendance', authMiddleware, classAttendanceController.checkTeacherAttendance);

module.exports = router;