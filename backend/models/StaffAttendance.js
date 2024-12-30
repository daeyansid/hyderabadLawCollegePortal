const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const classAttendanceSingleSchema = new Schema({
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
    date: {
        type: Date,
        required: true,
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
    classId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
        required: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('ClassAttendanceTeacher', classAttendanceSingleSchema);
