const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
mongoose.connect(process.env.ATLAS_CONNECTION);

const router = express();
const urlencodedParser = bodyParser.urlencoded();

const User = require('./models/User');
router.get('/users/:id', async (req, res) => {
    res.send(await User.findById(req.params.id).select({
        password: false
    }).exec());
});

const bcrypt = require('bcryptjs');
router.post('/users', urlencodedParser, async (req, res) => {
    try {
        await User.create({
            role: req.body.role,
            name: req.body.name,
            password: await bcrypt.hash(req.body.password, 8),
            email: req.body.email,
            contact: req.body.contact,
            address: req.body.address,
            nif: req.body.nif,
            activity: req.body.activity,
            company: req.body.company,
            suspended: req.body.suspended,
        });
        //TODO: criar e returnar jwt
        res.status(201).send("User created");
    } catch (err) {
        res.status(500).send(err.message);
    }
});

const Reservation = require('./models/Reservation');
router.get('/reservations/:id', async (req, res) => {
    res.send(await Reservation.findById(req.params.id).exec());
});
router.post('/reservations', urlencodedParser, async (req, res) => {
    res.send(await Reservation.create({
        reservedBy: req.body.reservedBy,
        spaceId: req.body.spaceId,
        active: req.body.active,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        status: req.body.status,
        obs: req.body.obs,
        extraServices: req.body.extraServices
    }));
});

const Space = require('./models/Space');
router.post('/spaces', urlencodedParser, async (req, res) => {
    res.send(await Space.create({
        description: req.body.description,
        capacity: req.body.capacity,
        pricePerHour: req.body.pricePerHour,
        images: req.body.images,
    }));
});

router.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`)
});