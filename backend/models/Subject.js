const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subjectSchema = new Schema({
    sectionId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'section', 
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