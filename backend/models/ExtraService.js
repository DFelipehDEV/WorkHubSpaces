const mongoose = require("mongoose");

const extraServiceSchema = new Schema({
    // type: Number, // Impressoes/Coffee Break/Equipamento audiovisual/cacifo temporario
    name: String,
    description: String,
    price: Number,
    available: Boolean,
});

module.exports = mongoose.model('ExtraService', extraServiceSchema);