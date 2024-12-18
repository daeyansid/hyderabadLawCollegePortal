const express = require('express');
const router = express.Router();
const branchAdminController = require('../controllers/branchAdminController');
const authMiddleware = require('../middleware/authMiddleware');

// Create Branch Admin
router.post('/create-branch-admin', authMiddleware, branchAdminController.registerBranchAdmin);

// Get All Branch Admins
router.get('/get-all-branch-admins', authMiddleware, branchAdminController.getAllBranchAdmins);

// Get Branch Admin by ID
router.get('/get-branch-admin/:id', authMiddleware, branchAdminController.getBranchAdminById);

// Update Branch Admin
router.put('/update-branch-admin/:id', authMiddleware, branchAdminController.updateBranchAdmin);

// Delete Branch Admin
router.delete('/delete-branch-admin/:id', authMiddleware, branchAdminController.deleteBranchAdmin);

module.exports = router;