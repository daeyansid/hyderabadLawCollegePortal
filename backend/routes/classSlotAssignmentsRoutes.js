// routes/classSlotAssignmentsRoutes.js

const express = require('express');
const router = express.Router();
const classSlotAssignmentsController = require('../controllers/classSlotAssignmentsController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/create', authMiddleware, classSlotAssignmentsController.createClassSlotAssignment);

router.get('/get-all', authMiddleware, classSlotAssignmentsController.getAllClassSlotAssignments);

router.get('/get-all-slots-for-day', authMiddleware, classSlotAssignmentsController.getAllSlotsForDay);

router.get('/get/:id', authMiddleware, classSlotAssignmentsController.getClassSlotAssignmentById);

router.put('/update/:id', authMiddleware, classSlotAssignmentsController.updateClassSlotAssignment);

router.delete('/delete/:id', authMiddleware, classSlotAssignmentsController.deleteClassSlotAssignment);

router.get('/get-assignments', authMiddleware, classSlotAssignmentsController.getTeacherAssignments);

module.exports = router;