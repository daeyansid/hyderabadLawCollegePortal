const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BranchSchema = new Schema({
    branchName: {
        type: String,
        required: [true, "Branch name is required"]
    },
    branchAddress: {
        type: String,
        required: [true, "Branch Address is required"]
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BranchAdmin',
        required: [true, "Assigned to a Branch Admin is required"]
    },
    branchPhoneNumber: {
        type: String,
        required: [true, "Branch phone number is required"]
    },
    branchEmailAddress: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Branch', BranchSchema);
