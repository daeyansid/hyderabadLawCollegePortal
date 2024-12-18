// controllers/staffLeaveController.js

const StaffLeave = require('../models/StaffLeave');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/response');
const path = require('path');

// Create a new staff leave request
exports.createStaffLeave = async (req, res) => {
    const { staffId, branchId, leaveStartDate, leaveEndDate, leaveReason, description } = req.body;

    try {
        const startDate = new Date(leaveStartDate);
        const endDate = new Date(leaveEndDate);
        const totalLeaveDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

        // Handle file upload if available
        const doc = req.file ? path.join('assets/docs', req.file.filename) : null;

        const staffLeave = new StaffLeave({
            staffId,
            branchId,
            leaveStartDate,
            leaveEndDate,
            totalLeaveDays,
            leaveReason,
            description,
            doc,
        });

        const savedStaffLeave = await staffLeave.save();
        sendSuccessResponse(res, 201, 'Staff leave request created successfully', savedStaffLeave);
    } catch (error) {
        console.error(error);
        sendErrorResponse(res, 500, 'Server error', error);
    }
};

// Update a staff leave request
exports.updateStaffLeave = async (req, res) => {
    const { id } = req.params;
    const { leaveStartDate, leaveEndDate, leaveReason, description, status } = req.body;

    try {
        const staffLeave = await StaffLeave.findById(id);
        if (!staffLeave) return sendErrorResponse(res, 404, 'Leave request not found');

        const totalLeaveDays = Math.ceil((new Date(leaveEndDate) - new Date(leaveStartDate)) / (1000 * 60 * 60 * 24)) + 1;

        staffLeave.leaveStartDate = leaveStartDate || staffLeave.leaveStartDate;
        staffLeave.leaveEndDate = leaveEndDate || staffLeave.leaveEndDate;
        staffLeave.totalLeaveDays = totalLeaveDays;
        staffLeave.leaveReason = leaveReason || staffLeave.leaveReason;
        staffLeave.description = description || staffLeave.description;
        staffLeave.status = status || staffLeave.status;

        // Update the document if a new one is uploaded
        if (req.file) {
            staffLeave.doc = path.join('assets/docs', req.file.filename);
        }

        const updatedStaffLeave = await staffLeave.save();
        sendSuccessResponse(res, 200, 'Staff leave updated successfully', updatedStaffLeave);
    } catch (error) {
        console.error(error);
        sendErrorResponse(res, 500, 'Server error', error);
    }
};

// Get all staff leave requests
exports.getAllStaffLeaves = async (req, res) => {
    try {
        const staffLeaves = await StaffLeave.find()
            .populate('staffId', 'fullName staffId')
            .populate('branchId', 'branchName branchAddress');

        if (!staffLeaves.length) {
            return sendErrorResponse(res, 404, 'No staff leave requests found');
        }

        sendSuccessResponse(res, 200, 'All staff leave requests fetched successfully', staffLeaves);
    } catch (error) {
        console.error(error);
        sendErrorResponse(res, 500, 'Server error', error);
    }
};

// Get a staff leave request by Leave ID
exports.getStaffLeaveById = async (req, res) => {
    const { id } = req.params;

    try {
        const staffLeave = await StaffLeave.findById(id)
            .populate('staffId', 'fullName staffId')
            .populate('branchId', 'branchName branchAddress');

        if (!staffLeave) return sendErrorResponse(res, 404, 'Staff leave request not found');

        sendSuccessResponse(res, 200, 'Staff leave request fetched successfully', staffLeave);
    } catch (error) {
        console.error(error);
        sendErrorResponse(res, 500, 'Server error', error);
    }
};

// Get staff leave requests by Staff ID
exports.getStaffLeavesByStaffId = async (req, res) => {
    const { staffId } = req.params;

    try {
        const staffLeaves = await StaffLeave.find({ staffId })
            .populate('staffId', 'fullName staffId')
            .populate('branchId', 'branchName branchAddress');

        if (!staffLeaves.length) return sendErrorResponse(res, 404, 'No leave requests found for the given staff.');

        sendSuccessResponse(res, 200, 'Staff leave requests fetched successfully', staffLeaves);
    } catch (error) {
        console.error(error);
        sendErrorResponse(res, 500, 'Server error', error);
    }
};

// Delete a staff leave request
exports.deleteStaffLeave = async (req, res) => {
    const { id } = req.params;

    try {
        const staffLeave = await StaffLeave.findById(id);
        if (!staffLeave) return sendErrorResponse(res, 404, 'Staff leave request not found');

        await staffLeave.deleteOne();
        sendSuccessResponse(res, 200, 'Staff leave request deleted successfully');
    } catch (error) {
        console.error(error);
        sendErrorResponse(res, 500, 'Server error', error);
    }
};

// Delete a staff leave by ID
exports.deleteStaffLeave = async (req, res) => {
    try {
        const { id } = req.params;
        await StaffLeave.findByIdAndDelete(id);
        res.status(200).json({ message: 'Staff leave deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting staff leave', error });
    }
};
