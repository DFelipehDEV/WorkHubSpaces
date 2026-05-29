const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
  reservedBy: {
    type: mongoose.ObjectId,
    required: true,
  },
  spaceId: {
    type: mongoose.ObjectId,
    ref: 'Space',
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
    enum: [0, 1, 2, 3] // 0 - Pending, 1 - Cancelled, 2 - Confirmed, 3 - Finished
  },
  obs: String,
  internalObs: String,
  extraServices: [mongoose.ObjectId],
  cost: Number, // later used for reservation history, because the cost could change later
  equipments: [mongoose.ObjectId]
});

const Reservation = mongoose.model('Reservation', reservationSchema);

Reservation.ReservationStatuses = {
  Pending: 0,
  Cancelled: 1,
  Confirmed: 2,
  Finished: 3,
};

module.exports = Reservation;