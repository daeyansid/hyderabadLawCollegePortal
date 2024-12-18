const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sectionSchema = new Schema({
    sectionName: { 
        type: String, 
        required: [true, 'Section Name is required.'] 
    },
    maxNoOfStudents: { 
        type: Number, 
        required: [true, 'Max Number of Students is required.'] 
    },
    roomNumber: { 
        type: String, 
        required: [true, 'Room Number is required.'] 
    },
    startDate: { 
        type: Date, 
        required: [true, 'Start Date is required.'] 
    },
    endDate: { 
        type: Date, 
        required: [true, 'End Date is required.'] 
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
}, {
    timestamps: true,
});

module.exports = mongoose.model('section', sectionSchema);
