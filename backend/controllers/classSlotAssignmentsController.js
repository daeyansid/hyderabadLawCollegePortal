// controllers/classSlotAssignmentsController.js

const mongoose = require('mongoose');
const ClassSlotAssignments = require('../models/ClassSlotAssignments');
const BranchDailyTimeSlots = require('../models/BranchDailyTimeSlots');
const BranchClassDays = require('../models/BranchClassDays');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/response');

/**
 * Create a new ClassSlotAssignment
 */
exports.createClassSlotAssignment = async (req, res) => {
    const {
        branchClassDaysId,
        branchDailyTimeSlotsId,
        classId,
        sectionId,
        subjectId,
        teacherId,
        classType,
        slotType,
    } = req.body;

    try {
        // Optional: Add any business logic validations here (e.g., prevent overlapping assignments)

        const newAssignment = new ClassSlotAssignments({
            branchClassDaysId,
            branchDailyTimeSlotsId,
            classId,
            sectionId,
            subjectId,
            teacherId,
            classType,
            slotType,
        });

        const savedAssignment = await newAssignment.save();

        sendSuccessResponse(
            res,
            201,
            'Class Slot Assignment created successfully.',
            savedAssignment
        );
    } catch (error) {
        // Handle duplicate entry or validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((val) => val.message);
            return sendErrorResponse(res, 400, 'Validation Error', messages);
        }

        console.error('Error creating Class Slot Assignment:', error);
        sendErrorResponse(res, 500, 'Server Error', error);
    }
};

/**
 * Get all ClassSlotAssignments
 */
exports.getAllClassSlotAssignments = async (req, res) => {
    const { branchClassDaysId } = req.query;

    try {
        let query = {};
        if (branchClassDaysId) {
            query.branchClassDaysId = branchClassDaysId;
        }

        const assignments = await ClassSlotAssignments.find(query)
            .populate('branchClassDaysId')
            .populate('branchDailyTimeSlotsId')
            .populate('classId')
            .populate('sectionId')
            .populate('subjectId')
            .populate('teacherId')
            .sort({ createdAt: -1 });

        if (!assignments.length) {
            return sendErrorResponse(res, 404, 'No Class Slot Assignments found.');
        }

        sendSuccessResponse(
            res,
            200,
            'Class Slot Assignments fetched successfully.',
            assignments
        );
    } catch (error) {
        console.error('Error fetching Class Slot Assignments:', error);
        sendErrorResponse(res, 500, 'Server Error', error);
    }
};

/**
 * Get a single ClassSlotAssignment by ID
 */
exports.getClassSlotAssignmentById = async (req, res) => {
    const { id } = req.params;

    try {
        const assignment = await ClassSlotAssignments.findById(id)
            .populate('branchClassDaysId')
            .populate('branchDailyTimeSlotsId')
            .populate('classId')
            .populate('sectionId')
            .populate('subjectId')
            .populate('teacherId');

        if (!assignment) {
            return sendErrorResponse(res, 404, 'Class Slot Assignment not found.');
        }

        sendSuccessResponse(
            res,
            200,
            'Class Slot Assignment fetched successfully.',
            assignment
        );
    } catch (error) {
        console.error('Error fetching Class Slot Assignment:', error);
        sendErrorResponse(res, 500, 'Server Error', error);
    }
};

/**
 * Update a ClassSlotAssignment by ID
 */
exports.updateClassSlotAssignment = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
        const updatedAssignment = await ClassSlotAssignments.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        )
            .populate('branchClassDaysId')
            .populate('branchDailyTimeSlotsId')
            .populate('classId')
            .populate('sectionId')
            .populate('subjectId')
            .populate('teacherId');

        if (!updatedAssignment) {
            return sendErrorResponse(res, 404, 'Class Slot Assignment not found.');
        }

        sendSuccessResponse(
            res,
            200,
            'Class Slot Assignment updated successfully.',
            updatedAssignment
        );
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((val) => val.message);
            return sendErrorResponse(res, 400, 'Validation Error', messages);
        }

        console.error('Error updating Class Slot Assignment:', error);
        sendErrorResponse(res, 500, 'Server Error', error);
    }
};

/**
 * Delete a ClassSlotAssignment by ID
 */
exports.deleteClassSlotAssignment = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedAssignment = await ClassSlotAssignments.findByIdAndDelete(id);

        if (!deletedAssignment) {
            return sendErrorResponse(res, 404, 'Class Slot Assignment not found.');
        }

        sendSuccessResponse(res, 200, 'Class Slot Assignment deleted successfully.');
    } catch (error) {
        console.error('Error deleting Class Slot Assignment:', error);
        sendErrorResponse(res, 500, 'Server Error', error);
    }
};


