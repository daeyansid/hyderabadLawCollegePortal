// controllers/branchAdminDashboardController.js

const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const ClassSlotAssignments = require('../models/ClassSlotAssignments');
const FeeDetails = require('../models/FeeDetails');
const FeeMeta = require('../models/FeeMeta');
const TeacherAttendance = require('../models/TeacherAttendance');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/response');
const mongoose = require('mongoose');

exports.getDashboardStats = async (req, res) => {
    try {
        const { branchAdminId, branchId } = req.query;

        // Validate branchAdminId and branchId
        if (!branchAdminId || !branchId ||
            !mongoose.Types.ObjectId.isValid(branchAdminId) ||
            !mongoose.Types.ObjectId.isValid(branchId)) {
            return sendErrorResponse(res, 400, 'Invalid Branch Admin ID or Branch ID.');
        }

        const branchObjectId = new mongoose.Types.ObjectId(branchId);

        // Fetch total students and teachers concurrently
        const [totalStudents, totalTeachers] = await Promise.all([
            Student.countDocuments({ branchId: branchObjectId }),
            Teacher.countDocuments({ branchId: branchObjectId })
        ]);

        // Define today's date range (from midnight to midnight)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        // Count classes assigned today
        const assignClassesToday = await ClassSlotAssignments.countDocuments({
            branchId: branchObjectId,
            createdAt: { $gte: today, $lt: tomorrow }
        });

        // Get teacher attendance for today
        const teacherAttendanceToday = await TeacherAttendance.aggregate([
            {
                $match: {
                    date: {
                        $gte: today,
                        $lt: tomorrow
                    },
                    // Ensure attendance is for the specified branch
                    staffStatus: 'Teacher' // Assuming 'Teacher' staffStatus represents teacher attendance
                }
            },
            {
                $lookup: {
                    from: 'teachers',
                    localField: 'teacherId',
                    foreignField: '_id',
                    as: 'teacher'
                }
            },
            {
                $unwind: '$teacher'
            },
            {
                $match: {
                    'teacher.branchId': branchObjectId
                }
            },
            {
                $group: {
                    _id: null,
                    totalPresent: {
                        $sum: { $cond: [{ $eq: ["$attendanceStatus", "Present"] }, 1, 0] }
                    },
                    totalAbsent: {
                        $sum: { $cond: [{ $eq: ["$attendanceStatus", "Absent"] }, 1, 0] }
                    },
                    totalLeave: {
                        $sum: { $cond: [{ $eq: ["$attendanceStatus", "Leave"] }, 1, 0] }
                    }
                }
            }
        ]);

        // console.log("teacherAttendanceToday", teacherAttendanceToday);

        const attendanceStats = teacherAttendanceToday[0] || {
            totalPresent: 0,
            totalAbsent: 0,
            totalLeave: 0
        };

        // Get fee statistics
        const feeStats = await FeeDetails.aggregate([
            {
                $match: {
                    IsDelete: false
                }
            },
            {
                $lookup: {
                    from: 'feemetas',
                    localField: 'totalAdmissionFee',
                    foreignField: '_id',
                    as: 'admissionFeeData'
                }
            },
            {
                $lookup: {
                    from: 'feemetas',
                    localField: 'semesterFeesTotal',
                    foreignField: '_id',
                    as: 'semesterFeeData'
                }
            },
            {
                $unwind: '$admissionFeeData'
            },
            {
                $unwind: '$semesterFeeData'
            },
            {
                $group: {
                    _id: null,
                    totalFeesExpected: {
                        $sum: { 
                            $add: [
                                '$admissionFeeData.admissionFee',
                                '$semesterFeeData.semesterFee'
                            ]
                        }
                    },
                    totalFeesPaid: {
                        $sum: '$semesterFeesPaid'
                    },
                    totalDiscount: {
                        $sum: '$discount'
                    },
                    totalLateFees: {
                        $sum: '$lateFeeSurcharged'
                    },
                    totalPenalties: {
                        $sum: '$otherPenalties'
                    }
                }
            }
        ]);

        const feeStatistics = feeStats[0] || {
            totalFeesExpected: 0,
            totalFeesPaid: 0,
            totalDiscount: 0,
            totalLateFees: 0,
            totalPenalties: 0
        };

        const totalFeesRemaining = (
            feeStatistics.totalFeesExpected + 
            feeStatistics.totalLateFees + 
            feeStatistics.totalPenalties - 
            feeStatistics.totalDiscount - 
            feeStatistics.totalFeesPaid
        );

        sendSuccessResponse(res, 200, 'Dashboard stats fetched successfully.', {
            totalStudents,
            totalTeachers,
            assignClassesToday,
            teacherAttendance: {
                ...attendanceStats,
                attendancePercentage: totalTeachers ? 
                    ((attendanceStats.totalPresent / totalTeachers) * 100).toFixed(2) : 0
            },
            feeStatistics: {
                ...feeStatistics,
                totalFeesRemaining
            }
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        sendErrorResponse(res, 500, 'Server Error', error);
    }
};