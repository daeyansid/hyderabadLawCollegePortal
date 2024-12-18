const mongoose = require('mongoose');
const Section = require('../models/Section');
const Branch = require('../models/Branch');
const Class = require('../models/Class');
const { sendErrorResponse, sendSuccessResponse } = require('../utils/response');
const { validateRequiredFields } = require('../utils/validateRequiredFields');

// Create a new section
exports.createSection = async (req, res) => {
    const { sectionName, maxNoOfStudents, roomNumber, startDate, endDate, branchId, classId } = req.body;

    try {
        // Validate required fields
        const missingFields = validateRequiredFields({ sectionName, maxNoOfStudents, roomNumber, startDate, endDate, branchId, classId });
        if (missingFields.length > 0) {
            return sendErrorResponse(res, 400, `Missing fields: ${missingFields.join(', ')}`);
        }

        // Validate existence of branch and class
        const branch = await Branch.findById(branchId);
        const classData = await Class.findById(classId);
        if (!branch) {
            return sendErrorResponse(res, 404, 'Branch not found');
        }
        if (!classData) {
            return sendErrorResponse(res, 404, 'Class not found');
        }

        // Create a new Section entry
        const section = new Section({ sectionName, maxNoOfStudents, roomNumber, startDate, endDate, branchId, classId });
        const savedSection = await section.save();

        sendSuccessResponse(res, 201, 'Section created successfully', savedSection);
    } catch (err) {
        console.error(err.message);
        sendErrorResponse(res, 500, 'Server error', err);
    }
};

// Get a section by ID
exports.getSectionById = async (req, res) => {
    const { id } = req.params;

    try {
        const section = await Section.findById(id)
            .populate('branchId')
            .populate('classId');
        if (!section) {
            return sendErrorResponse(res, 404, 'Section not found');
        }
        sendSuccessResponse(res, 200, 'Section retrieved successfully', section);
    } catch (err) {
        console.error(err.message);
        sendErrorResponse(res, 500, 'Server error', err);
    }
};

// Update a section by ID
exports.updateSection = async (req, res) => {
    const { id } = req.params;
    const { sectionName, maxNoOfStudents, roomNumber, startDate, endDate, branchId, classId } = req.body;

    try {
        // Validate required fields
        const missingFields = validateRequiredFields({ sectionName, maxNoOfStudents, roomNumber, startDate, endDate, branchId, classId });
        if (missingFields.length > 0) {
            return sendErrorResponse(res, 400, `Missing fields: ${missingFields.join(', ')}`);
        }

        // Validate existence of branch and class
        const branch = await Branch.findById(branchId);
        const classData = await Class.findById(classId);
        if (!branch) {
            return sendErrorResponse(res, 404, 'Branch not found');
        }
        if (!classData) {
            return sendErrorResponse(res, 404, 'Class not found');
        }

        // Update the Section entry
        const updatedSection = await Section.findByIdAndUpdate(
            id,
            { sectionName, maxNoOfStudents, roomNumber, startDate, endDate, branchId, classId },
            { new: true, runValidators: true }
        ).populate('branchId')
         .populate('classId');

        if (!updatedSection) {
            return sendErrorResponse(res, 404, 'Section not found');
        }

        sendSuccessResponse(res, 200, 'Section updated successfully', updatedSection);
    } catch (err) {
        console.error(err.message);
        sendErrorResponse(res, 500, 'Server error', err);
    }
};

// Delete a section by ID
exports.deleteSection = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedSection = await Section.findByIdAndDelete(id);
        if (!deletedSection) {
            return sendErrorResponse(res, 404, 'Section not found');
        }
        sendSuccessResponse(res, 200, 'Section deleted successfully', deletedSection);
    } catch (err) {
        console.error(err.message);
        sendErrorResponse(res, 500, 'Server error', err);
    }
};

// Get all sections
exports.getAllSections = async (req, res) => {
    try {
        const { branchId } = req.query;

        if (!branchId) {
            return sendErrorResponse(res, 400, 'Branch ID is required');
        }

        const sections = await Section.find({ branchId }) // Filter sections by branchId
            .populate('branchId')
            .populate('classId');

        if (!sections.length) {
            return sendErrorResponse(res, 404, 'No sections found for this branch');
        }

        sendSuccessResponse(res, 200, 'Sections retrieved successfully', sections);
    } catch (err) {
        console.error(err.message);
        sendErrorResponse(res, 500, 'Server error', err);
    }
};

// get section by classId and branchId
exports.getSectionsByClassAndBranchId = async (req, res) => {
    const { classId, branchId } = req.query;

    if (!classId || !branchId) {
        return sendErrorResponse(res, 400, 'Class ID and Branch ID are required');
    }

    try {
        const sections = await Section.find({ classId, branchId });
        if (!sections || sections.length === 0) {
            return sendErrorResponse(res, 404, 'No sections found for the given Class ID and Branch ID');
        }
        sendSuccessResponse(res, 200, 'Sections retrieved successfully', sections);
    } catch (err) {
        console.error(err.message);
        sendErrorResponse(res, 500, 'Server error', err);
    }
};

// use for slot allotment (by section and branchId)
exports.getSectionsBySectionAndBranchId = async (req, res) => {
    const { sectionId, branchId } = req.query;

    if (!sectionId || !branchId) {
        return sendErrorResponse(res, 400, 'Section and Branch are required');
    }

    try {
        // Validate if sectionId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(sectionId)) {
            return sendErrorResponse(res, 400, 'Invalid Section format');
        }

        // Find sections matching the sectionId and branchId
        const sections = await Section.find({ _id: sectionId, branchId })
            .populate('classId', 'className');

        if (!sections || sections.length === 0) {
            return sendErrorResponse(res, 404, 'No sections found for the given Section and Branch');
        }

        sendSuccessResponse(res, 200, 'Sections retrieved successfully', sections);
    } catch (err) {
        console.error(err.message);
        sendErrorResponse(res, 500, 'Server error', err);
    }
};

exports.getSectionsByClass = async (req, res) => {
    const { classId } = req.params;
    try {
        const sections = await Section.find({ classId });
        sendSuccessResponse(res, 200, 'Sections fetched successfully', sections);
    } catch (error) {
        console.error(error);
        sendErrorResponse(res, 500, 'Server error', error);
    }
};