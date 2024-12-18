// models/ClassSlotAssignments.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the possible class types
const CLASS_TYPES = ['Main Class', 'Subject Class'];

// Define the possible slot types
const SLOT_TYPES = ['Class Slot', 'Break Slot'];

const classSlotAssignmentsSchema = new Schema(
    {
        branchClassDaysId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'BranchClassDays',
            required: [true, 'Branch Class Days ID is required.'],
        },
        branchDailyTimeSlotsId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'BranchDailyTimeSlots',
            required: [true, 'Branch Daily Time Slots ID is required.'],
        },
        classId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Class',
            required: [true, 'Class ID is required.'],
        },
        sectionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'section',
            required: [true, 'Section ID is required.'],
        },
        subjectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'subject',
            required: [true, 'Subject ID is required.'],
        },
        teacherId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Teacher',
            required: [true, 'Teacher ID is required.'],
        },
        classType: {
            type: String,
            enum: {
                values: CLASS_TYPES,
                message: 'Class Type must be either "Main Class" or "Subject Class".',
            },
            required: [true, 'Class Type is required.'],
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

module.exports = mongoose.model('ClassSlotAssignments', classSlotAssignmentsSchema);
