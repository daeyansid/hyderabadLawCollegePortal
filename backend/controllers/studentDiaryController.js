// controllers/studentDiaryController.js

const Diary = require('../models/Diary');
const mongoose = require('mongoose');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/response');

exports.getStudentDiary = async (req, res) => {
    const { classId, sectionId, adminSelfId } = req.query;

    try {
        if (!classId || !sectionId || !adminSelfId) {
            return sendErrorResponse(res, 400, 'classId, sectionId, and adminSelfId are required.');
        }

        // Validate ObjectIds
        if (
            !mongoose.Types.ObjectId.isValid(classId) ||
            !mongoose.Types.ObjectId.isValid(sectionId) ||
            !mongoose.Types.ObjectId.isValid(adminSelfId)
        ) {
            return sendErrorResponse(res, 400, 'Invalid IDs provided.');
        }

        // Fetch diaries where:
        // - class and section match
        // OR
        // - assignedStudents includes adminSelfId

        const diaries = await Diary.find({
            $or: [
                { class: classId, section: sectionId },
                { assignedStudents: adminSelfId },
            ],
        })
            .populate('subject')
            .populate('class')
            .populate('section')
            .sort({ date: -1 }); // Sort by date, latest first

        if (!diaries.length) {
            return sendSuccessResponse(res, 200, 'No diary entries found.', []);
        }

        sendSuccessResponse(res, 200, 'Diary entries fetched successfully.', diaries);
    } catch (error) {
        console.error('Error fetching diary entries:', error);
        sendErrorResponse(res, 500, 'Server Error', error);
    }
};
