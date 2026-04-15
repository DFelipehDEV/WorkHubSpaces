const mongoose = require("mongoose");

const spaceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
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
    favoritedBy: [mongoose.ObjectId],
    // reviews
});

module.exports = mongoose.model('Space', spaceSchema);