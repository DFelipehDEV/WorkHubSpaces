const ExtraService = require('../models/ExtraService');

exports.create = async (req, res) => {
    try {
        const extraService = await ExtraService.create(req.body);

        return res.status(201).json({ "message": "ExtraService created", "id": extraService._id });
    } catch (err) {
        return res.status(400).json({ "message": err.message });
    }
}

exports.get = async (req, res) => {
    try {
        const extraService = await ExtraService.findById(req.params.id).orFail(() => {
            return res.status(404).json({ message: "Couldn't find ExtraService" });
        });

        return res.status(200).json(extraService);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
}

exports.update = async (req, res) => {
    try {
        await ExtraService.findByIdAndUpdate(req.params.id, req.body).orFail(() => {
            return res.status(404).json({ message: "Couldn't find extraService" });
        });

        return res.status(200).json({ message: "Success" });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
}

exports.delete = async (req, res) => {
    try {
        await ExtraService.findByIdAndDelete(req.params.id).orFail(() => {
            return res.status(404).json({ message: "Couldn't find extraService" });
        });

        return res.status(200).json({ message: "Success" });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
}

exports.getAll = async (req, res) => {
    const page = req.query.page;
    const limit = req.query.limit;
    let extraServices;
    try {
        if (page > 0 && limit > 0) {
            extraServices = await ExtraService.find({}).orFail(() => {
                return res.status(404).json({ message: "Couldn't find ExtraServices" });
            })
            .limit(limit)
            .skip((page - 1) * limit);
        } else {
            extraServices = await ExtraService.find({}).orFail(() => {
                return res.status(404).json({ message: "Couldn't find ExtraServices" });
            });
        }

        return res.status(200).json(extraServices);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};