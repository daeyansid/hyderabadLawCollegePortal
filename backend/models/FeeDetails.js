const mongoose = require('mongoose');

const FeeDetailsSchema = new mongoose.Schema({
    admissionConfirmationFee: {
        type: Boolean,
        required: true
    },
    totalAdmissionFee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FeeMeta',
        required: true
    },
    discount: {
        type: Number,
        default: 0,
        min: 0
    },
    semesterFeesTotal: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FeeMeta',
        required: true
    },
    semesterFeesPaid: {
        type: Number,
        default: 0,
        min: 0
    },
    semesterFeeDues: {
        type: Number,
        default: 0,
        min: 0
    },
    lateFeeSurcharged: {
        type: Number,
        default: 0,
        min: 0
    },
    otherPenalties: {
        type: Number,
        default: 0,
        min: 0
    },
    totalDues: {
        type: Number,
        default: 0,
        min: 0
    },
    challanPicture: {
        type: String,
        required: false
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('FeeDetails', FeeDetailsSchema);