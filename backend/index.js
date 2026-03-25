const mongoose = require('mongoose');
const express = require('express');

const app = express();

const authMiddleware = require('./middlewares/AuthMiddleware');
const adminMiddleware = require('./middlewares/AdminMiddleware');

const UserController = require('./controllers/UserController');
app.get('/users/:id', authMiddleware, UserController.getId);

const AuthController = require('./controllers/AuthController');
app.post('/signin', express.json(), AuthController.signIn);
app.post('/login', express.json(), AuthController.login);

const ReservationController = require('./controllers/ReservationController');
app.get('/reservations/:id', authMiddleware, ReservationController.getId);
app.post('/reservations', express.json(), authMiddleware, ReservationController.create);

const SpaceController = require("./controllers/SpaceController");
app.post('/spaces', express.json(), adminMiddleware, SpaceController.create);
app.put('/spaces/update/:id', express.json(), adminMiddleware, SpaceController.update);

app.listen(process.env.PORT, () => {
    try {
        mongoose.connect(process.env.ATLAS_CONNECTION);
    } catch (ex) {
        console.log(ex.message);
    }
    console.log(`http://localhost:${process.env.PORT}`);
});