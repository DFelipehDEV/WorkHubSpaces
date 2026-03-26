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
        return res.status(201).send({ "message": "Reservation created", "id": reservation._id });
    } catch (err) {
        return res.status(400).send({ "message": err.message});
    }
}

exports.get = async (req, res) => {
    const reservation = await Reservation.findById(req.params.id).orFail(() => {
        return res.status(404).send({ message: "Couldn't find reservation" });
    });
    
    return res.status(200).send(reservation);
}

exports.update = async (req, res) => {
    try {
        //TODO: make it so if the user is admin, he can change the internal obs
        const reservation = await Reservation.findById(req.params.id).orFail(() => {
            return res.status(404).send({ message: "Couldn't find reservation" });
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

        return res.status(200).send({ message: "Success" });
    } catch (err) {
        return res.status(400).send({ message: err.message });
    }
}

exports.delete = async (req, res) => {
    const reservation = await Reservation.findByIdAndDelete(req.params.id);
    if (!reservation) {
        return res.status(404).send({ message: "Reservation doesn't exist" });
    }

    return res.status(200).send({ message: "Success" });
}