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

        return res.status(200).send({ "message": "Space created", "id": space._id });
    } catch (err) {
        return res.status(400).send({ "message": err.message});
    }
}

exports.get = async (req, res) => {
    const space = await Space.findById(req.params.id).orFail(() => {
        return res.status(404).send({ message: "Couldn't find space" });
    });

    return res.status(200).send(space);
}

exports.update = async (req, res) => {
    try {
        const space = await Space.findById(req.params.id).orFail(() => {
            return res.status(404).send({ message: "Couldn't find space" });
        }).updateOne({
            type: req.body.type,
            available: req.body.available,
            description: req.body.description,
            capacity: req.body.capacity,
            pricePerHour: req.body.pricePerHour,
            images: req.body.images,
        });
        
        return res.status(200).send({ message: "Success" });
    } catch (err) {
        return res.status(400).send({ message: err.message });
    }
}

exports.delete = async (req, res) => {
    const space = await Space.findByIdAndDelete(req.params.id);
    if (!space) {
        return res.status(404).send({ message: "Space doesn't exist" });
    }

    return res.status(200).send({ message: "Success" });
}