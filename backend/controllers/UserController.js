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
} 