// models/Diary.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DiarySchema = new Schema({
    date: {
        type: Date,
        required: true,
    },
    remarks: {
        type: String,
        required: false,
    },
    subject: {
        type: Schema.Types.ObjectId,
        ref: 'subject',
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    class: {
        type: Schema.Types.ObjectId,
        ref: 'Class',
        required: true,
    },
    section: {
        type: Schema.Types.ObjectId,
        ref: 'section',
        required: true,
    },
    assignedStudents: {
        type: [Schema.Types.ObjectId],
        ref: 'Student',
        required: false,
    },
    assignToAll: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Diary', DiarySchema);
