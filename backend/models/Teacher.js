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
        required: [true, 'Basic Salary is required.']
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
    teacherId: {
        type: String,
        unique: true,
        required: [true, 'Teacher ID is required.']
    },
    photo: {
        type: String,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Teacher', teacherSchema);
