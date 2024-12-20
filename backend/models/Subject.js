const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subjectSchema = new Schema({
    classId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Class', 
        required: true 
    },
    subjectName: { 
        type: String, 
        required: [true, 'Field Name is required.'] 
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('subject', subjectSchema);