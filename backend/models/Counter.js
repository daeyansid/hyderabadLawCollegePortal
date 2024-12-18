const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const counterSchema = new Schema({
    key: {
        type: String,
        required: true,
        unique: true,
    },
    value: {
        type: Number,
        required: true,
    },
});

module.exports = mongoose.model('Counter', counterSchema);