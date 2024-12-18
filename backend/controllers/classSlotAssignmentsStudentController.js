// controllers/classSlotAssignmentsStudentController.js

const mongoose = require('mongoose');
const ClassSlotAssignments = require('../models/ClassSlotAssignments');
const BranchDailyTimeSlots = require('../models/BranchDailyTimeSlots');
const BranchClassDays = require('../models/BranchClassDays');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/response');

/**
 * Get all Slots for Student for a specific day
 */
exports.getAllSlotsForDayStudent = async (req, res) => {
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
        console.error('Error fetching Slots for Student:', error);
        sendErrorResponse(res, 500, 'Server Error', error);
    }
};
