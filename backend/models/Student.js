const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSchema = new Schema({
    // sec-1 (Student Info)
    fullName: { 
        type: String, 
        required: [true, 'Full Name is required.'] 
    },
    admissionClass: { 
        type: String, 
        required: [true, 'Admission sought to class is required.'] 
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
    rollNumber: {
        type: String,
        required: true,
        unique: true,
    },
    batchYear: {
        type: Number,
        required: true,
    },

    // sec-5 (Student User Info)
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user', 
        required: true 
    },

    // sec-6 (fee and class)
    monthlyFees: { 
        type: Number, 
        required: [true, 'Monthly Fees is required.'] 
    },
    admissionFees: { 
        type: Number, 
        default: null 
    },
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
    sectionId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'section', 
        required: true 
    },
}, {
    timestamps: true,
});


module.exports = mongoose.model('Student', studentSchema);
