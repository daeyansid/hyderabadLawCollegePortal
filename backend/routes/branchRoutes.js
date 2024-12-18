const express = require('express');
const router = express.Router();
const branchController = require('../controllers/branchController');
const authMiddleware = require('../middleware/authMiddleware');

// Create a new Branch
router.post('/create', authMiddleware, branchController.createBranch);

// Get all Branches
router.get('/get-all', authMiddleware, branchController.getAllBranches);

// Get a single Branch by ID
router.get('/get/:id', authMiddleware, branchController.getBranchById);

// Update a Branch
router.put('/update/:id', authMiddleware, branchController.updateBranch);

// Delete a Branch
router.delete('/delete/:id', authMiddleware, branchController.deleteBranch);

module.exports = router;
