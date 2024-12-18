const BranchType = require('../models/BranchType');
const { sendErrorResponse, sendSuccessResponse } = require('../utils/response');

// Create a new branch type
exports.createBranchType = async (req, res) => {
    const { name } = req.body;

    try {
        const existingBranchType = await BranchType.find({ name });
        if (existingBranchType.length > 0) {
            return sendErrorResponse(res, 400, 'Branch Type already exist');
        }

        const branchType = new BranchType({ name });
        await branchType.save();
        sendSuccessResponse(res, 201, 'Branch type created successfully', branchType);
    } catch (err) {
        console.error(err.message);
        sendErrorResponse(res, 500, 'Server error', err);
    }
};

// Get all branch types
exports.getAllBranchTypes = async (req, res) => {
    try {
        const branchTypes = await BranchType.find();
        sendSuccessResponse(res, 200, 'Branch types fetched successfully', branchTypes);
    } catch (err) {
        console.error(err.message);
        sendErrorResponse(res, 500, 'Server error', err);
    }
};

// Get all branch types for select list
exports.getBranchTypesSelectList = async (req, res) => {
    try {
        const branchTypes = await BranchType.find().select('_id name');
        const branchTypeList = branchTypes.map(type => ({ id: type._id, value: type.name }));
        sendSuccessResponse(res, 200, 'Branch types fetched successfully', branchTypeList);
    } catch (err) {
        console.error(err.message);
        sendErrorResponse(res, 500, 'Server error', err);
    }
};

// Get a branch type by ID
exports.getBranchTypeById = async (req, res) => {
    try {
        const branchType = await BranchType.findById(req.params.id);
        if (!branchType) {
            return sendErrorResponse(res, 404, 'Branch type not found');
        }
        sendSuccessResponse(res, 200, 'Branch type fetched successfully', branchType);
    } catch (err) {
        console.error(err.message);
        sendErrorResponse(res, 500, 'Server error', err);
    }
};

// Update a branch type
exports.updateBranchType = async (req, res) => {
    const { name } = req.body;

    try {
        const branchType = await BranchType.findById(req.params.id);
        if (!branchType) {
            return sendErrorResponse(res, 404, 'Branch type not found');
        }

        branchType.name = name || branchType.name;
        const updatedBranchType = await branchType.save();
        sendSuccessResponse(res, 200, 'Branch type updated successfully', updatedBranchType);
    } catch (err) {
        console.error(err.message);
        sendErrorResponse(res, 500, 'Server error', err);
    }
};

// Delete a branch type
exports.deleteBranchType = async (req, res) => {
    try {
        const branchType = await BranchType.findByIdAndDelete(req.params.id);
        if (!branchType) {
            return sendErrorResponse(res, 404, 'Branch type not found');
        }
        sendSuccessResponse(res, 200, 'Branch type deleted successfully');
    } catch (err) {
        console.error(err.message);
        sendErrorResponse(res, 500, 'Server error', err);
    }
};
