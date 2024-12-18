// controllers/studentSubjectController.js

const Subject = require('../models/Subject');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/response');

exports.getSubjectsByClassAndSection = async (req, res) => {
    const { classId, sectionId } = req.query;

    try {
        if (!classId || !sectionId) {
            return sendErrorResponse(res, 400, 'classId and sectionId are required.');
        }

        // Fetch subjects based on sectionId
        const subjects = await Subject.find({ sectionId: sectionId })
            .populate('sectionId')
            .sort({ subjectName: 1 });

        if (!subjects.length) {
            return sendSuccessResponse(res, 200, 'No subjects found for this class and section.', []);
        }

        sendSuccessResponse(res, 200, 'Subjects fetched successfully.', subjects);
    } catch (error) {
        console.error('Error fetching subjects:', error);
        sendErrorResponse(res, 500, 'Server Error', error);
    }
};
