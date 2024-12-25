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
    description: {
        type: String,
        required: true,
    },
    assignedTeachers: {
        type: [Schema.Types.ObjectId],
        ref: 'Teacher',
        required: false,
    },
    assignToAll: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('TeacherNotice', DiarySchema);
