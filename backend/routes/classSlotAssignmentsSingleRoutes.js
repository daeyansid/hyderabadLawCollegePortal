// routes/classSlotAssignmentsSingleRoutes.js

const express = require('express');
const router = express.Router();
const classSlotAssignmentsSingleController = require('../controllers/classSlotAssignmentsSingleController');

// Route to get all class slot assignments for a teacher on a specific day
router.get('/assigned-classes/slots/:branchDayId', classSlotAssignmentsSingleController.getAssignmentsByTeacherAndDay);

module.exports = router;
