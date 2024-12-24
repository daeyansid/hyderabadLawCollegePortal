const FeeDetails = require('../models/FeeDetails');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/response');

// Create new fee details
exports.createFeeDetails = async (req, res) => {
    try {
        const newFeeDetails = new FeeDetails({
            ...req.body,
            challanPicture: req.file ? req.file.path : null
        });

        const savedFeeDetails = await newFeeDetails.save();
        sendSuccessResponse(res, 201, 'Fee details created successfully', savedFeeDetails);
    } catch (err) {
        console.error(err.message);
        sendErrorResponse(res, 500, 'Server error', err);
    }
};

// Get all fee details
exports.getAllFeeDetails = async (req, res) => {
    try {
        const feeDetails = await FeeDetails.find()
            .populate('totalAdmissionFee')
            .populate('semesterFeesTotal')
            .populate('studentId')
            .sort({ createdAt: -1 });
        sendSuccessResponse(res, 200, 'Fee details retrieved successfully', feeDetails);
    } catch (err) {
        console.error(err.message);
        sendErrorResponse(res, 500, 'Server error', err);
    }
};

// Get fee details by student ID
exports.getFeeDetailsByStudentId = async (req, res) => {
    try {
        const feeDetails = await FeeDetails.find({ studentId: req.params.studentId })
            .populate('totalAdmissionFee')
            .populate('semesterFeesTotal')
            .populate('studentId');
        
        if (!feeDetails.length) {
            return sendErrorResponse(res, 404, 'Fee details not found for this student');
        }
        sendSuccessResponse(res, 200, 'Fee details retrieved successfully', feeDetails);
    } catch (err) {
        console.error(err.message);
        sendErrorResponse(res, 500, 'Server error', err);
    }
};

// Update fee details
exports.updateFeeDetails = async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (req.file) {
            updateData.challanPicture = req.file.path;
        }
        updateData.updatedAt = Date.now();

        const feeDetails = await FeeDetails.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        ).populate('totalAdmissionFee')
         .populate('semesterFeesTotal')
         .populate('studentId');

        if (!feeDetails) {
            return sendErrorResponse(res, 404, 'Fee details not found');
        }
        sendSuccessResponse(res, 200, 'Fee details updated successfully', feeDetails);
    } catch (err) {
        console.error(err.message);
        sendErrorResponse(res, 500, 'Server error', err);
    }
};

// Delete fee details
exports.deleteFeeDetails = async (req, res) => {
    try {
        const feeDetails = await FeeDetails.findById(req.params.id);
        if (!feeDetails) {
            return sendErrorResponse(res, 404, 'Fee details not found');
        }

        await FeeDetails.findByIdAndDelete(req.params.id);
        sendSuccessResponse(res, 200, 'Fee details deleted successfully');
    } catch (err) {
        console.error(err.message);
        sendErrorResponse(res, 500, 'Server error', err);
    }
};
