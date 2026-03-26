const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
    reservedBy: mongoose.ObjectId,
    spaceId: mongoose.ObjectId,
    active: Boolean,
    startDate: Date,
    endDate: Date,
    status: {
        type: Number,
        required: true,
        enum: [0, 1, 2, 3] // 0 - Pendente, 1 - Cancelada, 2 - Confirmada, 3 - Concluida
    },
    obs: String,
    extraServices: [mongoose.ObjectId],
    cost: Number, // later used for reservation history, because the cost could change later
});

module.exports = mongoose.model('Reservation', reservationSchema);