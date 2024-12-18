// routes/branchClassDaysRoutes.js

const express = require('express');
const router = express.Router();
const branchClassDaysController = require('../controllers/branchClassDaysController');
const authMiddleware = require('../middleware/authMiddleware');

// Create a new BranchClassDays entry
router.post('/create', authMiddleware, branchClassDaysController.createBranchClassDay);

// Get all BranchClassDays
router.get('/get-all', authMiddleware, branchClassDaysController.getAllBranchClassDays);

// Get BranchClassDays by Branch ID
router.get('/branch/:branchId', authMiddleware, branchClassDaysController.getBranchClassDaysByBranchId);

// Get BranchClassDays by Day ID
router.get('/dayId/:dayId', authMiddleware, branchClassDaysController.getBranchClassDaysByDayId);

// Update a BranchClassDays entry
router.put('/update/:id', authMiddleware, branchClassDaysController.updateBranchClassDay);

// Delete a BranchClassDays entry
router.delete('/delete/:id', authMiddleware, branchClassDaysController.deleteBranchClassDay);

module.exports = router;
