const Reservation = require('../models/Reservation');

exports.getId = async (req, res) => {
    res.send(await Reservation.findById(req.params.id).exec());
}

exports.create = async (req, res) => {
    res.send(await Reservation.create({
        reservedBy: req.user.id,
        spaceId: req.body.spaceId,
        active: req.body.active,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        status: req.body.status,
        obs: req.body.obs,
        extraServices: req.body.extraServices
    }));
}