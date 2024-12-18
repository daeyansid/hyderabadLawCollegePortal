const express = require('express');
const router = express.Router();
const classAttendanceSingleController = require('../controllers/classAttendanceSingleController');
const authMiddleware = require('../middleware/authMiddleware');

// Routes
router.get('/check-attendance', authMiddleware, classAttendanceSingleController.checkAttendanceExists);
router.get('/attendance-records', authMiddleware, classAttendanceSingleController.getAttendanceRecords);
router.get('/students-list', authMiddleware, classAttendanceSingleController.getStudentsList);
router.post('/save-attendance', authMiddleware, classAttendanceSingleController.saveAttendanceRecords);
router.get('/check-holiday', authMiddleware, classAttendanceSingleController.checkHoliday);
router.get('/check-teacher-attendance', authMiddleware, classAttendanceSingleController.checkTeacherAttendance);

module.exports = router;