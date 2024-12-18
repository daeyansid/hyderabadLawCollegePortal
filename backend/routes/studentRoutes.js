const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const authMiddleware = require('../middleware/authMiddleware');

// Register student
router.post('/create', authMiddleware, studentController.registerStudent);

// Get All students
router.get('/get-all', authMiddleware, studentController.getAllStudent);
// router.get('/fetch-by-batch-year', studentController.getStudentsByBatchYearAndBranch);
router.get('/fetch-by-batch-year', studentController.getStudentsByBatchYear);
// Get student by ID
router.get('/get-by-id/:id', authMiddleware, studentController.getStudentById);

// Update student
router.put('/update/:id', authMiddleware, studentController.updateStudent);

// Delete student
router.delete('/delete/:id', authMiddleware, studentController.deleteStudent);

router.get('/class/:classId/section/:sectionId', authMiddleware, studentController.getStudentsByClassAndSection);

module.exports = router;