// controllers/guardianStudentsController.js

const Student = require('../models/Student');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/response');

exports.getStudentsByGuardianId = async (req, res) => {
    const { guardianId } = req.query;

    try {
        if (!guardianId) {
            return sendErrorResponse(res, 400, 'guardianId is required.');
        }

        // Fetch students associated with the guardianId
        const students = await Student.find({ guardianId: guardianId })
            .populate('classId', 'className')
            .populate('sectionId', 'sectionName')
            .sort({ fullName: 1 });

        if (!students.length) {
            return sendSuccessResponse(res, 200, 'No students found for this guardian.', []);
        }

        sendSuccessResponse(res, 200, 'Students fetched successfully.', students);
    } catch (error) {
        console.error('Error fetching students:', error);
        sendErrorResponse(res, 500, 'Server Error', error);
    }
};
