const User = require("../models/User");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Nodemailer = require("nodemailer");
const { MailtrapTransport } = require("mailtrap");

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
        res.status(500).json({ message: err.message });
    }
}

exports.login = async (req, res) => {
    try {
        const user = await User.findOne({
            email: req.body.email,
        }).exec();

        if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
            return res.status(401).json({ message: "User doesn't exist or the password or/and the email are wrong" });
        }

        if (user.suspended) {
            return res.status(403).json({ message: "User is suspended" });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({
            message: "Success",
            token
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.forgotPassword = async (req, res) => {
    const user = await User.findOne({
        email: req.body.email,
    }).orFail(() => {
        return res.status(404).json({ message: "User doesn't exist" });
    }).exec();

    const transport = Nodemailer.createTransport(
        MailtrapTransport({
            token: process.env.MAILTRAP_TOKEN,
        })
    );

    const sender = {
        address: "workhubspaces@demomailtrap.co",
        name: "WorkHub Spaces",
    };

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });

    transport.sendMail({
        from: sender,
        to: user.email,
        subject: "Password Reset",
        text: `Olá ${user.name}, foi pedido para repor a palavra-passe para o email ${user.email}. Clique no link abaixo para repor a palavra-passe.
        localhost:3000/reset/${token}`,
        category: "Password Reset",
    });

    res.status(200).json({ message: "Success" });
}

exports.resetPassword = async (req, res) => {
    const token = req.params.token;
    console.log(token);

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({
            email: decoded.email,
        }).orFail(() => {
            return res.status(404).json({ message: "User doesn't exist" });
        }).exec();
        
        if (decoded.id == user._id) {
            user.password = await bcrypt.hash(req.body.password, 8);
            await user.save();
            return res.status(200).json({ message: "Password updated successfully" });
        } else {
            return res.status(401).json({ message: "Token is not valid for this user" });
        }
    } catch (err) {
        res.status(401).json({ message: err.message });
    }
}