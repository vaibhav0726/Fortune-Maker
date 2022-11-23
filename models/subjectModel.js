// creating schema for user
const mongoose = require('mongoose');

var subjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
        default: '',
    },
    is_verified: {
        type: Number,
        default: 0
    },
    user_name:{
        type: String,
        required: true,
        default: '',
    }
});

// models define collection of the user and exporting it
module.exports = mongoose.model('subjects', subjectSchema);