const Subject = require('../models/Subject');
const Section = require('../models/Section');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/response');
const { validateRequiredFields } = require('../utils/validateRequiredFields');

// Create a new subject
exports.createSubject = async (req, res) => {
    const { sectionId, subjectName } = req.body;

    try {
        // Validate required fields
        const missingFields = validateRequiredFields({ sectionId, subjectName });
        if (missingFields.length > 0) {
            return sendErrorResponse(res, 400, `Missing fields: ${missingFields.join(', ')}`);
        }

        // Validate existence of section
        const section = await Section.findById(sectionId);
        if (!section) {
            return sendErrorResponse(res, 404, 'Section not found');
        }

        // Create a new Subject entry
        const subject = new Subject({ sectionId, subjectName });
        const savedSubject = await subject.save();

        sendSuccessResponse(res, 201, 'Subject created successfully', savedSubject);
    } catch (err) {
        console.error(err.message);
        sendErrorResponse(res, 500, 'Server error', err);
    }
};

// Get all subjects
exports.getAllSubjects = async (req, res) => {
    const { branchId } = req.query;
    if (!branchId) {
        return sendErrorResponse(res, 400, 'Branch ID is required');
    }

    try {
        // Find all sections that match the branchId
        const sections = await Section.find({ branchId });
        if (sections.length === 0) {
            return sendErrorResponse(res, 404, 'No sections found for this branch');
        }

        const sectionIds = sections.map(section => section._id);

        // Find all subjects that are in the above sections
        const subjects = await Subject.find({ sectionId: { $in: sectionIds } }).populate('sectionId');

        sendSuccessResponse(res, 200, 'Subjects retrieved successfully', subjects);
    } catch (err) {
        console.error(err.message);
        sendErrorResponse(res, 500, 'Server error', err);
    }
};
// Get a subject by ID
exports.getSubjectById = async (req, res) => {
    const { id } = req.params;

    try {
        const subject = await Subject.findById(id).populate('sectionId');
        if (!subject) {
            return sendErrorResponse(res, 404, 'Subject not found');
        }
        sendSuccessResponse(res, 200, 'Subject retrieved successfully', subject);
    } catch (err) {
        console.error(err.message);
        sendErrorResponse(res, 500, 'Server error', err);
    }
};

// Update a subject by ID
exports.updateSubject = async (req, res) => {
    const { id } = req.params;
    const { sectionId, subjectName } = req.body;

    try {
        // Validate required fields
        const missingFields = validateRequiredFields({ sectionId, subjectName });
        if (missingFields.length > 0) {
            return sendErrorResponse(res, 400, `Missing fields: ${missingFields.join(', ')}`);
        }

        // Validate existence of section
        const section = await Section.findById(sectionId);
        if (!section) {
            return sendErrorResponse(res, 404, 'Section not found');
        }

        // Update the Subject entry
        const updatedSubject = await Subject.findByIdAndUpdate(
            id,
            { sectionId, subjectName },
            { new: true, runValidators: true }
        ).populate('sectionId');

        if (!updatedSubject) {
            return sendErrorResponse(res, 404, 'Subject not found');
        }

        sendSuccessResponse(res, 200, 'Subject updated successfully', updatedSubject);
    } catch (err) {
        console.error(err.message);
        sendErrorResponse(res, 500, 'Server error', err);
    }
};

// Delete a subject by ID
exports.deleteSubject = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedSubject = await Subject.findByIdAndDelete(id);
        if (!deletedSubject) {
            return sendErrorResponse(res, 404, 'Subject not found');
        }
        sendSuccessResponse(res, 200, 'Subject deleted successfully', deletedSubject);
    } catch (err) {
        console.error(err.message);
        sendErrorResponse(res, 500, 'Server error', err);
    }
};

// Fetch all Subjects by Section ID
exports.getAllSubjectsBySectionId = async (req, res) => {
    const { sectionId } = req.query;

    if (!sectionId) {
        return sendErrorResponse(res, 400, 'Section ID is required.');
    }

    try {
        const subjects = await Subject.find({ sectionId }).populate('sectionId');

        if (!subjects || subjects.length === 0) {
            return sendErrorResponse(res, 404, 'No subjects found for the provided Section ID.');
        }

        sendSuccessResponse(res, 200, 'Subjects retrieved successfully', { subjects });
    } catch (error) {
        console.error('Error fetching Subjects:', error);
        sendErrorResponse(res, 500, 'An error occurred while fetching subjects', error);
    }
};

exports.getAllSubjectsNew = async (req, res) => {
    const { branchId } = req.query;

    // Validate if branchId is provided
    if (!branchId) {
        return sendErrorResponse(res, 400, 'Branch ID is required');
    }

    try {
        // Find all sections that belong to the provided branchId
        const sections = await Section.find({ branchId }).populate('classId');

        // If no sections are found, return an error
        if (sections.length === 0) {
            return sendErrorResponse(res, 404, 'No sections found for this branch');
        }

        const sectionIds = sections.map(section => section._id);

        // Find all subjects related to the found sections
        const subjects = await Subject.find({ sectionId: { $in: sectionIds } })
                                      .populate({
                                          path: 'sectionId',
                                          populate: { path: 'classId' }  // Populate the class within section
                                      });

        // Structure the response with subjects, section, and class data, including their ids and other fields
        const data = subjects.map(subject => {
            return {
                subject: {
                    id: subject._id,
                    name: subject.subjectName,
                    createdAt: subject.createdAt,
                    updatedAt: subject.updatedAt
                },
                section: {
                    id: subject.sectionId._id,
                    name: subject.sectionId.sectionName,
                    roomNumber: subject.sectionId.roomNumber,
                    maxNoOfStudents: subject.sectionId.maxNoOfStudents,
                    startDate: subject.sectionId.startDate,
                    endDate: subject.sectionId.endDate
                },
                class: {
                    id: subject.sectionId.classId._id,
                    name: subject.sectionId.classId.className,
                    description: subject.sectionId.classId.description,
                    createdAt: subject.sectionId.classId.createdAt,
                    updatedAt: subject.sectionId.classId.updatedAt
                }
            };
        });

        // Send the success response with the structured data
        sendSuccessResponse(res, 200, 'Subjects retrieved successfully', data);
    } catch (err) {
        console.error(err.message);
        sendErrorResponse(res, 500, 'Server error', err);
    }
};

exports.getSubjectsBySection = async (req, res) => {
    const { sectionId } = req.params;
    try {
        const subjects = await Subject.find({ sectionId });
        sendSuccessResponse(res, 200, 'Subjects fetched successfully', subjects);
    } catch (error) {
        console.error(error);
        sendErrorResponse(res, 500, 'Server error', error);
    }
};
