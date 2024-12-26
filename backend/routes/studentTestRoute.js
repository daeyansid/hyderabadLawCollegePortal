const express = require('express');
const router = express.Router();
const {
    createStudentTest,
    getAllStudentTests,
    getStudentTest,
    updateStudentTest,
    deleteStudentTest,
    validateStudentTest,
    getStudentTestsByClassAndStudent
} = require('../controllers/studentTestController');
const authMiddleware = require('../middleware/authMiddleware');

// create new student test
router.post('/create',  authMiddleware, validateStudentTest, createStudentTest);

// get all student tests
router.get('/get-all',  authMiddleware, getAllStudentTests);

// get single student test
router.get('/get-by-id:id',  authMiddleware, getStudentTest);

// get student tests by classId and studentId
router.get('/get-by-class-and-student', authMiddleware, getStudentTestsByClassAndStudent);

// update student test
router.put('/update-by-id:id', authMiddleware, validateStudentTest, updateStudentTest);

// delete student test
router.delete('/delete:id', authMiddleware, deleteStudentTest);

module.exports = router;
