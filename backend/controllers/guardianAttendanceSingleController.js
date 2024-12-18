// controllers/guardianAttendanceController.js

const ClassAttendanceSingle = require('../models/ClassAttendanceSingle');
const Student = require('../models/Student');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/response');

exports.getAttendanceByStudentId = async (req, res) => {
    const { studentId } = req.query;

    try {
        if (!studentId) {
            return sendErrorResponse(res, 400, 'studentId is required.');
        }

        // Fetch student details
        const student = await Student.findById(studentId)
            .populate('classId', 'className')
            .populate('sectionId', 'sectionName');

        if (!student) {
            return sendErrorResponse(res, 404, 'Student not found.');
        }

        // Fetch attendance records for the student
        const attendanceRecords = await ClassAttendanceSingle.find({ studentId: studentId })
            .sort({ date: -1 });

        sendSuccessResponse(res, 200, 'Attendance records fetched successfully.', {
            student,
            attendanceRecords,
        });
    } catch (error) {
        console.error('Error fetching attendance records:', error);
        sendErrorResponse(res, 500, 'Server Error', error);
    }
};
