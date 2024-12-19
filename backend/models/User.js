const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: { 
        type: String, 
        required: [true, "Email is required"], 
        unique: true 
    },
    password: { 
        type: String, 
        required: [true, "Password is required"] 
    },
    userRole: {
        type: String,
        enum: ["branchAdmin", "teacher", "student"],
        required: [true, "User Role is required"]
    },
    isActive: { 
        type: Boolean, 
        default: true
    },
    lastLogin: {
        type: Date,
        default: null
    },
}, {
    timestamps: true,
});

// Avoid redefinition of model
module.exports = mongoose.models.user || mongoose.model('user', UserSchema);
