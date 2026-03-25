const Space = require('../models/Space');
exports.create = async (req, res) => {
    res.send(await Space.create({
        description: req.body.description,
        capacity: req.body.capacity,
        pricePerHour: req.body.pricePerHour,
        images: req.body.images,
    }));
}

exports.update = async (req, res) => {
    res.send(await Space.findById(req.params.id).updateOne({
        description: req.body.description,
        capacity: req.body.capacity,
        pricePerHour: req.body.pricePerHour,
        images: req.body.images,
    }));
}