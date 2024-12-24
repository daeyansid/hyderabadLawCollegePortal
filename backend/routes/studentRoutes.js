const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadStudent');

// Register student
router.post('/create', authMiddleware, upload.single('photo'), studentController.createStudent);

// Get All students
router.get('/get-all', authMiddleware, studentController.getAllStudent);

// Get student by ID
router.get('/get-by-id/:id', authMiddleware, studentController.getStudentById);

// Update student route
router.put('/update/:studentId', authMiddleware, upload.single('photo'), studentController.updateStudent);

// Delete student
router.delete('/delete/:studentId', authMiddleware, studentController.deleteStudent);

// get students by class
router.post('/class/:classId', authMiddleware, studentController.getStudentsByClass);

// Get students by semester
router.get('/by-semester/:semesterId', authMiddleware, studentController.getStudentsBySemester);

// router.get('/fetch-by-batch-year', studentController.getStudentsByBatchYearAndBranch);
// router.get('/fetch-by-batch-year', studentController.getStudentsByBatchYear);

module.exports = router;