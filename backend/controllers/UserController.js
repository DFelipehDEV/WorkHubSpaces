const User = require("../models/User");

exports.getId = async (req, res) => {
    const user = await User.findById(req.params.id).orFail(() => {
        return res.status(404).send({ message: "Couldn't find user" });
    }).select({
        password: false
    });

    return res.status(200).send(user);
};

exports.getAll = async (req, res) => {
    res.send(await User.find({}));
} 