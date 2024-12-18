const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClassSchema = new Schema({
    className: { 
        type: String, 
        required: [true, 'Class Name is required.'] 
    },
    description: { 
        type: String, 
        required: [true, 'Description is required.'] 
    },
    branchId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Branch', 
        required: true 
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Class', ClassSchema);
