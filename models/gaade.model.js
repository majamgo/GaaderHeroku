const mongoose = require('mongoose');

const gaadeSchema = new mongoose.Schema({
    gaade: {
        type: String,
        required: true
    },
    svar: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Gaade', gaadeSchema);