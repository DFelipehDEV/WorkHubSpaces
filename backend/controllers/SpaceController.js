const Space = require('../models/Space');
exports.create = async (req, res) => {
    res.send(await Space.create({
        description: req.body.description,
        capacity: req.body.capacity,
        pricePerHour: req.body.pricePerHour,
        images: req.body.images,
    }));
}