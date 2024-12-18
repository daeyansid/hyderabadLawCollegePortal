// routes/studentSubjectRoutes.js

const express = require('express');
const router = express.Router();
const studentSubjectController = require('../controllers/studentSubjectController');
const authMiddleware = require('../middleware/authMiddleware');

// Fetch subjects for a student based on classId and sectionId
router.get('/get-subjects', authMiddleware, studentSubjectController.getSubjectsByClassAndSection);

module.exports = router;
