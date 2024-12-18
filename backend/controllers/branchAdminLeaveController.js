// controllers/branchAdminLeaveController.js

const BranchAdminLeave = require('../models/BranchAdminLeave');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/response');
const path = require('path');

// Create a new leave request
exports.createLeave = async (req, res) => {
    const { branchAdminId, leaveStartDate, leaveEndDate, leaveReason, description } = req.body;

    try {
        const startDate = new Date(leaveStartDate);
        const endDate = new Date(leaveEndDate);
        const totalLeaveDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

        // Handle file upload if available
        const doc = req.file ? path.join('assets/docs', req.file.filename) : null;

        const leave = new BranchAdminLeave({
            branchAdminId,
            leaveStartDate,
            leaveEndDate,
            totalLeaveDays,
            leaveReason,
            description,
            doc
        });

        const savedLeave = await leave.save();
        sendSuccessResponse(res, 201, 'Leave request created successfully', savedLeave);
    } catch (error) {
        console.error(error);
        sendErrorResponse(res, 500, 'Server error', error);
    }
};

// Update a leave request
exports.updateLeave = async (req, res) => {
    const { id } = req.params;
    const { leaveStartDate, leaveEndDate, leaveReason, description, status } = req.body;

    try {
        const leave = await BranchAdminLeave.findById(id);
        if (!leave) return sendErrorResponse(res, 404, 'Leave not found');

        const totalLeaveDays = Math.ceil((new Date(leaveEndDate) - new Date(leaveStartDate)) / (1000 * 60 * 60 * 24)) + 1;

        leave.leaveStartDate = leaveStartDate || leave.leaveStartDate;
        leave.leaveEndDate = leaveEndDate || leave.leaveEndDate;
        leave.totalLeaveDays = totalLeaveDays;
        leave.leaveReason = leaveReason || leave.leaveReason;
        leave.description = description || leave.description;
        leave.status = status || leave.status;

        // Update the file if a new one is uploaded
        if (req.file) {
            leave.doc = path.join('assets/docs', req.file.filename);
        }

        const updatedLeave = await leave.save();
        sendSuccessResponse(res, 200, 'Leave updated successfully', updatedLeave);
    } catch (error) {
        console.error(error);
        sendErrorResponse(res, 500, 'Server error', error);
    }
};

// Get all leave requests
exports.getAllLeaves = async (req, res) => {
    try {
        const leaves = await BranchAdminLeave.find()
            .populate('branchAdminId', 'fullName email');

        if (!leaves.length) {
            return sendErrorResponse(res, 404, 'No leaves found');
        }

        sendSuccessResponse(res, 200, 'All leaves fetched successfully', leaves);
    } catch (error) {
        console.error(error);
        sendErrorResponse(res, 500, 'Server error', error);
    }
};

// Get a leave request by Leave ID
exports.getLeaveById = async (req, res) => {
    const { id } = req.params;

    try {
        const leave = await BranchAdminLeave.findById(id)
            .populate('branchAdminId', 'fullName email');

        if (!leave) return sendErrorResponse(res, 404, 'Leave not found');

        sendSuccessResponse(res, 200, 'Leave fetched successfully', leave);
    } catch (error) {
        console.error(error);
        sendErrorResponse(res, 500, 'Server error', error);
    }
};

// Get leave requests by Branch Admin ID
exports.getLeavesByBranchAdminId = async (req, res) => {
    const { branchAdminId } = req.params;

    try {
        const leaves = await BranchAdminLeave.find({ branchAdminId })
            .populate('branchAdminId', 'fullName email');

        if (!leaves.length) return sendErrorResponse(res, 404, 'No leaves found for the given branch admin.');

        sendSuccessResponse(res, 200, 'Leaves fetched successfully', leaves);
    } catch (error) {
        console.error(error);
        sendErrorResponse(res, 500, 'Server error', error);
    }
};

// Delete a leave request
exports.deleteLeave = async (req, res) => {
    const { id } = req.params;

    try {
        const leave = await BranchAdminLeave.findById(id);
        if (!leave) return sendErrorResponse(res, 404, 'Leave not found');

        await leave.deleteOne();
        sendSuccessResponse(res, 200, 'Leave deleted successfully');
    } catch (error) {
        console.error(error);
        sendErrorResponse(res, 500, 'Server error', error);
    }
};

// Update branch admin leave status
exports.updateBranchAdminLeaveStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const leave = await BranchAdminLeave.findById(id);
        if (!leave) {
            return sendErrorResponse(res, 404, 'Leave not found');
        }

        leave.status = status;
        await leave.save();

        sendSuccessResponse(res, 200, `Leave ${status} successfully`);
    } catch (error) {
        console.error(error);
        sendErrorResponse(res, 500, 'Error updating leave status', error);
    }
};
