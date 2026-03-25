const Space = require('../models/Space');
exports.create = async (req, res) => {
    res.send(await Space.create({
        available: req.body.available,
        description: req.body.description,
        capacity: req.body.capacity,
        pricePerHour: req.body.pricePerHour,
        images: req.body.images,
    }));
}

exports.update = async (req, res) => {
    //TODO: validate field types
    res.send(await Space.findById(req.params.id).updateOne({
        available: req.body.available,
        description: req.body.description,
        capacity: req.body.capacity,
        pricePerHour: req.body.pricePerHour,
        images: req.body.images,
    }));
}