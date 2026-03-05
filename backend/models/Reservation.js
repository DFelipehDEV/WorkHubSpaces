const { Schema } = require("mongoose");

const Reservation = new Schema({
    spaceId: ObjectId,
    startDate: Date,
    endDate: Date,
    status: Number,
    obs: String,
});