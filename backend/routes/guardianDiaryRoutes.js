// routes/guardianDiaryRoutes.js

const express = require('express');
const router = express.Router();
const guardianDiaryController = require('../controllers/guardianDiaryController');
const authMiddleware = require('../middleware/authMiddleware');

// Fetch diary entries for a student
router.get('/get-diary', authMiddleware, guardianDiaryController.getDiaryEntriesByStudentId);

module.exports = router;
