const User = require('../models/User');
const BranchAdmin = require('../models/BranchAdmin');
const Branch = require('../models/Branch');
const { validateRequiredFields } = require('../utils/validateRequiredFields');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/response');
const upload = require('../middleware/upload');
const bcrypt = require('bcryptjs');

// Register Branch Admin
exports.registerBranchAdmin = async (req, res) => {
    upload.single('photo')(req, res, async (err) => {
        if (err) {
            return sendErrorResponse(res, 400, 'Image upload failed', err);
        }

        const { username, password, email, userRole, fullName, cnicNumber, phoneNumber, address, salary, gender, joinDate, adminId } = req.body;
        const photo = req.file ? req.file.filename : null; // Save only the filename

        const missingFields = validateRequiredFields({ username, password, email, userRole, fullName, cnicNumber, phoneNumber, address, salary, gender, joinDate, adminId });
        if (missingFields.length > 0) {
            return sendErrorResponse(res, 400, `Missing fields: ${missingFields.join(', ')}`);
        }

        try {
            const existingUserId = await BranchAdmin.findOne({ adminId });
            if (existingUserId) {
                return sendErrorResponse(res, 400, 'Admin ID already exists');
            }

            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return sendErrorResponse(res, 400, 'Email already exists');
            }


            const hashedPassword = await bcrypt.hash(password, 10);

            const user = new User({
                username,
                password: hashedPassword,
                email,
                userRole,
            });

            const savedUser = await user.save();

            const branchAdmin = new BranchAdmin({
                fullName,
                cnicNumber,
                phoneNumber,
                address,
                salary,
                gender,
                joinDate,
                userId: savedUser._id,
                adminId,
                photo // Save only the photo filename
            });

            const savedBranchAdmin = await branchAdmin.save();

            sendSuccessResponse(res, 201, 'Branch admin registered successfully', { user: savedUser, branchAdmin: savedBranchAdmin });
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
    });
};

// Get all Branch Admins
exports.getAllBranchAdmins = async (req, res) => {
    try {
        // Fetch all BranchAdmins with their user data populated
        const branchAdmins = await BranchAdmin.find().populate('userId', 'username email userRole');

        // Fetch branches where the current branch admins are assigned using their IDs
        const branches = await Branch.find({ assignedTo: { $in: branchAdmins.map(admin => admin._id) } });

        // Combine branch details with their respective branch admin
        const branchAdminsWithBranches = branchAdmins.map(admin => {
            const branch = branches.find(branch => branch.assignedTo.toString() === admin._id.toString());
            return {
                ...admin._doc,
                branch: branch ? {
                    branchName: branch.branchName,
                    branchPhoneNumber: branch.branchPhoneNumber,
                    branchEmailAddress: branch.branchEmailAddress,
                    branchAddress: branch.branchAddress,
                } : null
            };
        });

        // Return the combined data
        res.json({ data: branchAdminsWithBranches });
    } catch (error) {
        console.error('Error fetching branch admins:', error);
        res.status(500).json({ message: 'Unable to fetch branch admins' });
    }
};

// Get Branch Admin by ID
exports.getBranchAdminById = async (req, res) => {
    const { id } = req.params;

    try {
        const branchAdmin = await BranchAdmin.findById(id).populate('userId', 'username email userRole');
        if (!branchAdmin) {
            return sendErrorResponse(res, 404, 'Branch admin not found');
        }

        // Fetch branch associated with the branch admin
        const branch = await Branch.findOne({ assignedTo: branchAdmin._id });

        const response = {
            ...branchAdmin._doc,
            branch: branch ? {
                branchType: branch.branchType,
                branchPhoneNumber: branch.branchPhoneNumber,
                branchEmailAddress: branch.branchEmailAddress,
                branchAddress: branch.branchAddress,
            } : null
        };

        sendSuccessResponse(res, 200, 'Branch admin retrieved successfully', response);
    } catch (err) {
        console.error(err.message);
        sendErrorResponse(res, 500, 'Server error', err);
    }
};

// Update Branch Admin
exports.updateBranchAdmin = async (req, res) => {
    upload.single('photo')(req, res, async (err) => {
        if (err) {
            return sendErrorResponse(res, 400, 'Image upload failed', err);
        }

        const { id } = req.params;
        const { fullName, cnicNumber, phoneNumber, address, salary, gender, password, joinDate } = req.body;
        const photo = req.file ? req.file.filename : null; // Save only the filename

        try {
            let branchAdmin = await BranchAdmin.findById(id).populate('userId');
            if (!branchAdmin) {
                return sendErrorResponse(res, 404, 'Branch admin not found');
            }

            branchAdmin.fullName = fullName || branchAdmin.fullName;
            branchAdmin.cnicNumber = cnicNumber || branchAdmin.cnicNumber;
            branchAdmin.phoneNumber = phoneNumber || branchAdmin.phoneNumber;
            branchAdmin.address = address || branchAdmin.address;
            branchAdmin.salary = salary || branchAdmin.salary;
            branchAdmin.gender = gender || branchAdmin.gender;
            branchAdmin.joinDate = joinDate || branchAdmin.joinDate;
            if (photo) branchAdmin.photo = photo;


            // const existingUserId = await BranchAdmin.findOne({ adminId });
            // if (existingUserId) {
            //     return sendErrorResponse(res, 400, 'Admin ID already exists');
            // }

            // const existingUser = await User.findOne({ email });
            // if (existingUser) {
            //     return sendErrorResponse(res, 400, 'Email already exists');
            // }

            if (password) {
                const hashedPassword = await bcrypt.hash(password, 10);
                branchAdmin.userId.password = hashedPassword;
            }

            await branchAdmin.userId.save();
            branchAdmin = await branchAdmin.save();

            sendSuccessResponse(res, 200, 'Branch admin updated successfully', branchAdmin);
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
    });
};

// Delete Branch Admin
exports.deleteBranchAdmin = async (req, res) => {
    const { id } = req.params;

    try {
        const branchAdmin = await BranchAdmin.findById(id).populate('userId', 'username email userRole');
        if (!branchAdmin) {
            return sendErrorResponse(res, 404, 'Branch admin not found');
        }

        // Delete the associated User
        await User.findByIdAndDelete(branchAdmin.userId);

        // Delete the BranchAdmin
        await branchAdmin.deleteOne();

        sendSuccessResponse(res, 200, 'Branch admin and associated user deleted successfully');
    } catch (err) {
        console.error(err.message);
        sendErrorResponse(res, 500, 'Server error', err);
    }
};
