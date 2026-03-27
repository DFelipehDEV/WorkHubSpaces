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
    res.json(await User.find({}));
} 