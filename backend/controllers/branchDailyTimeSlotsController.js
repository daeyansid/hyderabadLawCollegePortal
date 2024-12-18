// backend/controllers/branchDailyTimeSlotsController.js
const mongoose = require('mongoose');
const BranchDailyTimeSlots = require('../models/BranchDailyTimeSlots');
const Branch = require('../models/Branch');
const BranchClassDays = require('../models/BranchClassDays');
const BranchSetting = require('../models/BranchSettings');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/response');

// POST Create a new Branch Daily Time Slot
exports.createBranchDailyTimeSlot = async (req, res) => {
    const { slot, slotType, branchClassDaysId, branchId } = req.body;

    try {
        // Initialize an array to track missing fields
        let missingFields = [];

        // Validate each required field
        if (!branchId) missingFields.push('branchId');
        if (!branchClassDaysId) missingFields.push('branchClassDaysId');
        if (!slot) missingFields.push('slot');
        if (!slotType) missingFields.push('slotType');

        // If there are missing fields, return an error response
        if (missingFields.length > 0) {
            return sendErrorResponse(res, 400, `Missing required fields: ${missingFields.join(', ')}`);
        }

        // Check if the slot already exists for the given day
        const existingSlot = await BranchDailyTimeSlots.findOne({
            branchClassDaysId,
            slot,
        });

        if (existingSlot) {
            return sendErrorResponse(res, 400, 'This slot is already assigned for the selected day.');
        }

        // Create the new BranchDailyTimeSlot
        const newTimeSlot = new BranchDailyTimeSlots({
            branchId,
            branchClassDaysId,
            slot, // e.g., "8:15 AM to 9:15 AM"
            slotType,
        });

        const savedTimeSlot = await newTimeSlot.save();

        return sendSuccessResponse(res, 201, 'Branch Daily Time Slot created successfully.', savedTimeSlot);
    } catch (error) {
        console.error('Error creating Branch Daily Time Slot:', error);
        return sendErrorResponse(res, 500, 'Server error.', error);
    }
};

// GET time slots by BranchClassDaysId
exports.getBranchDailyTimeSlotsByDay = async (req, res) => {
    const { branchClassDaysId } = req.params;
    try {
        const timeSlots = await BranchDailyTimeSlots.find({ branchClassDaysId })
            .populate('branchId', 'branchName branchAddress')
            .populate('branchClassDaysId', 'day');

        return sendSuccessResponse(res, 200, 'Branch Daily Time Slots retrieved successfully.', timeSlots);
    } catch (error) {
        console.error('Error fetching branch daily time slots by day:', error);
        return sendErrorResponse(res, 500, 'Server error.', error);
    }
};

// GET all Branch Daily Time Slots
exports.getAllBranchDailyTimeSlots = async (req, res) => {
    try {
        const timeSlots = await BranchDailyTimeSlots.find()
            .populate('branchId', 'branchName branchAddress') // Populate Branch details
            .populate('branchClassDaysId', 'day'); // Populate BranchClassDays details

        return sendSuccessResponse(res, 200, 'Branch Daily Time Slots retrieved successfully.', timeSlots);
    } catch (error) {
        console.error('Error fetching Branch Daily Time Slots:', error);
        return sendErrorResponse(res, 500, 'Server error.', error);
    }
};

// GET Branch Daily Time Slots by BranchClassDaysId
exports.getBranchDailyTimeSlots = async (req, res) => {
    const { branchClassDaysId } = req.params;

    try {
        // Fetch the Branch Class Day to get the day name
        const branchClassDay = await BranchClassDays.findById(branchClassDaysId);
        if (!branchClassDay) {
            return sendErrorResponse(res, 404, 'Branch Class Day not found.');
        }

        // Fetch the time slots
        const timeSlots = await BranchDailyTimeSlots.find({ branchClassDaysId })
            .populate('branchId', 'branchName branchAddress')
            .populate('branchClassDaysId', 'day');

        // Structure the response to include dayName and timeSlots
        return sendSuccessResponse(res, 200, 'Branch Daily Time Slots retrieved successfully.', {
            dayName: branchClassDay.day,
            timeSlots,
        });
    } catch (error) {
        console.error('Error fetching Branch Daily Time Slots:', error);
        return sendErrorResponse(res, 500, 'Server error.', error);
    }
};

// GET Branch Daily Time Slot by ID
exports.getBranchDailyTimeSlotById = async (req, res) => {
    const { id } = req.params;

    try {
        const timeSlot = await BranchDailyTimeSlots.findById(id)
            .populate('branchId', 'branchName branchAddress')
            .populate('branchClassDaysId', 'day');

        if (!timeSlot) {
            return sendErrorResponse(res, 404, 'Branch Daily Time Slot not found.');
        }

        return sendSuccessResponse(res, 200, 'Branch Daily Time Slot retrieved successfully.', timeSlot);
    } catch (error) {
        console.error('Error fetching Branch Daily Time Slot:', error);
        return sendErrorResponse(res, 500, 'Server error.', error);
    }
};

