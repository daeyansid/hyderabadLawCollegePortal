const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BranchAdminSchema = new Schema({
    fullName: { 
        type: String, 
        required: [true, "Full-Name is required"] 
    },
    phoneNumber: { 
        type: String, 
        required: [true, "Phone number is required"] 
    },
    cnicNumber: { 
        type: String, 
        required: [true, "CNIC number is required"] 
    },
    gender: {
        type: String,
        enum: ["Male", "Female"],
        required: [true, "Gender is required"]
    },
    address: {
        type: String,
        required: [true, "Address is required"]
    },
    joinDate: { 
        type: Date,
        default: Date.now, // Set default to the current date and time
        required: [true, "Join Date is required"]
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user',
        required: [true, "User ID is required"]
    },
    photo: {
        type: String,
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('BranchAdmin', BranchAdminSchema);
