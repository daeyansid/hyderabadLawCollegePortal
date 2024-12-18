// controllers/studentDashboardController.js

const Student = require('../models/Student');
const ClassAttendance = require('../models/ClassAttendance');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/response');
const mongoose = require('mongoose');

exports.getDashboardStats = async (req, res) => {
    try {
        const studentId = req.query.studentId;

        if (!studentId) {
            return sendErrorResponse(res, 400, 'Student ID is required.');
        }

        // Validate the studentId
        if (!mongoose.Types.ObjectId.isValid(studentId)) {
            return sendErrorResponse(res, 400, 'Invalid Student ID.');
        }

        // Convert studentId to ObjectId using 'new'
        const studentObjectId = new mongoose.Types.ObjectId(studentId);

        // Verify if the student exists
        const student = await Student.findById(studentObjectId);

        if (!student) {
            return sendErrorResponse(res, 404, 'Student not found.');
        }

        // Fetch all attendance records for the student
        const attendanceRecords = await ClassAttendance.find({ studentId: studentObjectId });

        // Calculate the counts
        let totalPresent = 0;
        let totalAbsent = 0;
        let totalLeave = 0;

        attendanceRecords.forEach(record => {
            switch (record.attendanceStatus) {
                case 'Present':
                    totalPresent += 1;
                    break;
                case 'Absent':
                    totalAbsent += 1;
                    break;
                case 'Leave':
                    totalLeave += 1;
                    break;
                default:
                    break;
            }
        });

        // Prepare data for attendance over time (e.g., last 7 days)
        const today = new Date();
        const pastDate = new Date();
        pastDate.setDate(today.getDate() - 6); // Last 7 days including today

        // Fetch attendance records for the last 7 days
        const attendanceLast7Days = await ClassAttendance.aggregate([
            {
                $match: {
                    studentId: studentObjectId,
                    date: { $gte: pastDate, $lte: today },
                },
            },
            {
                $group: {
                    _id: {
                        day: { $dayOfMonth: '$date' },
                        month: { $month: '$date' },
                        year: { $year: '$date' },
                        status: '$attendanceStatus',
                    },
                    count: { $sum: 1 },
                },
            },
        ]);

        // Organize data for chart plotting
        const attendanceOverTime = [];

        // Initialize the attendanceOverTime array with dates and default counts
        for (let i = 0; i < 7; i++) {
            const date = new Date(pastDate);
            date.setDate(pastDate.getDate() + i);
            const dateString = date.toISOString().split('T')[0];
            attendanceOverTime.push({
                date: dateString,
                Present: 0,
                Absent: 0,
                Leave: 0,
            });
        }

        // Map the aggregated data to the attendanceOverTime array
        attendanceLast7Days.forEach(item => {
            const date = new Date(item._id.year, item._id.month - 1, item._id.day);
            const dateString = date.toISOString().split('T')[0];
            const status = item._id.status;
            const index = attendanceOverTime.findIndex(entry => entry.date === dateString);

            if (index !== -1) {
                attendanceOverTime[index][status] = item.count;
            }
        });

        sendSuccessResponse(res, 200, 'Dashboard stats fetched successfully.', {
            totalPresent,
            totalAbsent,
            totalLeave,
            attendanceOverTime,
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        sendErrorResponse(res, 500, 'Server Error', error);
    }
};
