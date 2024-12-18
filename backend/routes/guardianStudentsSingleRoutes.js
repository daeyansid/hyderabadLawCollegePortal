// routes/guardianStudentsRoutes.js

const express = require('express');
const router = express.Router();
const guardianStudentsController = require('../controllers/guardianStudentsController');
const authMiddleware = require('../middleware/authMiddleware');

// Fetch students for a guardian based on guardianId
router.get('/get-students', authMiddleware, guardianStudentsController.getStudentsByGuardianId);

module.exports = router;