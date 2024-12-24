const mongoose = require('mongoose');

const FeeSchema = new mongoose.Schema({
    semesterFee: {
        type: Number,
        required: true,
        min: [1, 'Semester Fee must be greater than 0'],
        validate: {
            validator: function(v) {
                return Number.isInteger(v) && v > 0;
            },
            message: 'Semester Fee must be a positive integer greater than 0'
        }
    },
    admissionFee: {
        type: Number,
        required: true,
        min: [1, 'Admission Fee must be greater than 0'],
        validate: {
            validator: function(v) {
                return Number.isInteger(v) && v > 0;
            },
            message: 'Admission Fee must be a positive integer greater than 0'
        }
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

module.exports = mongoose.model('FeeMeta', FeeSchema);