const express = require('express');
const router = express.Router();
const sectionController = require('../controllers/sectionController');
const authMiddleware = require('../middleware/authMiddleware');

// Create Section
router.post('/create', authMiddleware, sectionController.createSection);

// Get All Sections
router.get('/get-all', authMiddleware, sectionController.getAllSections);

// Get Section by ID
router.get('/get-by-id/:id', authMiddleware, sectionController.getSectionById);

// Update Section
router.put('/update/:id', authMiddleware, sectionController.updateSection);

// Delete Section
router.delete('/delete/:id', authMiddleware, sectionController.deleteSection);

// Get sections by classId and branchId
router.get('/sections', authMiddleware, sectionController.getSectionsByClassAndBranchId);

// Fetch Sections by Section ID and Branch ID
router.get('/by-section-and-branch', authMiddleware, sectionController.getSectionsBySectionAndBranchId);

router.get('/class/:classId', authMiddleware, sectionController.getSectionsByClass);



module.exports = router;