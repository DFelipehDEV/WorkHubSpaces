const mongoose = require('mongoose');
const express = require('express');

const app = express();

const UserController = require('./controllers/UserController');
app.get('/users/:id', UserController.getId);

const AuthController = require('./controllers/AuthController');
app.post('/signin', express.json(), AuthController.signIn);
app.post('/login', express.json(), AuthController.login);

const ReservationController = require('./controllers/ReservationController');
app.get('/reservations/:id', ReservationController.getId);
app.post('/reservations', express.json(), ReservationController.create);

const SpaceController = require("./controllers/SpaceController");
app.post('/spaces', express.json(), SpaceController.create);

app.listen(process.env.PORT, () => {
    try {
        mongoose.connect(process.env.ATLAS_CONNECTION);
    } catch (ex) {
        console.log(ex.message);
    }
    console.log(`http://localhost:${process.env.PORT}`);
});