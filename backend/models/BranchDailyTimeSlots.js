// models/BranchDailyTimeSlots.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the possible slot types
const SLOT_TYPES = ['Class Slot', 'Break Slot'];

const branchDailyTimeSlotsSchema = new Schema(
    {
        branchId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Branch',
            required: [true, 'Branch ID is required.'],
        },
        branchClassDaysId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'BranchClassDays',
            required: [true, 'Branch Class Days ID is required.'],
        },
        slot: {
            type: String,
            required: [true, 'Slot time is required.'],
            trim: true,
        },
        slotType: {
            type: String,
            enum: {
                values: SLOT_TYPES,
                message: 'Slot Type must be either "Class Slot" or "Break Slot".',
            },
            required: [true, 'Slot Type is required.'],
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('BranchDailyTimeSlots', branchDailyTimeSlotsSchema);
