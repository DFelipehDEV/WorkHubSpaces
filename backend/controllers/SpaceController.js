const Space = require('../models/Space');
exports.create = async (req, res) => {
    try {
        const space = await Space.create({
            type: req.body.type,
            available: req.body.available,
            description: req.body.description,
            capacity: req.body.capacity,
            pricePerHour: req.body.pricePerHour,
            images: req.body.images,
        });

        return res.status(201).json({ "message": "Space created", "id": space._id });
    } catch (err) {
        return res.status(400).json({ "message": err.message });
    }
}

exports.get = async (req, res) => {
    try {
        const space = await Space.findById(req.params.id).orFail(() => {
            return res.status(404).json({ message: "Couldn't find space" });
        });

        return res.status(200).json(space);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
}

exports.update = async (req, res) => {
    try {
        await Space.findById(req.params.id).orFail(() => {
            return res.status(404).json({ message: "Couldn't find space" });
        }).updateOne({
            type: req.body.type,
            available: req.body.available,
            description: req.body.description,
            capacity: req.body.capacity,
            pricePerHour: req.body.pricePerHour,
            images: req.body.images,
        });

        return res.status(200).json({ message: "Success" });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
}

exports.delete = async (req, res) => {
    try {
        await Space.findByIdAndDelete(req.params.id).orFail(() => {
            return res.status(404).json({ message: "Couldn't find space" });
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
        if (page > 0 && limit > 0) {
            return res.status(200).json(
                await Space.find({})
                .limit(limit)
                .skip((page - 1) * limit)
                .exec()
            );
        }
        
        return res.status(200).json(
            await Space.find({})
        );
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
} 