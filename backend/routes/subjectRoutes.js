const express = require('express');
const router = express.Router();
const subjectController = require('../controllers/subjectController');
const authMiddleware = require('../middleware/authMiddleware');

// Create Subject
router.post('/create', authMiddleware, subjectController.createSubject);

// Get All Subjects
router.get('/get-all', authMiddleware, subjectController.getAllSubjects);

// Get All Subjects
router.get('/get-all-new', authMiddleware, subjectController.getAllSubjectsNew);

// Get Subject by ID
router.get('/get-by-id/:id', authMiddleware, subjectController.getSubjectById);

// Update Subject
router.put('/update/:id', authMiddleware, subjectController.updateSubject);

// Delete Subject
router.delete('/delete/:id', authMiddleware, subjectController.deleteSubject);

// Fetch all Subjects by batch ID and class ID
router.post('/get-all-subject-by-class-batch', authMiddleware, subjectController.fetchSubjectByClassAndBranch);

// Fetch all Subjects by batch ID and class ID
router.post('/get-all-by-class', authMiddleware, subjectController.fetchSubjectByClass);

module.exports = router;