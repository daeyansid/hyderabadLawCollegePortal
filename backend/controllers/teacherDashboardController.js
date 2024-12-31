// controllers/teacherDashboardController.js
const ClassSlotAssignments = require('../models/ClassSlotAssignments');
const TeacherAttendance = require('../models/TeacherAttendance');
const mongoose = require('mongoose');

exports.getTeacherDashboardData = async (req, res) => {
    try {
        const teacherId = req.query.teacherId;
        const branchId = req.query.branchId;

        if (!teacherId || !branchId) {
            return res.status(400).json({ message: 'Teacher ID and Branch ID are required.' });
        }

        if (!mongoose.Types.ObjectId.isValid(teacherId) || !mongoose.Types.ObjectId.isValid(branchId)) {
            return res.status(400).json({ message: 'Invalid Teacher ID or Branch ID.' });
        }

        const teacherObjectId = new mongoose.Types.ObjectId(teacherId);
        const branchObjectId = new mongoose.Types.ObjectId(branchId);

        // Get today's date at midnight UTC
        const today = new Date(new Date().toISOString().split('T')[0]);

        // Fetch today's attendance
        const todayAttendance = await TeacherAttendance.findOne({
            teacherId: teacherObjectId,
            date: today
        }).lean();

        const assignedClasses = await ClassSlotAssignments.aggregate([
            {
                $match: {
                    teacherId: teacherObjectId,
                },
            },
            {
                $lookup: {
                    from: 'branchclassdays',
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

        const totalAssignedClasses = assignedClasses.length > 0 ? assignedClasses[0].totalAssignedClasses : 0;

        res.status(200).json({
            totalAssignedClasses: totalAssignedClasses,
            todayAttendance: todayAttendance || null
        });
    } catch (error) {
        console.error('Error fetching teacher dashboard data:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
