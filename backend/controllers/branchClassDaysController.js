// controllers/branchClassDaysController.js

const BranchClassDays = require('../models/BranchClassDays');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/response');

// Create a new BranchClassDays entry
exports.createBranchClassDay = async (req, res) => {
    const { branchId, day } = req.body;

    try {
        const newBranchClassDay = new BranchClassDays({ branchId, day });
        const savedBranchClassDay = await newBranchClassDay.save();
        sendSuccessResponse(res, 201, 'Branch class day created successfully.', savedBranchClassDay);
    } catch (error) {
        // Handle duplicate entry error
        if (error.code === 11000) {
            return sendErrorResponse(res, 400, 'This day is already assigned to the branch.');
        }
        console.error(error);
        sendErrorResponse(res, 500, 'Server error', error);
    }
};

// Get all BranchClassDays
exports.getAllBranchClassDays = async (req, res) => {
    try {
        const branchClassDays = await BranchClassDays.find()
            .populate('branchId', 'branchName branchAddress')
            .sort({ branchId: 1, day: 1 });

        if (!branchClassDays.length) {
            return sendErrorResponse(res, 404, 'No branch class days found.');
        }

        sendSuccessResponse(res, 200, 'Branch class days fetched successfully.', branchClassDays);
    } catch (error) {
        console.error(error);
        sendErrorResponse(res, 500, 'Server error', error);
    }
};

// Get BranchClassDays by Branch ID
exports.getBranchClassDaysByBranchId = async (req, res) => {
    const { branchId } = req.params;

    try {
        const branchClassDays = await BranchClassDays.find({ branchId })
            .populate('branchId', 'branchName branchAddress');

        if (!branchClassDays.length) {
            return sendErrorResponse(res, 404, 'No class days found for the specified branch.');
        }

        sendSuccessResponse(res, 200, 'Branch class days fetched successfully.', branchClassDays);
    } catch (error) {
        console.error(error);
        sendErrorResponse(res, 500, 'Server error', error);
    }
};

// Update a BranchClassDays entry
exports.updateBranchClassDay = async (req, res) => {
    const { id } = req.params;
    const { day } = req.body;

    try {
        const updatedBranchClassDay = await BranchClassDays.findByIdAndUpdate(
            id,
            { day },
            { new: true, runValidators: true }
        );

        if (!updatedBranchClassDay) {
            return sendErrorResponse(res, 404, 'Branch class day not found.');
        }

        sendSuccessResponse(res, 200, 'Branch class day updated successfully.', updatedBranchClassDay);
    } catch (error) {
        // Handle duplicate entry error
        if (error.code === 11000) {
            return sendErrorResponse(res, 400, 'This day is already assigned to the branch.');
        }
        console.error(error);
        sendErrorResponse(res, 500, 'Server error', error);
    }
};

// Delete a BranchClassDays entry
exports.deleteBranchClassDay = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedBranchClassDay = await BranchClassDays.findByIdAndDelete(id);

        if (!deletedBranchClassDay) {
            return sendErrorResponse(res, 404, 'Branch class day not found.');
        }

        sendSuccessResponse(res, 200, 'Branch class day deleted successfully.');
    } catch (error) {
        console.error(error);
        sendErrorResponse(res, 500, 'Server error', error);
    }
};

// Get BranchClassDays by Day ID
exports.getBranchClassDaysByDayId = async (req, res) => {
    const { dayId } = req.params;

    try {
        const branchClassDay = await BranchClassDays.findById(dayId)
            .populate('branchId', 'branchName branchAddress');

        if (!branchClassDay) {
            return sendErrorResponse(res, 404, 'Branch class day not found.');
        }
        sendSuccessResponse(res, 200, 'Branch class day fetched successfully.', branchClassDay);
    } catch (error) {
        console.error('Error fetching branch class day by ID:', error);
        sendErrorResponse(res, 500, 'Server error', error);
    }
};