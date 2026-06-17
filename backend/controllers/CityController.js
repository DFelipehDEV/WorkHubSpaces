const City = require('../models/City');

exports.create = async (req, res) => {
  try {
    const city = await City.create(req.body);
    return res.status(201).json(city);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

exports.get = async (req, res) => {
  try {
    const city = await City.findById(req.params.id).orFail();
    return res.status(200).json(city);
  } catch (err) {
    return res.status(404).json({ message: "City not found" });
  }
}

exports.update = async (req, res) => {
  try {
    await City.findByIdAndUpdate(req.params.id, req.body).orFail();
    return res.status(200).json({ message: "Success" });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

exports.delete = async (req, res) => {
  try {
    await City.findByIdAndDelete(req.params.id).orFail();
    return res.status(200).json({ message: "Success" });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

exports.getAll = async (req, res) => {
  try {
    const cities = await City.find().sort({ name: 1 });
    return res.status(200).json(cities);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}
