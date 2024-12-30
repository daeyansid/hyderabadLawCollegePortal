const mongoose = require('mongoose');

const feeStructureLinkSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    totalAdmissionFee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FeeMeta',
        required: true
    },
    semesterFeesTotal: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FeeMeta',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('FeeStructureLink', feeStructureLinkSchema);
