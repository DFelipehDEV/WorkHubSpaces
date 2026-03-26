const mongoose = require("mongoose");

const spaceSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
    },
    available: {
        type: Boolean,
        required: true,
    },
    description: String,
    capacity: {
        type: Number,
        required: true,
    },
    pricePerHour: Number,
    images: [String],
    // reviews
});

module.exports = mongoose.model('Space', spaceSchema);