const Notification = require('../models/Notification');

exports.getAll = async (req, res) => {
  try {
    const notifications = await Notification.find({ to: req.user.id }).exec();
    return res.status(200).json(notifications);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    await Notification.findOneAndDelete({ _id: req.params.id, to: req.user.id }).orFail(() => {
      return res.status(404).json({ message: "Couldn't find notification" });
    });
    return res.status(200).json({ message: "Success" });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};
