const mongoose = require('mongoose');

const StudentPerformanceSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    classId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
        required: true
    },
    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subject',
        required: true
    },
    totalMarks: {
        type: Number,
        default: 40
    },
    midTermPaperMarks: {
        type: Number,
        required: true,
        min: 0,
        max: 20
    },
    assignmentPresentationMarks: {
        type: Number,
        required: true,
        min: 0,
        max: 10
    },
    attendanceMarks: {
        type: Number,
        required: true,
        min: 0,
        max: 10
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('StudentTest', StudentPerformanceSchema);