const User = require("../models/User");

exports.getId = async (req, res) => {
    const user = await User.findById(req.params.id).orFail(() => {
        return res.status(404).json({ message: "Couldn't find user" });
    }).select({
        password: false
    });

    return res.status(200).json(user);
};

exports.getAll = async (req, res) => {
    res.json(await User.find({}));
} 