const ExtraService = require('../models/ExtraService');

exports.create = async (req, res) => {
    try {
        const extraService = await ExtraService.create({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            available: req.body.available
        });

        return res.status(201).json({ "message": "ExtraService created", "id": extraService._id });
    } catch (err) {
        return res.status(400).json({ "message": err.message});
    }
}

exports.get = async (req, res) => {
    const extraService = await ExtraService.findById(req.params.id).orFail(() => {
        return res.status(404).json({ message: "Couldn't find ExtraService" });
    });

    return res.status(200).json(extraService);
};

exports.update = async (req, res) => {
    try {
        const extraService = await ExtraService.findById(req.params.id).orFail(() => {
            return res.status(404).json({ message: "Couldn't find extraService" });
        }).updateOne({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            available: req.body.available
        });

        return res.status(200).json({ message: "Success" });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
}

exports.delete = async (req, res) => {
    const extraService = await ExtraService.findByIdAndDelete(req.params.id);
    if (!extraService) {
        return res.status(404).json({ message: "ExtraService doesn't exist" });
    }

    return res.status(200).json({ message: "Success" });
}

exports.getAll = async (req, res) => {
    const extraServices = await ExtraService.find({}).orFail(() => {
        return res.status(404).json({ message: "Couldn't find ExtraServices" });
    });

    return res.status(200).json(extraServices);
};