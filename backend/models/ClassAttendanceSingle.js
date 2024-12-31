const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const classAttendanceSingleSchema = new Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true,
    },
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
    studentRollNumber: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
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
    classId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
        required: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('ClassAttendanceSingle', classAttendanceSingleSchema);