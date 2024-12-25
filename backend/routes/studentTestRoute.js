const express = require('express');
const router = express.Router();
const {
    createStudentTest,
    getAllStudentTests,
    getStudentTest,
    updateStudentTest,
    deleteStudentTest,
    validateStudentTest
} = require('../controllers/studentTestController');
const authMiddleware = require('../middleware/authMiddleware');

// create new student test
router.post('/create',  validateStudentTest, createStudentTest);

// get all student tests
router.get('/get-all',  getAllStudentTests);

// get single student test
router.get('/get-by-id:id',  getStudentTest);

// update student test
router.put('/update-by-id:id', validateStudentTest, updateStudentTest);

// delete student test
router.delete('/delete:id', authMiddleware, deleteStudentTest);

module.exports = router;
