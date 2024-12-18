// controllers/teacherDashboardController.js
const TeacherLeave = require('../models/TeacherLeave');
const ClassSlotAssignments = require('../models/ClassSlotAssignments');
const mongoose = require('mongoose');

exports.getTeacherDashboardData = async (req, res) => {
    try {
        const teacherId = req.query.teacherId;
        const branchId = req.query.branchId;

        if (!teacherId || !branchId) {
            return res.status(400).json({ message: 'Teacher ID and Branch ID are required.' });
        }

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(teacherId) || !mongoose.Types.ObjectId.isValid(branchId)) {
            return res.status(400).json({ message: 'Invalid Teacher ID or Branch ID.' });
        }

        // Instantiate ObjectId with 'new'
        const teacherObjectId = new mongoose.Types.ObjectId(teacherId);
        const branchObjectId = new mongoose.Types.ObjectId(branchId);

        // Fetch leaves counts grouped by status
        const leaves = await TeacherLeave.aggregate([
            {
                $match: {
                    teacherId: teacherObjectId,
                    branchId: branchObjectId,
                },
            },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                },
            },
        ]);

        // Organize leaves counts
        const leaveCounts = {
            Approved: 0,
            Rejected: 0,
            Pending: 0,
        };
        leaves.forEach((leave) => {
            leaveCounts[leave._id] = leave.count;
        });

        // Fetch total assigned classes with branch verification
        const assignedClasses = await ClassSlotAssignments.aggregate([
            {
                $match: {
                    teacherId: teacherObjectId,
                },
            },
            {
                $lookup: {
                    from: 'branchclassdays', // Ensure this matches the actual collection name
                    localField: 'branchClassDaysId',
                    foreignField: '_id',
                    as: 'branchClassDay',
                },
            },
            {
                $unwind: '$branchClassDay',
            },
            {
                $match: {
                    'branchClassDay.branchId': branchObjectId,
                },
            },
            {
                $count: 'totalAssignedClasses',
            },
        ]);

        const totalAssignedClasses =
            assignedClasses.length > 0 ? assignedClasses[0].totalAssignedClasses : 0;

        // Return the data
        res.status(200).json({
            totalLeavesApproved: leaveCounts.Approved || 0,
            totalLeavesRejected: leaveCounts.Rejected || 0,
            totalLeavesPending: leaveCounts.Pending || 0,
            totalAssignedClasses: totalAssignedClasses,
        });
    } catch (error) {
        console.error('Error fetching teacher dashboard data:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
