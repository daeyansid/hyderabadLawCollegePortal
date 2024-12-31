const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSchema = new Schema({
    // sec-1 (Student Info)
    fullName: { 
        type: String, 
        required: [true, 'Full Name is required.']
    },
    fatherName: { 
        type: String, 
        required: [true, 'Father Name is required.'] 
    },
    cnic: { 
        type: String, 
        required: [true, 'CNIC is required.'] 
    },
    castSurname: { 
        type: String, 
        required: [true, 'Cast/Surname is required.'] 
    },
    religion: { 
        type: String, 
        required: [true, 'Religion is required.'] 
    },
    nationality: { 
        type: String, 
        required: [true, 'Nationality is required.'] 
    },
    dateOfBirth: { 
        type: Date, 
        required: [true, 'Date of Birth is required.'] 
    },
    placeOfBirth: { 
        type: String, 
        required: [true, 'Place of Birth is required.'] 
    },
    gender: { 
        type: String, 
        enum: ['Male', 'Female'], 
        required: [true, 'Gender is required.'] 
    },
    permanentAddress: { 
        type: String, 
        required: [true, 'Permanent Address is required.'] 
    },
    emergencyContactPerson: { 
        type: String, 
        required: [true, 'Emergency Contact Person is required.'] 
    },
    emergencyPhoneNumber: { 
        type: String, 
        required: [true, 'Emergency Phone No is required.'] 
    },
    photo: {
        type: String,
        required: false,
    },

    // sec-2 (Student User Info)
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user', 
        required: true 
    },

    // sec-3 (class)
    branchId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Branch', 
        required: true 
    },
    classId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Class', 
        required: true 
    },
    latMarks: { 
        type: String, 
        required: [true, 'Lat Marks is required.'] 
    },
    rollNumber: {
        type: String,
        required: true,
        unique: true,
    },
    batchYear: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true,
});


module.exports = mongoose.model('Student', studentSchema);
