// routes/staffLeaveRoutes.js

const express = require('express');
const router = express.Router();
const staffLeaveController = require('../controllers/staffLeaveController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadPdfTeacherLeave');

// Create a new staff leave request
router.post('/create', authMiddleware, upload.single('doc'), staffLeaveController.createStaffLeave);

// Get all staff leave requests
router.get('/get-all', authMiddleware, staffLeaveController.getAllStaffLeaves);

// Get a staff leave request by Leave ID
router.get('/get/:id', authMiddleware, staffLeaveController.getStaffLeaveById);

// Get staff leave requests by Staff ID
router.get('/staff/:staffId', authMiddleware, staffLeaveController.getStaffLeavesByStaffId);

// Update a staff leave request with optional file upload
router.put('/update/:id', authMiddleware, upload.single('doc'), staffLeaveController.updateStaffLeave);

// Delete a staff leave request
router.delete('/delete/:id', authMiddleware, staffLeaveController.deleteStaffLeave);

module.exports = router;
