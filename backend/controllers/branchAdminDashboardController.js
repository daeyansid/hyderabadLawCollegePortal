// controllers/branchAdminDashboardController.js

const Teacher = require('../models/Teacher');
const Staff = require('../models/Staff');
const Student = require('../models/Student');
const ClassSlotAssignments = require('../models/ClassSlotAssignments');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/response');
const mongoose = require('mongoose');

exports.getDashboardStats = async (req, res) => {
    try {
        const branchAdminId = req.query.branchAdminId;
        const branchId = req.query.branchId;

        // Validate branchAdminId and branchId
        if (!branchAdminId) {
            return sendErrorResponse(res, 400, 'Branch Admin ID is required.');
        }

        if (!branchId) {
            return sendErrorResponse(res, 400, 'Branch ID is required.');
        }

        if (!mongoose.Types.ObjectId.isValid(branchAdminId)) {
            return sendErrorResponse(res, 400, 'Invalid Branch Admin ID.');
        }

        if (!mongoose.Types.ObjectId.isValid(branchId)) {
            return sendErrorResponse(res, 400, 'Invalid Branch ID.');
        }

        const branchAdminObjectId = new mongoose.Types.ObjectId(branchAdminId);
        const branchObjectId = new mongoose.Types.ObjectId(branchId);

        // Fetch Total Teachers
        const totalStudents = await Student.countDocuments({ branchId: branchObjectId });
        
        // Fetch Total Teachers
        const totalTeachers = await Teacher.countDocuments({ branchId: branchObjectId });

        // Fetch Other Staff Members
        const totalStaff = await Staff.countDocuments({ branchId: branchObjectId });

        // Calculate Total Employees
        const totalEmployees = totalTeachers + totalStaff;

        // Assign Classes Today
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Start of today
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1); // Start of tomorrow

        const assignClassesToday = await ClassSlotAssignments.countDocuments({
            branchId: branchObjectId,
            createdAt: { $gte: today, $lt: tomorrow },
        });

        // New Join This Month
        const currentMonth = today.getMonth(); // 0-indexed
        const currentYear = today.getFullYear();

        const startOfMonth = new Date(currentYear, currentMonth, 1);
        const endOfMonth = new Date(currentYear, currentMonth + 1, 1);

        // Count new teachers
        const newTeachers = await Teacher.countDocuments({
            branchId: branchObjectId,
            joinDate: { $gte: startOfMonth, $lt: endOfMonth },
        });

        // Count new staff
        const newStaff = await Staff.countDocuments({
            branchId: branchObjectId,
            joinDate: { $gte: startOfMonth, $lt: endOfMonth },
        });

        const newJoinThisMonth = newTeachers + newStaff;

        // Prepare data for charts (e.g., Monthly Join Count)
        const monthlyJoinCount = await Promise.all([
            // Teachers per month
            Teacher.aggregate([
                {
                    $match: {
                        branchId: branchObjectId,
                        joinDate: { $gte: new Date(currentYear, currentMonth - 5, 1), $lt: endOfMonth },
                    },
                },
                {
                    $group: {
                        _id: { $month: '$joinDate' },
                        count: { $sum: 1 },
                    },
                },
            ]),
            // Staff per month
            Staff.aggregate([
                {
                    $match: {
                        branchId: branchObjectId,
                        joinDate: { $gte: new Date(currentYear, currentMonth - 5, 1), $lt: endOfMonth },
                    },
                },
                {
                    $group: {
                        _id: { $month: '$joinDate' },
                        count: { $sum: 1 },
                    },
                },
            ]),
        ]);

        // Merge monthly join counts
        const joinCounts = {};

        monthlyJoinCount.forEach((group, index) => {
            group.forEach(item => {
                const month = item._id;
                if (!joinCounts[month]) {
                    joinCounts[month] = 0;
                }
                joinCounts[month] += item.count;
            });
        });

        // Prepare data for the last 6 months
        const attendanceOverTime = [];
        for (let i = 5; i >= 0; i--) {
            const date = new Date(currentYear, currentMonth - i, 1);
            const month = date.toLocaleString('default', { month: 'short' });
            attendanceOverTime.push({
                month,
                joinCount: joinCounts[date.getMonth() + 1] || 0,
            });
        }

        sendSuccessResponse(res, 200, 'Dashboard stats fetched successfully.', {
            totalStudents,
            totalTeachers,
            totalStaff,
            totalEmployees,
            assignClassesToday,
            newJoinThisMonth,
            attendanceOverTime,
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        sendErrorResponse(res, 500, 'Server Error', error);
    }
};
