const Reservation = require('../models/Reservation');

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
        return res.status(400).json({ "message": err.message});
    }
}

exports.get = async (req, res) => {
    const reservation = await Reservation.findById(req.params.id).orFail(() => {
        return res.status(404).json({ message: "Couldn't find reservation" });
    });
    
    return res.status(200).json(reservation);
}

exports.update = async (req, res) => {
    try {
        //TODO: make it so if the user is admin, he can change the internal obs
        await Reservation.findById(req.params.id).orFail(() => {
            return res.status(404).json({ message: "Couldn't find reservation" });
        }).updateOne({
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

        return res.status(200).json({ message: "Success" });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
}

exports.delete = async (req, res) => {
    const reservation = await Reservation.findByIdAndDelete(req.params.id);
    if (!reservation) {
        return res.status(404).json({ message: "Reservation doesn't exist" });
    }

    return res.status(200).json({ message: "Success" });
}

exports.getAll = async (req, res) => {
    let reservations;
    if (req.user.role == process.env.DB_ADMIN_ROLE_ID) {
        reservations = await Reservation.find({ }).exec();
    } else {
        reservations = await Reservation.find({ reservedBy: req.user.id }).exec();
    }
    return res.status(200).json(reservations);
} 

exports.cancel = async (req, res) => {
    const reservation = await Reservation.findById(req.params.id).orFail(() => {
        return res.status(404).json({ message: "Couldn't find reservation" });
    });

    if (reservation.reservedBy == req.user.id || req.user.role == process.env.DB_ADMIN_ROLE_ID) {
        // console.log(reservation);
        if (reservation.status == Reservation.ReservationStatuses.Canceled) {
            return res.status(400).json({ message: "This reservation is already canceled"})
        }
        reservation.updateOne({
            status: Reservation.ReservationStatuses.Canceled,
        }).exec();
        return res.status(200).json({ message: "Reservation was cancelled sucessfuly"});
    }
    return res.status(400).json({ message: "This reservation doesn't belong to this user" });
}