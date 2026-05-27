const mongoose = require("mongoose");

const spaceTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('SpaceType', spaceTypeSchema);