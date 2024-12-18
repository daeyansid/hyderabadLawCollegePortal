const Branch = require('../models/Branch');
const BranchSetting = require('../models/BranchSettings');
const BranchAdmin = require('../models/BranchAdmin');
const { validateRequiredFields } = require('../utils/validateRequiredFields');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/response');

// Create a new Branch
exports.createBranch = async (req, res) => {
    const { branchName, branchAddress, assignedTo, branchPhoneNumber, branchEmailAddress, machineAttendance, dairy, startTime, endTime } = req.body;

    try {
        // Validate required fields
        const missingFields = validateRequiredFields({ branchName, branchAddress, assignedTo, branchPhoneNumber, machineAttendance, dairy, startTime, endTime });
        if (missingFields.length > 0) {
            return sendErrorResponse(res, 400, `Missing fields: ${missingFields.join(', ')}`);
        }

        // Create Branch
        const branch = new Branch({
            branchName,
            branchAddress,
            assignedTo,
            branchPhoneNumber,
            branchEmailAddress
        });
        const savedBranch = await branch.save();

        // Create branchSettings with the branchId reference
        const branchSetting = new BranchSetting({
            machineAttendance,
            dairy,
            startTime,
            endTime,
            branchId: savedBranch._id
        });
        const savedBranchSetting = await branchSetting.save();

        sendSuccessResponse(res, 201, 'Branch and settings created successfully', { branch: savedBranch, branchSetting: savedBranchSetting });
    } catch (err) {
        console.error(err.message);
        sendErrorResponse(res, 500, 'Server error', err);
    }
};

// Get all Branches
exports.getAllBranches = async (req, res) => {
    try {
        // Fetch all branches
        const branches = await Branch.find()
            .populate({
                path: 'assignedTo',
                select: 'fullName phoneNumber',
                populate: {
                    path: 'userId',
                    select: 'username email userRole'
                }
            });

        // Fetch corresponding branch settings
        const branchesWithSettings = await Promise.all(branches.map(async (branch) => {
            const branchSettings = await BranchSetting.findOne({ branchId: branch._id })
                .select('machineAttendance dairy startTime endTime');
            return { ...branch.toObject(), branchSettings };
        }));

        sendSuccessResponse(res, 200, 'Branches retrieved successfully', branchesWithSettings);
    } catch (err) {
        console.error(err.message);
        sendErrorResponse(res, 500, 'Server error', err);
    }
};

// Get Branch by ID
exports.getBranchById = async (req, res) => {
    const { id } = req.params;

    try {
        const branch = await Branch.findById(id)
            .populate({
                path: 'assignedTo',
                select: 'fullName phoneNumber',
                populate: {
                    path: 'userId',
                    select: 'username email userRole'
                }
            })
            // .populate({
            //     path: 'branchSettings',
            //     select: 'machineAttendance dairy startTime endTime'
            // });

        if (!branch) {
            return sendErrorResponse(res, 404, 'Branch not found');
        }

        sendSuccessResponse(res, 200, 'Branch retrieved successfully', branch);
    } catch (err) {
        console.error(err.message);
        sendErrorResponse(res, 500, 'Server error', err);
    }
};

// Update Branch
exports.updateBranch = async (req, res) => {
    const { id } = req.params;
    const { branchName, branchAddress, assignedTo, branchPhoneNumber, branchEmailAddress, machineAttendance, dairy, startTime, endTime, branchAdminDetails } = req.body;

    try {
        let branch = await Branch.findById(id);
        if (!branch) {
            return sendErrorResponse(res, 404, 'Branch not found');
        }

        // Update the branch details
        branch.branchName = branchName !== undefined ? branchName : branch.branchName;
        branch.branchAddress = branchAddress !== undefined ? branchAddress : branch.branchAddress;
        branch.assignedTo = assignedTo !== undefined ? assignedTo : branch.assignedTo;
        branch.branchPhoneNumber = branchPhoneNumber !== undefined ? branchPhoneNumber : branch.branchPhoneNumber;
        branch.branchEmailAddress = branchEmailAddress !== undefined ? branchEmailAddress : branch.branchEmailAddress;
        branch = await branch.save();

        // Update the corresponding branchSettings
        let branchSetting = await BranchSetting.findOne({ branchId: branch._id });
        if (branchSetting) {
            branchSetting.machineAttendance = machineAttendance !== undefined ? machineAttendance : branchSetting.machineAttendance;
            branchSetting.dairy = dairy !== undefined ? dairy : branchSetting.dairy;
            branchSetting.startTime = startTime !== undefined ? startTime : branchSetting.startTime;
            branchSetting.endTime = endTime !== undefined ? endTime : branchSetting.endTime;
            branchSetting = await branchSetting.save();
        }

        // Update the BranchAdmin if details are provided
        if (branchAdminDetails && branch.assignedTo) {
            let branchAdmin = await BranchAdmin.findById(branch.assignedTo);
            if (branchAdmin) {
                branchAdmin.fullName = branchAdminDetails.fullName !== undefined ? branchAdminDetails.fullName : branchAdmin.fullName;
                branchAdmin.phoneNumber = branchAdminDetails.phoneNumber !== undefined ? branchAdminDetails.phoneNumber : branchAdmin.phoneNumber;
                branchAdmin.cnicNumber = branchAdminDetails.cnicNumber !== undefined ? branchAdminDetails.cnicNumber : branchAdmin.cnicNumber;
                branchAdmin.gender = branchAdminDetails.gender !== undefined ? branchAdminDetails.gender : branchAdmin.gender;
                branchAdmin.address = branchAdminDetails.address !== undefined ? branchAdminDetails.address : branchAdmin.address;
                branchAdmin.salary = branchAdminDetails.salary !== undefined ? branchAdminDetails.salary : branchAdmin.salary;
                branchAdmin = await branchAdmin.save();
            }
        }

        sendSuccessResponse(res, 200, 'Branch, settings, and BranchAdmin updated successfully', { branch, branchSetting });
    } catch (err) {
        if (err.name === 'ValidationError') {
            const errorMessages = Object.values(err.errors).map(e => ({
                path: e.path,
                message: e.message
            }));

            sendErrorResponse(res, 400, 'Validation error', {
                errors: errorMessages,
                _message: err.message,
                name: err.name
            });
        } else {
            console.error(err.message);
            sendErrorResponse(res, 500, 'Server error', err);
        }
    }
};

// Delete Branch
exports.deleteBranch = async (req, res) => {
    const { id } = req.params;

    try {
        const branch = await Branch.findById(id);
        if (!branch) {
            return sendErrorResponse(res, 404, 'Branch not found');
        }

        // Delete the associated BranchSetting
        await BranchSetting.deleteOne({ branchId: branch._id });

        // Delete the branch
        await branch.deleteOne();

        sendSuccessResponse(res, 200, 'Branch and associated settings deleted successfully');
    } catch (err) {
        console.error(err.message);
        sendErrorResponse(res, 500, 'Server error', err);
    }
};