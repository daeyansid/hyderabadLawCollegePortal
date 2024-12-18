// routes/branchAdminLeaveRoutes.js

const express = require('express');
const router = express.Router();
const branchAdminLeaveController = require('../controllers/branchAdminLeaveController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadPdfBranchAdminLeave');

// Create a new leave request with file upload
router.post('/create', authMiddleware, upload.single('doc'), branchAdminLeaveController.createLeave);

// Get all leave requests
router.get('/get-all', authMiddleware, branchAdminLeaveController.getAllLeaves);

// Get a leave request by Leave ID
router.get('/get/:id', authMiddleware, branchAdminLeaveController.getLeaveById);

// Get leave requests by Branch Admin ID
router.get('/branch-admin/:branchAdminId', authMiddleware, branchAdminLeaveController.getLeavesByBranchAdminId);

// Update a leave request with file upload
router.put('/update/:id', authMiddleware, upload.single('doc'), branchAdminLeaveController.updateLeave);

// Delete a leave request
router.delete('/delete/:id', authMiddleware, branchAdminLeaveController.deleteLeave);

// Update Status
router.put('/update-status/:id', authMiddleware, branchAdminLeaveController.updateBranchAdminLeaveStatus);

module.exports = router;