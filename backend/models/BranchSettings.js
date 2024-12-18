const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BranchSettingSchema = new Schema({
    machineAttendance: { 
        type: Boolean, 
        required: [true, "Machine attendance is required"] 
    },
    dairy: { 
        type: Boolean, 
        required: [true, "Dairy is required"] 
    },
    startTime: { 
        type: String, 
        required: [true, "Start time is required"] 
    },
    endTime: { 
        type: String, 
        required: [true, "End time is required"] 
    },
    branchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branch',
        required: [true, "Branch ID is required"]
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('BranchSetting', BranchSettingSchema);
