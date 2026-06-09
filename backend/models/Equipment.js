const mongoose = require("mongoose");

const equipmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  price: {
    type: Number,
    required: true,
    default: 0
  },
});

module.exports = mongoose.model('Equipment', equipmentSchema);