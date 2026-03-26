const ExtraService = require('../models/ExtraService');

exports.create = async (req, res) => {
    res.send(await ExtraService.create({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        available: req.body.available
    }));
}

exports.get = async (req, res) => {
    res.send(await ExtraService.findById(req.params.id).select({
    }).exec());
};

exports.update = async (req, res) => {
    //TODO: validate field types
    res.send(await ExtraService.findById(req.params.id).updateOne({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        available: req.body.available
    }));
}