const SpaceType = require('../models/SpaceType');

exports.create = async (req, res) => {
  try {
    const spaceType = await SpaceType.create(req.body);

    return res.status(201).json({ "message": "SpaceType created", "id": spaceType._id });
  } catch (err) {
    return res.status(400).json({ "message": err.message });
  }
}

exports.get = async (req, res) => {
  try {
    const spaceType = await SpaceType.findById(req.params.id).orFail(() => {
      return res.status(404).json({ message: "Couldn't find SpaceType" });
    });

    return res.status(200).json(spaceType);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

exports.update = async (req, res) => {
  try {
    await SpaceType.findByIdAndUpdate(req.params.id, req.body).orFail(() => {
      return res.status(404).json({ message: "Couldn't find spaceType" });
    });

    return res.status(200).json({ message: "Success" });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

exports.delete = async (req, res) => {
  try {
    await SpaceType.findByIdAndDelete(req.params.id).orFail(() => {
      return res.status(404).json({ message: "Couldn't find spaceType" });
    });

    return res.status(200).json({ message: "Success" });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

exports.getAll = async (req, res) => {
  try {
    const spaceTypes = await SpaceType.find({}).orFail(() => {
      return res.status(404).json({ message: "Couldn't find SpaceTypes" });
    })
    return res.status(200).json(spaceTypes);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};