exports.getAllSlotsForDay = async (req, res) => {
    const { branchClassDaysId, sectionId, branchId } = req.query;

    // Validate inputs
    if (!branchClassDaysId || !sectionId || !branchId) {
        return sendErrorResponse(res, 400, 'Branch Class Days ID, Section ID, and Branch ID are required.');
    }

    if (!mongoose.Types.ObjectId.isValid(branchClassDaysId)) {
        return sendErrorResponse(res, 400, 'Invalid Branch Class Days ID format.');
    }

    if (!mongoose.Types.ObjectId.isValid(sectionId)) {
        return sendErrorResponse(res, 400, 'Invalid Section ID format.');
    }

    if (!mongoose.Types.ObjectId.isValid(branchId)) {
        return sendErrorResponse(res, 400, 'Invalid Branch ID format.');
    }

    try {
        // Verify that the branchClassDaysId belongs to the branchId
        const branchClassDay = await BranchClassDays.findById(branchClassDaysId);

        if (!branchClassDay) {
            return sendErrorResponse(res, 404, 'Branch Class Day not found.');
        }

        if (branchClassDay.branchId.toString() !== branchId) {
            return sendErrorResponse(res, 400, 'Branch Class Day does not belong to the specified Branch.');
        }

        // Fetch Class Slot Assignments filtered by branchClassDaysId and sectionId
        const assignments = await ClassSlotAssignments.find({
            branchClassDaysId: branchClassDaysId,
            sectionId: sectionId,
        })
            .populate({
                path: 'branchDailyTimeSlotsId',
                select: 'slot slotType',
            })
            .populate('classId')
            .populate('sectionId')
            .populate('subjectId')
            .populate('teacherId');

        // Fetch Break Slots for the given branchClassDaysId and branchId
        const breakSlots = await BranchDailyTimeSlots.find({
            branchClassDaysId: branchClassDaysId,
            branchId: branchId,
            slotType: 'Break Slot',
        });

        // Format Assignments
        const formattedAssignments = assignments.map(assignment => ({
            _id: assignment._id,
            branchClassDaysId: assignment.branchClassDaysId,
            branchDailyTimeSlotsId: assignment.branchDailyTimeSlotsId?._id,
            slotType: assignment.slotType, // 'Class Slot'
            slot: assignment.branchDailyTimeSlotsId?.slot,
            classId: assignment.classId,
            sectionId: assignment.sectionId,
            subjectId: assignment.subjectId,
            teacherId: assignment.teacherId,
            classType: assignment.classType,
        }));

        // Format Break Slots
        const formattedBreakSlots = breakSlots.map(slot => ({
            _id: slot._id,
            branchClassDaysId: slot.branchClassDaysId,
            branchDailyTimeSlotsId: slot._id,
            slotType: slot.slotType, // 'Break Slot'
            slot: slot.slot,
            classId: null,
            sectionId: null,
            subjectId: null,
            teacherId: null,
            classType: null,
        }));

        // Combine and sort
        const combinedSlots = [...formattedAssignments, ...formattedBreakSlots];

        // Sort by slot time (assuming 'slot' is in 'HH:MM AM/PM - HH:MM AM/PM' format)
        combinedSlots.sort((a, b) => {
            const parseTime = (timeStr) => {
                if (!timeStr) return 0;
                const [startTime] = timeStr.split(' - ');
                const date = new Date(`1970-01-01T${startTime}`);
                return date.getTime();
            };
            return parseTime(a.slot) - parseTime(b.slot);
        });

        // Return combined slots
        sendSuccessResponse(res, 200, 'Slots fetched successfully.', combinedSlots);
    } catch (error) {
        console.error('Error fetching Slots:', error);
        sendErrorResponse(res, 500, 'Server Error', error);
    }
};

// get by teacherId
exports.getTeacherAssignments = async (req, res) => {
    try {
        const teacherId = req.query.teacherId;

        if (!teacherId) {
            return sendErrorResponse(res, 400, 'Teacher ID is required.');
        }

        // Fetch all assignment slots for the teacher
        const assignments = await ClassSlotAssignments.find({ teacherId })
            .populate('branchClassDaysId', 'dayName')
            .populate('branchDailyTimeSlotsId', 'startTime endTime')
            .populate('classId', 'className')
            .populate('sectionId', 'sectionName')
            .populate('subjectId', 'subjectName')
            .populate('teacherId', 'fullName');

        if (!assignments.length) {
            return sendSuccessResponse(res, 200, 'No assignments found for this teacher.', []);
        }

        sendSuccessResponse(res, 200, 'Assignments fetched successfully.', assignments);
    } catch (error) {
        console.error('Error fetching teacher assignments:', error);
        sendErrorResponse(res, 500, 'Server Error', error);
    }
};