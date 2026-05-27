const User = require("../models/User");

exports.getId = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).orFail(() => {
      return res.status(404).json({ message: "Couldn't find user" });
    }).select({
      password: false
    });

    return res.status(200).json(user);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

exports.getAll = async (req, res) => {
  const page = req.query.page;
  const limit = req.query.limit;
  try {
    if (page > 0 && limit > 0) {
      return res.status(200).json(
        await User.find({})
          .select({
            password: false
          })
          .limit(limit)
          .skip((page - 1) * limit)
          .exec()
      );
    }

    return res.status(200).json(
      await User.find({})
        .select({
          password: false
        })
    );
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    if (req.user.id !== req.params.id && req.user.role != process.env.DB_ADMIN_ROLE_ID) {
      return res.status(403).json({ message: "You don't have permission to update this user" });
    }

    if (req.body.suspended !== undefined && req.user.role != process.env.DB_ADMIN_ROLE_ID) {
      return res.status(403).json({ message: "Only admins can suspend users" });
    }

    if (req.body.role && req.user.role != process.env.DB_ADMIN_ROLE_ID) {
      return res.status(403).json({ message: "Only admins can change roles" });
    }

    delete req.body.password;

    await User.findByIdAndUpdate(req.params.id, req.body).orFail(() => {
      return res.status(404).json({ message: "Couldn't find user" });
    });

    return res.status(200).json({ message: "Success" });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id).orFail(() => {
      return res.status(404).json({ message: "Couldn't find user" });
    });

    return res.status(200).json({ message: "Success" });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};