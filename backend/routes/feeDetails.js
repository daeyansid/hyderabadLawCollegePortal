const express = require('express');
const router = express.Router();
const feeDetailsController = require('../controllers/feeDetails');
const authMiddleware = require('../middleware/authMiddleware');
const uploadChallan = require('../middleware/uploadChallan');

// Create fee details - with challan upload
router.post('/create', authMiddleware, uploadChallan.single('challanPicture'), feeDetailsController.createFeeDetails);

// Get all fee details
router.get('/get-all', authMiddleware, feeDetailsController.getAllFeeDetails);

// Get fee details by student ID
router.get('/student/:studentId', authMiddleware, feeDetailsController.getFeeDetailsByStudentId);

// Get fee details by class ID
router.get('/class/:classId', authMiddleware, feeDetailsController.getFeeDetailsByClassId);

// Get fee detail by ID
router.get('/get-by-id/:id', authMiddleware, feeDetailsController.getFeeDetailById);

// Check if fee detail exists
router.get('/check-exists', authMiddleware, feeDetailsController.checkFeeDetailExists);

// Update fee details
router.put('/update/:id', authMiddleware, uploadChallan.single('challanPicture'), feeDetailsController.updateFeeDetails);

// Delete fee details
router.delete('/delete/:id', authMiddleware, feeDetailsController.deleteFeeDetails);

module.exports = router;
