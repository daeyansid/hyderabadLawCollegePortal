// routes/classSlotAssignmentsStudentRoutes.js

const express = require('express');
const router = express.Router();
const classSlotAssignmentsStudentController = require('../controllers/classSlotAssignmentsStudentController');
const authMiddleware = require('../middleware/authMiddleware');

// Existing routes can remain or be duplicated with student-specific logic
router.get('/get-all-slots-for-day', authMiddleware, classSlotAssignmentsStudentController.getAllSlotsForDayStudent);

module.exports = router;
