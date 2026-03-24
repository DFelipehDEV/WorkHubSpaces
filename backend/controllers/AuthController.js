const User = require("../models/User");
const bcrypt = require('bcryptjs');
exports.signIn = async (req, res) => {
    try {
        await User.create({
            role: "69aaab200457e0ba9d55fd1d",
            name: req.body.name,
            password: await bcrypt.hash(req.body.password, 8),
            email: req.body.email,
            contact: req.body.contact,
            address: req.body.address,
            nif: req.body.nif,
            activity: req.body.activity,
            company: req.body.company,
            suspended: false,
        });
        //TODO: criar e returnar jwt
        res.status(201).send("User created");
    } catch (err) {
        res.status(500).send(err.message);
    }
}

exports.login = async (req, res) => {
    try {
        const user = await User.findOne({
            email: req.body.email,
        }).orFail().exec();

        if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
            return res.status(500).send("User doesn't exist or the passord or/and the email are wrong");
        }

        if (user.suspended) {
            return res.status(500).send("User is suspended");
        }

        //TODO: enviar token jwt
        res.status(200).json({
            message: "Success",
            name: user.name,
        });
    } catch (err) {
        res.status(500).send(err.message);
    }
};