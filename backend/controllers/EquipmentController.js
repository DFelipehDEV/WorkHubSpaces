const Equipment = require('../models/Equipment');

exports.create = async (req, res) => {
  try {
    const equipment = await Equipment.create(req.body);

    return res.status(201).json({ "message": "Equipment created", "id": equipment._id });
  } catch (err) {
    return res.status(400).json({ "message": err.message });
  }
}

exports.get = async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id).orFail(() => {
      return res.status(404).json({ message: "Couldn't find Equipment" });
    });

    return res.status(200).json(equipment);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

exports.update = async (req, res) => {
  try {
    await Equipment.findByIdAndUpdate(req.params.id, req.body).orFail(() => {
      return res.status(404).json({ message: "Couldn't find equipment" });
    });

    return res.status(200).json({ message: "Success" });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

exports.delete = async (req, res) => {
  try {
    await Equipment.findByIdAndDelete(req.params.id).orFail(() => {
      return res.status(404).json({ message: "Couldn't find equipment" });
    });

    return res.status(200).json({ message: "Success" });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

exports.getAll = async (req, res) => {
  const page = req.query.page;
  const limit = req.query.limit;
  let equipments;
  try {
    if (page > 0 && limit > 0) {
      equipments = await Equipment.find({}).orFail(() => {
        return res.status(404).json({ message: "Couldn't find Equipments" });
      })
        .limit(limit)
        .skip((page - 1) * limit)
        .exec();
    } else {
      equipments = await Equipment.find({}).orFail(() => {
        return res.status(404).json({ message: "Couldn't find Equipments" });
      });
    }

    return res.status(200).json(equipments);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};