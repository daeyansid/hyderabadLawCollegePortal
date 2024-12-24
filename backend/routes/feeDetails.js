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

// Update fee details
router.put('/update/:id', authMiddleware, uploadChallan.single('challanPicture'), feeDetailsController.updateFeeDetails);

// Delete fee details
router.delete('/delete/:id', authMiddleware, feeDetailsController.deleteFeeDetails);

module.exports = router;
