// models/StaffLeave.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const staffLeaveSchema = new Schema({
    staffId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Staff', // Reference to the Staff table
        required: [true, 'Staff ID is required'],
    },
    branchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branch', // Reference to the Branch table
        required: [true, 'Branch ID is required'],
    },
    leaveStartDate: {
        type: Date,
        required: [true, 'Leave start date is required'],
    },
    leaveEndDate: {
        type: Date,
        required: [true, 'Leave end date is required'],
    },
    totalLeaveDays: {
        type: Number,
        min: 1, // Ensures at least one day of leave
        required: [true, 'Total leave days are required'],
    },
    leaveReason: {
        type: String,
        enum: ['Casual Leave', 'Sick Leave', 'Half Day Leave', 'Short Time Leave', 'Hajj Leave', 'Official Work Leave', 'Personal Work Leave'],
        required: [true, 'Leave reason is required'],
    },
    description: {
        type: String,
        default: '', // Optional description
    },
    status: {
        type: String,
        enum: ['Approved', 'Pending', 'Rejected'],
        default: 'Approved', // Default status to approved
    },
    doc: {
        type: String, // Path to the uploaded document (optional)
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('StaffLeave', staffLeaveSchema);
