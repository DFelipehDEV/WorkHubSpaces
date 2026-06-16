const User = require("../models/User");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { MailtrapClient } = require("mailtrap");

exports.signUp = async (req, res) => {
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

        const isProd = process.env.NODE_ENV === "production";
        res.cookie("Authorization", "Bearer " + token, {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: isProd ? "none" : "lax",
            secure: isProd,
        })

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

    try {
        const client = new MailtrapClient({
            token: process.env.MAILTRAP_TOKEN,
        });

        const sender = {
            email: "workhubspaces@demomailtrap.co",
            name: "WorkHub Spaces",
        };

        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '10m' });

        await client.send({
            from: sender,
            to: [{ email: user.email }],
            subject: "Password Reset",
            text:
                `
            Olá ${user.name}, 
            foi pedido para repor a palavra-passe para o email ${user.email}. 
            Clique no link para repor a palavra-passe. 
            ${process.env.FRONTEND_URL}/reset-password/${token} 
            Após 10 minutos, o link deixara de ser valido.
            `,
            category: "Password Reset",
        });

        res.status(200).json({ message: "Success" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
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

exports.validateHeaderToken = async (req, res) => {
    const authorization = req.cookies.Authorization || req.cookies.authorization;
    if (authorization == undefined) return res.status(400).json( {message: "authorization is missing"});

    let token = authorization;
    if (authorization.startsWith('Bearer ')) {
        token = authorization.split(' ')[1];
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }
        res.status(200).json( {message: "Success"} )
    });
};

exports.logout = async (req, res) => {
    res.clearCookie("Authorization");
    return res.status(200).json({ message: "Success" });
};