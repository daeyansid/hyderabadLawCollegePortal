const mongoose = require('mongoose');
const TeacherAttendance = require('../models/TeacherAttendance');

// Create new attendance record
exports.createAttendance = async (req, res) => {
    try {
        const attendance = new TeacherAttendance(req.body);
        const savedAttendance = await attendance.save();
        if(savedAttendance) res.status(201).json({ message: "Attendance Created" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all attendance records
exports.getAllAttendance = async (req, res) => {
    try {
        const attendance = await TeacherAttendance.find()
            .populate('teacherId')
            .populate('slotId')
            .populate('classId');
        res.status(200).json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get attendance by ID
exports.getAttendanceById = async (req, res) => {
    try {
        const attendance = await TeacherAttendance.findById(req.params.id)
            .populate('teacherId')
            .populate('slotId')
            .populate('classId');
        if (!attendance) {
            return res.status(404).json({ message: 'Attendance record not found' });
        }
        res.status(200).json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get attendance by teacher ID
exports.getAttendanceByTeacher = async (req, res) => {
    try {
        const attendance = await TeacherAttendance.find({ teacherId: req.params.teacherId })
            .populate('teacherId')
            .populate('slotId')
            .populate('classId');
        res.status(200).json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update attendance
exports.updateAttendance = async (req, res) => {
    try {
        const updatedAttendance = await TeacherAttendance.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedAttendance) {
            return res.status(404).json({ message: 'Attendance record not found' });
        }
        res.status(200).json(updatedAttendance);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Check existing attendance
exports.checkExistingAttendance = async (req, res) => {
    try {
        const { teacherId, classId, slotId, date } = req.body.params;

        // Validate required fields
        if (!teacherId || !classId || !slotId || !date) {
            return res.status(400).json({ message: 'Missing required query parameters' });
        }

        // Parse date range for the query
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);

        // Find attendance record
        const existingAttendance = await TeacherAttendance.findOne({
            teacherId,
            classId,
            slotId,
            date: { $gte: startDate, $lte: endDate },
        });

        if (existingAttendance) {
            return res.status(200).json({
                exists: true,
                attendance: existingAttendance,
            });
        }

        return res.status(200).json({
            exists: false,
        });
    } catch (error) {
        console.error('Error in checkExistingAttendance:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get attendance count by month and year
exports.getAttendanceCount = async (req, res) => {
    try {
        const { teacherId, month, year } = req.params;
        const count = await TeacherAttendance.aggregate([
            {
                $match: {
                    teacherId: new mongoose.Types.ObjectId(teacherId),
                    month: parseInt(month),
                    year: parseInt(year)
                }
            },
            {
                $group: {
                    _id: '$attendanceStatus',
                    count: { $sum: 1 }
                }
            }
        ]);
        
        const result = {
            Present: 0,
            Absent: 0,
            Leave: 0,
            total: 0
        };

        count.forEach(item => {
            result[item._id] = item.count;
            result.total += item.count;
        });

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
