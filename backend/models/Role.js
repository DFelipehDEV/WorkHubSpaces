const { Schema, default: mongoose } = require("mongoose");

const roleSchema = new Schema({
  name: String,
});

module.exports = mongoose.model('Role', roleSchema);;