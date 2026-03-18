const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    role: mongoose.ObjectId,
    name: String,
    email: String,
    contact: String,
    address: String,
    nif: Number,
    activity: String,
    company: String
});

module.exports = mongoose.model('User', userSchema);