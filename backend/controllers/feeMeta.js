const FeeMeta = require('../models/FeeMeta');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/response');

// Create new fee structure
exports.createFee = async (req, res) => {
    try {
        // Check if there's already one row in the collection
        const feeCount = await FeeMeta.countDocuments();
        if (feeCount >= 1) {
            return sendErrorResponse(res, 400, 'Fee structure already exists. Adding more is not allowed.');
        }

        // Extract data from request body
        const { semesterFee, admissionFee } = req.body;

        // Create and save the new fee structure
        const newFee = new FeeMeta({
            semesterFee,
            admissionFee,
        });

        const savedFee = await newFee.save();
        if (savedFee) sendSuccessResponse(res, 201, 'Fee structure created successfully');
    } catch (err) {
        console.error(err.message);
        sendErrorResponse(res, 500, 'Server error', err);
    }
};


// Get all fee structures
exports.getAllFees = async (req, res) => {
    try {
        const fees = await FeeMeta.find().sort({ createdAt: -1 });
        sendSuccessResponse(res, 200, 'Fee structures retrieved successfully', fees);
    } catch (err) {
        console.error(err.message);
        sendErrorResponse(res, 500, 'Server error', err);
    }
};

// Get fee structure by ID
exports.getFeeById = async (req, res) => {
    try {
        const fee = await FeeMeta.findById(req.params.id);
        if (!fee) {
            return sendErrorResponse(res, 404, 'Fee structure not found');
        }
        sendSuccessResponse(res, 200, 'Fee structure retrieved successfully', fee);
    } catch (err) {
        console.error(err.message);
        sendErrorResponse(res, 500, 'Server error', err);
    }
};

// Update fee structure
exports.updateFee = async (req, res) => {
    try {
        const { semesterFee, admissionFee } = req.body;
        
        const fee = await FeeMeta.findById(req.params.id);
        if (!fee) {
            return sendErrorResponse(res, 404, 'Fee structure not found');
        }

        fee.semesterFee = semesterFee || fee.semesterFee;
        fee.admissionFee = admissionFee || fee.admissionFee;
        fee.updatedAt = Date.now();

        const updatedFee = await fee.save();
        sendSuccessResponse(res, 200, 'Fee structure updated successfully', updatedFee);
    } catch (err) {
        console.error(err.message);
        sendErrorResponse(res, 500, 'Server error', err);
    }
};

// Delete fee structure
exports.deleteFee = async (req, res) => {
    try {
        const fee = await FeeMeta.findById(req.params.id);
        if (!fee) {
            return sendErrorResponse(res, 404, 'Fee structure not found');
        }

        await FeeMeta.findByIdAndDelete(req.params.id); // Correct usage
        sendSuccessResponse(res, 200, 'Fee structure deleted successfully');
    } catch (err) {
        console.error(err.message);
        sendErrorResponse(res, 500, 'Server error', err);
    }
};
