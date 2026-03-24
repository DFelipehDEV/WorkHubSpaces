const mongoose = require('mongoose');
const express = require('express');

const app = express();

mongoose.connect(process.env.ATLAS_CONNECTION);

const UserController = require('./controllers/UserController');
app.get('/users/:id', UserController.getId);

const AuthController = require('./controllers/AuthController');
app.post('/signin', express.urlencoded(), AuthController.signIn);
app.post('/login', express.urlencoded(), AuthController.login);

const ReservationController = require('./controllers/ReservationController');
app.get('/reservations/:id', ReservationController.getId);
app.post('/reservations', express.urlencoded(), ReservationController.create);

const SpaceController = require("./controllers/SpaceController");
app.post('/spaces', express.urlencoded(), SpaceController.create);

app.listen(process.env.PORT, () => {
    console.log(`http://localhost:${process.env.PORT}`)
});