// PUT Update Branch Daily Time Slot
exports.updateBranchDailyTimeSlot = async (req, res) => {
    const { id } = req.params;
    const { branchId, branchClassDaysId, slot, slotType } = req.body;

    try {
        const timeSlot = await BranchDailyTimeSlots.findById(id);

        if (!timeSlot) {
            return sendErrorResponse(res, 404, 'Branch Daily Time Slot not found.');
        }

        // If branchId or branchClassDaysId is being updated, validate them
        if (branchId) {
            const branch = await Branch.findById(branchId);
            if (!branch) {
                return sendErrorResponse(res, 404, 'Branch not found.');
            }
            timeSlot.branchId = branchId;
        }

        if (branchClassDaysId) {
            const branchClassDay = await BranchClassDays.findById(branchClassDaysId);
            if (!branchClassDay) {
                return sendErrorResponse(res, 404, 'Branch Class Days not found.');
            }

            // Ensure that the BranchClassDays belongs to the same Branch
            const branchIdToCheck = branchId || timeSlot.branchId;
            if (branchClassDay.branchId.toString() !== branchIdToCheck.toString()) {
                return sendErrorResponse(res, 400, 'Branch Class Days does not belong to the specified Branch.');
            }

            timeSlot.branchClassDaysId = branchClassDaysId;
        }

        if (slot) {
            timeSlot.slot = slot;
        }

        if (slotType) {
            timeSlot.slotType = slotType;
        }

        const updatedTimeSlot = await timeSlot.save();

        return sendSuccessResponse(res, 200, 'Branch Daily Time Slot updated successfully.', updatedTimeSlot);
    } catch (error) {
        console.error('Error updating Branch Daily Time Slot:', error);
        return sendErrorResponse(res, 500, 'Server error.', error);
    }
};

// DELETE Branch Daily Time Slot
exports.deleteBranchDailyTimeSlot = async (req, res) => {
    const { id } = req.params;

    try {
        const timeSlot = await BranchDailyTimeSlots.findById(id);

        if (!timeSlot) {
            return sendErrorResponse(res, 404, 'Branch Daily Time Slot not found.');
        }

        await BranchDailyTimeSlots.findByIdAndDelete(req.params.id);

        return sendSuccessResponse(res, 200, 'Branch Daily Time Slot deleted successfully.');
    } catch (error) {
        console.error('Error deleting Branch Daily Time Slot:', error);
        return sendErrorResponse(res, 500, 'Server error.', error);
    }
};

exports.getBranchDailyTimeSlotsByBranchClassDaysId = async (req, res) => {
    const { branchClassDaysId } = req.params;
    const { branchId } = req.query;

    if (!branchClassDaysId || !branchId) {
        return sendErrorResponse(res, 400, 'Branch Class Days ID and Branch ID are required.');
    }

    try {
        if (!mongoose.Types.ObjectId.isValid(branchClassDaysId)) {
            return sendErrorResponse(res, 400, 'Invalid Branch Class Days ID format.');
        }

        if (!mongoose.Types.ObjectId.isValid(branchId)) {
            return sendErrorResponse(res, 400, 'Invalid Branch ID format.');
        }

        const timeSlots = await BranchDailyTimeSlots.find({
            branchClassDaysId,
            branchId,
        })
            .populate('branchId', 'branchName')
            .populate('branchClassDaysId', 'day');

        if (!timeSlots || timeSlots.length === 0) {
            return sendErrorResponse(res, 404, 'No time slots found for the provided Branch Class Days ID and Branch ID.');
        }

        const day = timeSlots[0]?.branchClassDaysId?.day;

        sendSuccessResponse(res, 200, 'Branch Daily Time Slots retrieved successfully.', {
            day,
            timeSlots,
        });
    } catch (error) {
        console.error('Error fetching Branch Daily Time Slots:', error);
        sendErrorResponse(res, 500, 'An error occurred while fetching Branch Daily Time Slots.', error);
    }
};

exports.getBranchDailyTimeSlotsByBranchClassDaysIdForSettings = async (req, res) => {
    const { branchClassDaysId } = req.params;

    if (!branchClassDaysId) {
        return sendErrorResponse(res, 400, 'Branch Class Days ID is required.');
    }

    try {
        // Find time slots for the given branchClassDaysId
        const timeSlots = await BranchDailyTimeSlots.find({ branchClassDaysId })
            .populate('branchId', 'branchName')
            .populate('branchClassDaysId', 'day');

        if (!timeSlots || timeSlots.length === 0) {
            return sendErrorResponse(res, 404, 'No time slots found for the provided Branch Class Days ID.');
        }

        // Extract the day from the first time slot (since all slots belong to the same day)
        const day = timeSlots[0]?.branchClassDaysId?.day;

        // Structure the response with 'day' as a separate index and 'timeSlots' as an array
        sendSuccessResponse(res, 200, 'Branch Daily Time Slots retrieved successfully.', {
            day,
            timeSlots,
        });
    } catch (error) {
        console.error('Error fetching Branch Daily Time Slots:', error);
        sendErrorResponse(res, 500, 'An error occurred while fetching Branch Daily Time Slots.', error);
    }
};