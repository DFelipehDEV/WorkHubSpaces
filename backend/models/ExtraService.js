const mongoose = require("mongoose");

const extraServiceSchema = new mongoose.Schema({
  // type: Number, // Impressoes/Coffee Break/Equipamento audiovisual/cacifo temporario
  name: {
    type: String,
    required: true,
  },
  description: String,
  price: {
    type: Number,
    required: true,
  },
  available: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model('ExtraService', extraServiceSchema);