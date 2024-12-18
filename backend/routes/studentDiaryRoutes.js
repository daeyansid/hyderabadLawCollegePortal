// routes/studentDiaryRoutes.js

const express = require('express');
const router = express.Router();
const studentDiaryController = require('../controllers/studentDiaryController');
const authMiddleware = require('../middleware/authMiddleware');

// Fetch diary entries for a student
router.get('/get-student-diary', authMiddleware, studentDiaryController.getStudentDiary);

module.exports = router;
