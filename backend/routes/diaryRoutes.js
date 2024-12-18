// routes/diaryRoutes.js

const express = require('express');
const router = express.Router();
const diaryController = require('../controllers/diaryController');
const authMiddleware = require('../middleware/authMiddleware');

// Create a new diary entry
router.post('/create', authMiddleware, diaryController.createDiary);

// Get all diary entries
router.get('/get-all', authMiddleware, diaryController.getAllDiaries);

// Get a diary entry by ID
router.get('/get/:id', authMiddleware, diaryController.getDiaryById);

// Update a diary entry
router.put('/update/:id', authMiddleware, diaryController.updateDiary);

// Delete a diary entry
router.delete('/delete/:id', authMiddleware, diaryController.deleteDiary);

module.exports = router;
