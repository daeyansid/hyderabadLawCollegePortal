// models/Teacher.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const teacherSchema = new Schema({
    fullName: {
        type: String,
        required: [true, 'Full Name is required.']
    },
    cnicNumber: {
        type: String,
        required: [true, 'CNIC Number is required.']
    },
    phoneNumber: {
        type: String,
        required: [true, 'Phone Number is required.']
    },
    address: {
        type: String,
        required: [true, 'Address is required.']
    },
    gender: {
        type: String,
        required: [true, 'Gender is required.']
    },
    cast: {
        type: String,
        required: [true, 'Cast is required.']
    },
    basicSalary: {
        type: String,
        required: [true, 'Pay Per Hour is required.']
    },
    joinDate: {
        type: Date,
        required: [true, 'Join Date is required.']
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    branchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branch'
    },
    photo: {
        type: String,
    },
    natureOfAppointment: {
        type: String,
        enum: ['permanent', 'visiting'],
        required: [true, 'Nature of Appointment is required.']
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Teacher', teacherSchema);