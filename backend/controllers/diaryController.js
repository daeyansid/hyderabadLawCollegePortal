// controllers/diaryController.js

const Diary = require('../models/Diary');
const Class = require('../models/Class');
const Section = require('../models/Section');
const Subject = require('../models/Subject');
const Student = require('../models/Student');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/response');

// Create a new diary entry
exports.createDiary = async (req, res) => {
    const { date, remarks, subject, description, class: classId, section: sectionId, assignedStudents, assignToAll } = req.body;

    try {
        // Validate Class
        const classExists = await Class.findById(classId);
        if (!classExists) {
            return sendErrorResponse(res, 400, 'Invalid Class ID');
        }

        // Validate Section
        const sectionExists = await Section.findById(sectionId);
        if (!sectionExists) {
            return sendErrorResponse(res, 400, 'Invalid Section ID');
        }

        // Validate Subject
        const subjectExists = await Subject.findById(subject);
        if (!subjectExists) {
            return sendErrorResponse(res, 400, 'Invalid Subject ID');
        }

        // If not assigning to all, validate assignedStudents
        if (!assignToAll && (!assignedStudents || !Array.isArray(assignedStudents) || assignedStudents.length === 0)) {
            return sendErrorResponse(res, 400, 'Please assign the diary to at least one student or select "Assign To All".');
        }

        // If assigning to specific students, validate each student
        if (!assignToAll) {
            for (let studentId of assignedStudents) {
                const studentExists = await Student.findById(studentId);
                if (!studentExists) {
                    return sendErrorResponse(res, 400, `Invalid Student ID: ${studentId}`);
                }
            }
        }

        const diary = new Diary({
            date,
            remarks,
            subject,
            description,
            class: classId,
            section: sectionId,
            assignedStudents: assignToAll ? [] : assignedStudents,
            assignToAll: assignToAll || false,
        });

        const savedDiary = await diary.save();
        sendSuccessResponse(res, 201, 'Diary entry created successfully', savedDiary);
    } catch (error) {
        console.error(error);
        sendErrorResponse(res, 500, 'Server error', error);
    }
};

// Get all diary entries
exports.getAllDiaries = async (req, res) => {
    try {
        const diaries = await Diary.find()
            .populate('assignedStudents', 'fullName rollNumber') // Adjust fields as per your Student model
            .populate('class', 'className') // Populate Class details
            .populate('section', 'sectionName') // Populate Section details
            .populate('subject', 'subjectName'); // Populate Subject details

        if (!diaries.length) {
            return sendErrorResponse(res, 404, 'No diary entries found');
        }

        sendSuccessResponse(res, 200, 'All diary entries fetched successfully', diaries);
    } catch (error) {
        console.error(error);
        sendErrorResponse(res, 500, 'Server error', error);
    }
};

// Get a diary entry by ID
exports.getDiaryById = async (req, res) => {
    const { id } = req.params;

    try {
        const diary = await Diary.findById(id)
            .populate('assignedStudents', 'fullName rollNumber') // Adjust fields as per your Student model
            .populate('class', 'className') // Populate Class details
            .populate('section', 'sectionName') // Populate Section details
            .populate('subject', 'subjectName'); // Populate Subject details

        if (!diary) return sendErrorResponse(res, 404, 'Diary entry not found');

        sendSuccessResponse(res, 200, 'Diary entry fetched successfully', diary);
    } catch (error) {
        console.error(error);
        sendErrorResponse(res, 500, 'Server error', error);
    }
};
    
// Update a diary entry
exports.updateDiary = async (req, res) => {
    const { id } = req.params;
    const { date, remarks, subject, description, class: classId, section: sectionId, assignedStudents, assignToAll } = req.body;

    try {
        const diary = await Diary.findById(id);
        if (!diary) return sendErrorResponse(res, 404, 'Diary entry not found');

        // Validate and update Class if provided
        if (classId) {
            const classExists = await Class.findById(classId);
            if (!classExists) {
                return sendErrorResponse(res, 400, 'Invalid Class ID');
            }
            diary.class = classId;
        }

        // Validate and update Section if provided
        if (sectionId) {
            const sectionExists = await Section.findById(sectionId);
            if (!sectionExists) {
                return sendErrorResponse(res, 400, 'Invalid Section ID');
            }
            diary.section = sectionId;
        }

        // Validate and update Subject if provided
        if (subject) {
            const subjectExists = await Subject.findById(subject);
            if (!subjectExists) {
                return sendErrorResponse(res, 400, 'Invalid Subject ID');
            }
            diary.subject = subject;
        }

        // Update other fields
        if (date) diary.date = date;
        if (remarks !== undefined) diary.remarks = remarks;
        if (description) diary.description = description;
        if (assignToAll !== undefined) diary.assignToAll = assignToAll;

        // Handle assignedStudents
        if (assignToAll) {
            diary.assignedStudents = [];
        } else if (assignedStudents) {
            // Validate each student
            for (let studentId of assignedStudents) {
                const studentExists = await Student.findById(studentId);
                if (!studentExists) {
                    return sendErrorResponse(res, 400, `Invalid Student ID: ${studentId}`);
                }
            }
            diary.assignedStudents = assignedStudents;
        }

        const updatedDiary = await diary.save();
        sendSuccessResponse(res, 200, 'Diary entry updated successfully', updatedDiary);
    } catch (error) {
        console.error(error);
        sendErrorResponse(res, 500, 'Server error', error);
    }
};

// Delete a diary entry
exports.deleteDiary = async (req, res) => {
    const { id } = req.params;

    try {
        const diary = await Diary.findById(id);
        if (!diary) return sendErrorResponse(res, 404, 'Diary entry not found');

        await diary.deleteOne();
        sendSuccessResponse(res, 200, 'Diary entry deleted successfully');
    } catch (error) {
        console.error(error);
        sendErrorResponse(res, 500, 'Server error', error);
    }
};
