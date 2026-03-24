const mongoose = require('mongoose');
const express = require('express');

const app = express();

const authMiddleware = require('./middlewares/Auth');

const UserController = require('./controllers/UserController');
app.get('/users/:id', authMiddleware, UserController.getId);

const AuthController = require('./controllers/AuthController');
app.post('/signin', express.json(), AuthController.signIn);
app.post('/login', express.json(), AuthController.login);

const ReservationController = require('./controllers/ReservationController');
app.get('/reservations/:id', authMiddleware, ReservationController.getId);
app.post('/reservations', express.json(), authMiddleware, ReservationController.create);

const SpaceController = require("./controllers/SpaceController");
app.post('/spaces', express.json(), authMiddleware, SpaceController.create);

app.listen(process.env.PORT, () => {
    try {
        mongoose.connect(process.env.ATLAS_CONNECTION);
    } catch (ex) {
        console.log(ex.message);
    }
    console.log(`http://localhost:${process.env.PORT}`);
});