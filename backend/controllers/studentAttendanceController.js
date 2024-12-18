// controllers/studentAttendanceController.js

const ClassAttendance = require('../models/ClassAttendance');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/response');

exports.getAttendanceByStudentId = async (req, res) => {
    const { studentId, subjectId } = req.query;

    try {
        if (!studentId) {
            return sendErrorResponse(res, 400, 'studentId is required.');
        }

        const query = { studentId: studentId };

        if (subjectId) {
            query.subjectId = subjectId;
        }

        // Fetch attendance records for the student (and subject if provided)
        const attendanceRecords = await ClassAttendance.find(query)
            .populate('sectionId')
            .populate('subjectId')
            .populate('teacherId')
            .populate('classId')
            .sort({ date: -1 });

        if (!attendanceRecords.length) {
            return sendSuccessResponse(res, 200, 'No attendance records found for this student.', []);
        }

        sendSuccessResponse(res, 200, 'Attendance records fetched successfully.', attendanceRecords);
    } catch (error) {
        console.error('Error fetching attendance records:', error);
        sendErrorResponse(res, 500, 'Server Error', error);
    }
};
