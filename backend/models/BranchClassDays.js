// models/BranchClassDays.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { DAYS_OF_WEEK } = require('../utils/constants');

const branchClassDaysSchema = new Schema({
    branchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branch',
        required: [true, 'Branch ID is required.']
    },
    day: {
        type: String,
        enum: {
            values: DAYS_OF_WEEK,
            message: 'Day must be a valid day of the week.'
        },
        required: [true, 'Day is required.']
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('BranchClassDays', branchClassDaysSchema);
