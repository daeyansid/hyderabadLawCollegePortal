// models/BranchAdminLeave.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const leaveTypes = [
    'Casual Leave',
    'Sick Leave',
    'Half Day Leave',
    'Short Time Leave',
    'Hajj Leave',
    'Official Work Leave',
    'Personal Work Leave'
];

const branchAdminLeaveSchema = new Schema({
    branchAdminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BranchAdmin',
        required: [true, 'Branch Admin ID is required.']
    },
    leaveStartDate: {
        type: Date,
        required: [true, 'Leave start date is required.']
    },
    leaveEndDate: {
        type: Date,
        required: [true, 'Leave end date is required.']
    },
    totalLeaveDays: {
        type: Number,
        required: true,
        default: 1,
        validate: {
            validator: function(value) {
                // Ensure totalLeaveDays is at least 1
                return value >= 1;
            },
            message: 'Total leave days must be at least 1.'
        }
    },
    leaveReason: {
        type: String,
        enum: leaveTypes,
        required: [true, 'Leave reason is required.']
    },
    description: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    doc: {
        type: String, 
        default: ''
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('BranchAdminLeave', branchAdminLeaveSchema);
