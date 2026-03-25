const User = require("../models/User");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
exports.signIn = async (req, res) => {
    try {
        const user = await User.create({
            role: process.env.DB_CLIENT_ROLE_ID,
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

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(201).json({ message: "User created", token });
    } catch (err) {
        res.status(500).send(err.message);
    }
}

exports.login = async (req, res) => {
    try {
        const user = await User.findOne({
            email: req.body.email,
        }).exec();

        if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
            return res.status(500).send("User doesn't exist or the passord or/and the email are wrong");
        }

        if (user.suspended) {
            return res.status(500).send("User is suspended");
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({
            message: "Success",
            name: user.name,
            token
        });
    } catch (err) {
        res.status(500).send(err.message);
    }
};