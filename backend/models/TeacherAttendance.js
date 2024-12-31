// models/TeacherAttendance.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const teacherAttendanceSchema = new Schema({
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true,
    },
    slotId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ClassSlotAssignments',
        required: true,
    },
    classId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
        required: true,
    },
    date: {
        type: Date,
        required: true,
        default: () => new Date(new Date().toISOString().split('T')[0]), // Sets default to current date at midnight UTC
    },
    staffStatus: {
        type: String,
        enum: ['Teacher', 'Other'],
        required: true,
        default: 'Teacher',
    },
    attendanceStatus: {
        type: String,
        enum: ['Leave', 'Present', 'Absent'],
        required: true,
    },
    month: {
        type: Number,
        required: true,
        min: 1,
        max: 12,
    },
    year: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true,
});

// Pre-save middleware to set month and year based on date
teacherAttendanceSchema.pre('save', function(next) {
    const attendance = this;
    const attendanceDate = attendance.date;
    attendance.month = attendanceDate.getMonth() + 1; // Months are zero-indexed
    attendance.year = attendanceDate.getFullYear();
    next();
});

// Adding indexes for performance
teacherAttendanceSchema.index({ date: 1, teacherId: 1, staffStatus: 1 });

module.exports = mongoose.model('TeacherAttendance', teacherAttendanceSchema);
