const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    role: mongoose.ObjectId,
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    contact: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    nif: {
        type: String,
        required: true,
    },
    activity: String,
    company: String,
    suspended: Boolean,
});

module.exports = mongoose.model('User', userSchema);