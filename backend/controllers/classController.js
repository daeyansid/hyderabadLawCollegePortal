const Class = require('../models/Class');
const Branch = require('../models/Branch');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/response');
const { validateRequiredFields } = require('../utils/validateRequiredFields');

// Create Class
exports.createClass = async (req, res) => {
    const { className, description, branchId } = req.body;

    try {
        // Validate required fields
        const missingFields = validateRequiredFields({ className, description, branchId });
        if (missingFields.length > 0) {
            return sendErrorResponse(res, 400, `Missing fields: ${missingFields.join(', ')}`);
        }

        // Create a new Class entry
        const newClass = new Class({
            className,
            description,
            branchId
        });
        const savedClass = await newClass.save();

        sendSuccessResponse(res, 201, 'Class created successfully', savedClass);
    } catch (err) {
        console.error(err.message);
        sendErrorResponse(res, 500, 'Server error', err);
    }
};

// Get all Classes with their branch information
exports.getAllClasses = async (req, res) => {
    try {
        const { branchId } = req.query;

        if (!branchId) {
            return sendErrorResponse(res, 400, 'Branch ID is required');
        }

        // Filter classes by branchId
        const classes = await Class.find({ branchId })
            .populate('branchId');

        if (!classes.length) {
            return sendErrorResponse(res, 404, 'No classes found for this branch');
        }

        sendSuccessResponse(res, 200, 'Classes retrieved successfully', classes);
    } catch (err) {
        console.error(err.message);
        sendErrorResponse(res, 500, 'Server error', err);
    }
};

exports.getClassesByBranchId = async (req, res) => {
    const { branchId } = req.query;

    if (!branchId) {
        return sendErrorResponse(res, 400, 'Branch ID is required');
    }

    try {
        const classes = await Class.find({ branchId });
        if (!classes || classes.length === 0) {
            return sendErrorResponse(res, 404, 'No classes found for the given Branch');
        }
        sendSuccessResponse(res, 200, 'Classes retrieved successfully', classes);
    } catch (err) {
        console.error(err.message);
        sendErrorResponse(res, 500, 'Server error', err);
    }
};

// Get a Class by ID with its branch information
exports.getClassById = async (req, res) => {
    const { id } = req.params;

    try {
        const classData = await Class.findById(id).populate('branchId');
        if (!classData) {
            return sendErrorResponse(res, 404, 'Class not found');
        }
        sendSuccessResponse(res, 200, 'Class retrieved successfully', classData);
    } catch (err) {
        console.error(err.message);
        sendErrorResponse(res, 500, 'Server error', err);
    }
};

// Update a Class by ID
exports.updateClass = async (req, res) => {
    const { id } = req.params;
    const { className, description, branchId } = req.body;

    try {
        const updatedClass = await Class.findByIdAndUpdate(id, { className, description, branchId }, { new: true }).populate('branchId');
        if (!updatedClass) {
            return sendErrorResponse(res, 404, 'Class not found');
        }
        sendSuccessResponse(res, 200, 'Class updated successfully', updatedClass);
    } catch (err) {
        console.error(err.message);
        sendErrorResponse(res, 500, 'Server error', err);
    }
};

// Delete a Class by ID
exports.deleteClass = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedClass = await Class.findByIdAndDelete(id);
        if (!deletedClass) {
            return sendErrorResponse(res, 404, 'Class not found');
        }
        sendSuccessResponse(res, 200, 'Class deleted successfully', deletedClass);
    } catch (err) {
        console.error(err.message);
        sendErrorResponse(res, 500, 'Server error', err);
    }
};

// Get classes by branchId
exports.getClassesByBranch = async (req, res) => {
    const { branchId } = req.params;
    try {
        const classes = await Class.find({ branchId });
        sendSuccessResponse(res, 200, 'Classes fetched successfully', classes);
    } catch (error) {
        console.error(error);
        sendErrorResponse(res, 500, 'Server error', error);
    }
};
