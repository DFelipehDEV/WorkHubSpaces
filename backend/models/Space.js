const mongoose = require("mongoose");

const spaceSchema = new mongoose.Schema({
    description: String,
    capacity: Number,
    pricePerHour: Number,
    images: [String]
});

module.exports = mongoose.model('Space', spaceSchema);