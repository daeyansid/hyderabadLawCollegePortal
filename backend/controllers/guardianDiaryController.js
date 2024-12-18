// controllers/guardianDiaryController.js

const Diary = require('../models/Diary');
const Student = require('../models/Student');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/response');

exports.getDiaryEntriesByStudentId = async (req, res) => {
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

        const classId = student.classId._id;
        const sectionId = student.sectionId._id;

        // Fetch diary entries assigned to the student's class and section (assignToAll)
        // or specifically assigned to the student
        const diaryEntries = await Diary.find({
            $or: [
                {
                    assignToAll: true,
                    class: classId,
                    section: sectionId,
                },
                {
                    assignedStudents: studentId,
                },
            ],
        })
            .populate('subject', 'subjectName')
            .sort({ date: -1 });

        sendSuccessResponse(res, 200, 'Diary entries fetched successfully.', {
            student,
            diaryEntries,
        });
    } catch (error) {
        console.error('Error fetching diary entries:', error);
        sendErrorResponse(res, 500, 'Server Error', error);
    }
};
