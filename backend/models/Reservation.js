const mongoose = require("mongoose");

exports.ReservationStatuses = {
    Pending: 0,
    Canceled: 1,
    Confirmed: 2,
    Finished: 3,
}

const reservationSchema = new mongoose.Schema({
    reservedBy: {
        type: mongoose.ObjectId,
        required: true,
    },
    spaceId: {
        type: mongoose.ObjectId,
        required: true,
    },
    active: {
        type: Boolean,
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    status: {
        type: Number,
        required: true,
        enum: [0, 1, 2, 3] // 0 - Pendente, 1 - Cancelada, 2 - Confirmada, 3 - Concluida
    },
    obs: String,
    internalObs: String,
    extraServices: [mongoose.ObjectId],
    cost: Number, // later used for reservation history, because the cost could change later
});

module.exports = mongoose.model('Reservation', reservationSchema);