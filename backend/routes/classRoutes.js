const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');
const authMiddleware = require('../middleware/authMiddleware');

// Create Class
router.post('/create', authMiddleware, classController.createClass);

// Get All Classes
router.get('/get-all', authMiddleware, classController.getAllClasses);

// Get Class by ID
router.get('/get-by-id/:id', authMiddleware, classController.getClassById);

// Update Class
router.put('/update/:id', authMiddleware, classController.updateClass);

// Delete Class
router.delete('/delete/:id', authMiddleware, classController.deleteClass);

// Get classes by branchId
router.get('/classes', authMiddleware, classController.getClassesByBranchId);

// Get all classes of branch
router.get('/branch/:branchId', authMiddleware, classController.getClassesByBranch);

module.exports = router;
