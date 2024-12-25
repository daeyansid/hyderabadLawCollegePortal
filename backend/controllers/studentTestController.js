const StudentTest = require('../models/StudentTest');
const { validationResult, body } = require('express-validator');

// Validation rules
exports.validateStudentTest = [
    body('studentId')
        .notEmpty()
        .withMessage('Student ID is required')
        .isMongoId()
        .withMessage('Invalid Student ID format'),
    body('classId')
        .notEmpty()
        .withMessage('Class ID is required')
        .isMongoId()
        .withMessage('Invalid Class ID format'),
    body('subjectId')
        .notEmpty()
        .withMessage('Subject ID is required')
        .isMongoId()
        .withMessage('Invalid Subject ID format'),
    body('midTermPaperMarks')
        .notEmpty()
        .withMessage('Mid term paper marks are required')
        .isInt({ min: 0, max: 20 })
        .withMessage('Mid term paper marks must be between 0 and 20'),
    body('assignmentPresentationMarks')
        .notEmpty()
        .withMessage('Assignment presentation marks are required')
        .isInt({ min: 0, max: 10 })
        .withMessage('Assignment presentation marks must be between 0 and 10'),
    body('attendanceMarks')
        .notEmpty()
        .withMessage('Attendance marks are required')
        .isInt({ min: 0, max: 10 })
        .withMessage('Attendance marks must be between 0 and 10')
];

// Create new student test
exports.createStudentTest = async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }

    try {
        // Check if student test already exists for this student, class and subject
        const existingTest = await StudentTest.findOne({
            studentId: req.body.studentId,
            classId: req.body.classId,
            subjectId: req.body.subjectId
        });

        if (existingTest) {
            return res.status(400).json({
                success: false,
                message: 'Student test already exists for this student in this class and subject'
            });
        }

        const studentTest = await StudentTest.create(req.body);
        res.status(201).json({
            success: true,
            data: studentTest
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Get all student tests
exports.getAllStudentTests = async (req, res) => {
    try {
        const studentTests = await StudentTest.find({ IsDelete: false })
            .populate('studentId')
            .populate('classId')
            .populate('subjectId');
        res.status(200).json({
            success: true,
            count: studentTests.length,
            data: studentTests
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Get single student test
exports.getStudentTest = async (req, res) => {
    try {
        const id = req.params.id.replace('&id=', '');
        const studentTest = await StudentTest.findOne({ _id: id, IsDelete: false })
            .populate('studentId')
            .populate('classId');

        if (!studentTest) {
            return res.status(404).json({
                success: false,
                message: 'Student test not found'
            });
        }

        res.status(200).json({
            success: true,
            data: studentTest
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Update student test
exports.updateStudentTest = async (req, res) => {
    // Check for validation errors
    const id = req.params.id.replace('&id=', '');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }

    try {
        // Check if total marks exceed maximum
        const totalMarks = req.body.midTermPaperMarks +
            req.body.assignmentPresentationMarks +
            req.body.attendanceMarks;

        if (totalMarks > 40) {
            return res.status(400).json({
                success: false,
                message: 'Total marks cannot exceed 40'
            });
        }

        const studentTest = await StudentTest.findByIdAndUpdate(
            id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!studentTest) {
            return res.status(404).json({
                success: false,
                message: 'Student test not found'
            });
        }

        res.status(200).json({
            success: true,
            data: studentTest
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Delete student test
exports.deleteStudentTest = async (req, res) => {
    try {
        const id = req.params.id.replace('&id=', '');

        const studentTest = await StudentTest.findByIdAndUpdate(
            id,
            { IsDelete: true },
            { new: true }
        );

        if (!studentTest) {
            return res.status(404).json({
                success: false,
                message: 'Student test not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Student test marked as deleted successfully',
            data: studentTest
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'An error occurred while deleting the student test',
            error: error.message
        });
    }
};