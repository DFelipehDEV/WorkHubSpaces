const User = require("../models/User");

exports.getId = async (req, res) => {
    res.send(await User.findById(req.params.id).select({
        password: false
    }).exec());
};


exports.getAll = async (req, res) => {
    res.send(await User.find({}));
} 