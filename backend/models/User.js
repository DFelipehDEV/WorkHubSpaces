const { Schema } = require("mongoose");

const User = new Schema({
    id: Number,
    name: String,
    email: String,
    contact: String,
    address: String,
    nif: Number,
    activity: String,
    company: String
});