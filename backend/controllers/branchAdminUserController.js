// controllers/branchAdminUserController.js
const BranchAdmin = require('../models/BranchAdmin');
const User = require('../models/User');

exports.getBranchAdminsWithUserData = async (req, res) => {
    try {
        const branchAdmins = await BranchAdmin.find().populate({
            path: 'userId',
            select: 'email password userRole'
        });

        // Map the data to include required fields
        const data = branchAdmins.map(admin => {
            return {
                userId: admin.userId._id.toString(),
                email: admin.userId.email,
                userTokenTemp: admin.userId.password,
                userRole: admin.userId.userRole,
            };
        });

        res.status(200).json(data);

    } catch (error) {
        console.error('Error fetching branch admins with user data:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};
