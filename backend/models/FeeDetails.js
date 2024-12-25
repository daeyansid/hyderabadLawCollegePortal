const mongoose = require('mongoose');

const FeeDetailsSchema = new mongoose.Schema({
    admissionConfirmationFee: {
        type: Boolean,
        required: true
    },
    // prev fee data
    totalAdmissionFee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FeeMeta',
        required: true
    },
    semesterFeesTotal: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FeeMeta',
        required: true
    },

    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },

    classId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
        required: true
    },

    discount: {
        type: Number,
        default: 0,
        min: 0
    },
    semesterFeesPaid: {
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
    challanPicture: {
        type: String,
        required: false
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