const { Schema } = require("mongoose");

const Space = new Schema({
    description: String,
    capacity: Number,
    pricePerHour: Number,
    images: [String]
})