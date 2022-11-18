// creating schema for user
const mongoose = require('mongoose');

var jobSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    skill1:{
        type: String,
        required: true
    },
    skill2: {
        type: String,
        required: true
    },
    image:{
        type: String,
        required: true
    }
});

// models define collection of the user and exporting it
module.exports = mongoose.model('job', jobSchema);