const express = require('express');
const router = express.Router();
const branchTypeController = require('../controllers/branchTypeController');
// const authMiddleware = require('../middleware/authMiddleware'); // Assuming you have an authentication middleware

// Create a new branch type
router.post('/create', branchTypeController.createBranchType);

// Get all branch types
router.get('/get-all', branchTypeController.getAllBranchTypes);

// Get all branch types for select list
router.get('/get-branch-type-select-list', branchTypeController.getBranchTypesSelectList);

// Get a branch type by ID
router.get('/get-by-id/:id', branchTypeController.getBranchTypeById);

// Update a branch type
router.put('/update/:id', branchTypeController.updateBranchType);

// Delete a branch type
router.delete('/delete/:id', branchTypeController.deleteBranchType);

module.exports = router;
