const ClassAttendanceSingle = require('../models/ClassAttendanceSingle');
const Holiday = require('../models/Holiday');
const Student = require('../models/Student');
const moment = require('moment');
const { sendErrorResponse, sendSuccessResponse } = require('../utils/response');

// Check if attendance exists
exports.checkAttendanceExists = async (req, res) => {
    try {
        const { date, classId, sectionId,teacherId } = req.query;

        if (!date || !classId || !sectionId || !teacherId) {
            return res.status(400).json({ message: 'All parameters are required.' });
        }

        const attendanceCount = await ClassAttendanceSingle.countDocuments({
            date: new Date(date),
            classId,
            sectionId,
            teacherId,
        });

        res.status(200).json({ attendanceExists: attendanceCount > 0 });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
};

// Get attendance records
exports.getAttendanceRecords = async (req, res) => {
    try {
        const { date, classId, sectionId, teacherId } = req.query;

        const attendanceRecords = await ClassAttendanceSingle.find({
            date: new Date(date),
            classId,
            sectionId,
            teacherId,
        }).populate('studentId');

        res.status(200).json({ attendanceRecords });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
};

// Get students list
exports.getStudentsList = async (req, res) => {
    try {
        const { classId, sectionId } = req.query;

        const students = await Student.find({
            classId,
            sectionId,
        });

        res.status(200).json({ students });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
};

// Save or update attendance records
exports.saveAttendanceRecords = async (req, res) => {
    try {
        const { date, classId, sectionId, teacherId, attendanceData } = req.body;

        const dateObj = new Date(date);

        // Iterate over attendanceData to upsert records
        for (const record of attendanceData) {
            await ClassAttendanceSingle.findOneAndUpdate(
                {
                    date: dateObj,
                    classId,
                    sectionId,
                    teacherId,
                    studentId: record.studentId,
                },
                {
                    $set: {
                        attendanceStatus: record.attendanceStatus,
                        month: moment(date).month() + 1,
                        year: moment(date).year(),
                    },
                },
                { upsert: true, new: true }
            );
        }

        res.status(200).json({ message: 'Attendance saved successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
};

// Check if date is a holiday
exports.checkHoliday = async (req, res) => {
    try {
        const { date } = req.query;

        const holiday = await Holiday.findOne({
            date: new Date(date),
        });

        if (holiday) {
            res.status(200).json({ isHoliday: true, holiday });
        } else {
            res.status(200).json({ isHoliday: false });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
};

// Dummy check for teacher attendance
exports.checkTeacherAttendance = async (req, res) => {
    // For now, always return true
    res.status(200).json({ teacherPresent: true });
};
