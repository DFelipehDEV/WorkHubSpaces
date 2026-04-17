const Reservation = require('../models/Reservation');
const Notification = require('../models/Notification');

exports.create = async (req, res) => {
    try {
        const reservation = await Reservation.create({
            reservedBy: req.user.id,
            spaceId: req.body.spaceId,
            active: req.body.active,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            status: req.body.status,
            obs: req.body.obs,
            internalObs: "",
            extraServices: req.body.extraServices,
            cost: req.body.cost,
        });
        return res.status(201).json({ "message": "Reservation created", "id": reservation._id });
    } catch (err) {
        return res.status(400).json({ "message": err.message });
    }
}

exports.get = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id).orFail(() => {
            return res.status(404).json({ message: "Couldn't find reservation" });
        });

        return res.status(200).json(reservation);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
}

exports.update = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id).orFail(() => {
            return res.status(404).json({ message: "Couldn't find reservation" });
        });
        const oldStatus = reservation.status;
        reservation.updateOne(req.body).exec();

        if (req.body.status && oldStatus != req.body.status) {
            await Notification.create({
                to: reservation.reservedBy,
                level: Notification.NotificationLevels.Info,
                message: `Estado da reserva ${reservation.id} foi alterada`,
                //TODO: use frontend url
                link: `${process.env.BASE_URL}/reservations/${reservation.id}`
            });
        }

        return res.status(200).json({ message: "Success" });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
}

exports.delete = async (req, res) => {
    try {
        await Reservation.findByIdAndDelete(req.params.id).orFail(() => {
            return res.status(404).json({ message: "Couldn't find reservation" });
        });

        return res.status(200).json({ message: "Success" });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
}

exports.getAll = async (req, res) => {
    const page = req.query.page;
    const limit = req.query.limit;
    try {
        let reservations;
        if (page > 0 && limit > 0) {
            if (req.user.role == process.env.DB_ADMIN_ROLE_ID) {
                reservations = await Reservation.find({})
                                .limit(limit)
                                .skip((page - 1) * limit)
                                .exec();
            } else {
                reservations = await Reservation.find({ reservedBy: req.user.id })
                                .limit(limit)
                                .skip((page - 1) * limit)
                                .exec();
            }
        } else {
            if (req.user.role == process.env.DB_ADMIN_ROLE_ID) {
                reservations = await Reservation.find({});
            } else {
                reservations = await Reservation.find({ reservedBy: req.user.id });
            }
        }

        return res.status(200).json(reservations);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
}

exports.cancel = async (req, res) => {
    const reservation = await Reservation.findById(req.params.id).orFail(() => {
        return res.status(404).json({ message: "Couldn't find reservation" });
    });

    if (reservation.reservedBy == req.user.id || req.user.role == process.env.DB_ADMIN_ROLE_ID) {
        // console.log(reservation);
        if (reservation.status == Reservation.ReservationStatuses.Cancelled) {
            return res.status(400).json({ message: "This reservation is already cancelled" })
        }
        reservation.updateOne({
            status: Reservation.ReservationStatuses.Cancelled,
        }).exec();
        return res.status(200).json({ message: "Reservation was cancelled sucessfuly" });
    }
    return res.status(400).json({ message: "This reservation doesn't belong to this user" });
}

exports.getConfirmedDates = async (req, res) => {
    try {
        const reservations = await Reservation.find({ status: Reservation.ReservationStatuses.Confirmed }).select({ startDate: true, endDate: true}).exec();

        return res.status(200).json(reservations)
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
}