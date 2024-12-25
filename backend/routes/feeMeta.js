const express = require('express');
const router = express.Router();
const feeMetaController =  require('../controllers/feeMeta');
const authMiddleware = require('../middleware/authMiddleware');

// Create fee structure
router.post('/create', authMiddleware, feeMetaController.createFee);

// Get all fee structures
router.get('/get-all', authMiddleware, feeMetaController.getAllFees);

// Get fee structure by ID
router.get('/:id', authMiddleware, feeMetaController.getFeeById);

// Update fee structure
// router.put('/update/:id', authMiddleware, feeMetaController.updateFee);

// Delete fee structure
router.put('/delete/:id', authMiddleware, feeMetaController.deleteFee);

module.exports = router;
