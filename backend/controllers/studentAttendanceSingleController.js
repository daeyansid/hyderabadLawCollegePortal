// controllers/studentAttendanceController.js

const ClassAttendanceSingle = require('../models/ClassAttendanceSingle');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/response');

exports.getAttendanceByStudentId = async (req, res) => {
    const { studentId } = req.query;

    try {
        if (!studentId) {
            return sendErrorResponse(res, 400, 'studentId is required.');
        }

        const query = { studentId: studentId };

        // Fetch attendance records with nested population
        const attendanceRecords = await ClassAttendanceSingle.find(query)
            .populate('teacherId')
            .populate({
                path: 'slotId',
                populate: {
                    path: 'branchDailyTimeSlotsId',
                    select: 'slot'
                }
            })
            .populate('classId')
            .sort({ date: -1 });

        if (!attendanceRecords.length) {
            return sendSuccessResponse(res, 200, 'No attendance records found for this student.', []);
        }

        // Transform the data to include slot information
        const transformedRecords = attendanceRecords.map(record => ({
            ...record.toObject(),
            slotDetails: record.slotId?.branchDailyTimeSlotsId 
                ? {
                    startTime: record.slotId.branchDailyTimeSlotsId.startTime,
                    endTime: record.slotId.branchDailyTimeSlotsId.endTime,
                    dayOfWeek: record.slotId.branchDailyTimeSlotsId.dayOfWeek
                }
                : null
        }));

        sendSuccessResponse(res, 200, 'Attendance records fetched successfully.', transformedRecords);
    } catch (error) {
        console.error('Error fetching attendance records:', error);
        sendErrorResponse(res, 500, 'Server Error', error);
    }
};
