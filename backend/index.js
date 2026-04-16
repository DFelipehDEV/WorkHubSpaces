const mongoose = require('mongoose');
const express = require('express');

const app = express();

const userMiddleware = require('./middlewares/UserMiddleware');
const adminMiddleware = require('./middlewares/AdminMiddleware');

const UserController = require('./controllers/UserController');
app.get('/users/:id', userMiddleware, UserController.getId);
app.put('/users/:id', express.json(), userMiddleware, UserController.update);
app.delete('/users/:id', adminMiddleware, UserController.delete);
app.get('/users', adminMiddleware, UserController.getAll);

const AuthController = require('./controllers/AuthController');
app.post('/signin', express.json(), AuthController.signIn);
app.post('/login', express.json(), AuthController.login);
app.post('/forgotpassword', express.json(), AuthController.forgotPassword);
app.post('/resetpassword/:token', express.json(), AuthController.resetPassword);

const ReservationController = require('./controllers/ReservationController');
app.post('/reservations', express.json(), userMiddleware, ReservationController.create);
app.get('/reservations/:id', userMiddleware, ReservationController.get);
app.put('/reservations/:id', express.json(), adminMiddleware, ReservationController.update);
app.delete('/reservations/:id', adminMiddleware, ReservationController.delete);
app.get('/reservations', userMiddleware, ReservationController.getAll);

app.post('/reservations/:id/cancel', userMiddleware, ReservationController.cancel);

const SpaceController = require("./controllers/SpaceController");
app.post('/spaces', express.json(), adminMiddleware, SpaceController.create);
app.get('/spaces/:id', SpaceController.get);
app.put('/spaces/:id', express.json(), adminMiddleware, SpaceController.update);
app.delete('/spaces/:id', adminMiddleware, SpaceController.delete);
app.get('/spaces', SpaceController.getAll);
app.get('/spaces/:id/favorite', userMiddleware, SpaceController.favorite)
app.get('/spaces/:id/defavorite', userMiddleware, SpaceController.deFavorite)

const ExtraServiceController = require("./controllers/ExtraServiceController");
app.post('/extraservices', express.json(), adminMiddleware, ExtraServiceController.create);
app.get('/extraservices/:id', userMiddleware, ExtraServiceController.get);
app.put('/extraservices/:id', express.json(), adminMiddleware, ExtraServiceController.update);
app.delete('/extraservices/:id', adminMiddleware, ExtraServiceController.delete);
app.get('/extraservices', ExtraServiceController.getAll);

app.listen(process.env.PORT, () => {
    try {
        mongoose.connect(process.env.ATLAS_CONNECTION);
    } catch (ex) {
        console.log(ex.message);
    }
    console.log(`${process.env.BASE_URL}:${process.env.PORT}`);
});