const mongoose = require('mongoose');
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  allowedHeaders: [
    "set-cookie",
    "Content-Type",
    "Access-Control-Allow-Origin",
    "Access-Control-Allow-Credentials",
    "Authorization",
    "authorization",
  ],
}));

const userMiddleware = require('./middlewares/UserMiddleware');
const adminMiddleware = require('./middlewares/AdminMiddleware');

const UserController = require('./controllers/UserController');
app.get('/users/:id', userMiddleware, UserController.getId);
app.put('/users/:id', express.json(), userMiddleware, UserController.update);
app.delete('/users/:id', adminMiddleware, UserController.delete);
app.get('/users', adminMiddleware, UserController.getAll);
app.get('/profile', userMiddleware, UserController.getProfile);
app.put('/profile', express.json(), userMiddleware, UserController.updateProfile);

const AuthController = require('./controllers/AuthController');
app.post('/signup', express.json(), AuthController.signUp);
app.post('/login', express.json(), AuthController.login);
app.post('/forgotpassword', express.json(), AuthController.forgotPassword);
app.post('/resetpassword/:token', express.json(), AuthController.resetPassword);
app.get('/validate-token', AuthController.validateHeaderToken);
app.get('/logout', AuthController.logout);

const EquipmentController = require("./controllers/EquipmentController");
app.post('/equipments', express.json(), adminMiddleware, EquipmentController.create);
app.get('/equipments/:id', userMiddleware, EquipmentController.get);
app.put('/equipments/:id', express.json(), adminMiddleware, EquipmentController.update);
app.delete('/equipments/:id', adminMiddleware, EquipmentController.delete);
app.get('/equipments', EquipmentController.getAll);

const ReservationController = require('./controllers/ReservationController');
app.post('/reservations', express.json(), userMiddleware, ReservationController.create);
app.get('/reservations/:id', userMiddleware, ReservationController.get);
app.put('/reservations/:id', express.json(), adminMiddleware, ReservationController.update);
app.delete('/reservations/:id', adminMiddleware, ReservationController.delete);
app.get('/reservations', userMiddleware, ReservationController.getAll);
app.post('/reservations/:id/cancel', userMiddleware, ReservationController.cancel);
app.get('/confirmed-dates', userMiddleware, ReservationController.getConfirmedDates);
app.get('/users/:id/reservations', adminMiddleware, ReservationController.getClientHistory);

const SpaceController = require("./controllers/SpaceController");
app.post('/spaces', express.json(), adminMiddleware, SpaceController.create);
app.get('/spaces/:id', SpaceController.get);
app.put('/spaces/:id', express.json(), adminMiddleware, SpaceController.update);
app.delete('/spaces/:id', adminMiddleware, SpaceController.delete);
app.get('/spaces', SpaceController.getAll);
app.get('/spaces/:id/favorite', userMiddleware, SpaceController.favorite)
app.get('/spaces/:id/defavorite', userMiddleware, SpaceController.deFavorite)
app.post('/spaces/:id/review', express.json(), userMiddleware, SpaceController.addReview);

const SpaceTypeController = require("./controllers/SpaceTypeController");
app.post('/spacetypes', express.json(), adminMiddleware, SpaceTypeController.create);
app.get('/spacetypes/:id', SpaceTypeController.get);
app.put('/spacetypes/:id', express.json(), adminMiddleware, SpaceTypeController.update);
app.delete('/spacetypes/:id', adminMiddleware, SpaceTypeController.delete);
app.get('/spacetypes', SpaceTypeController.getAll);

const ExtraServiceController = require("./controllers/ExtraServiceController");
app.post('/extraservices', express.json(), adminMiddleware, ExtraServiceController.create);
app.get('/extraservices/:id', userMiddleware, ExtraServiceController.get);
app.put('/extraservices/:id', express.json(), adminMiddleware, ExtraServiceController.update);
app.delete('/extraservices/:id', adminMiddleware, ExtraServiceController.delete);
app.get('/extraservices', ExtraServiceController.getAll);

const S3Controller = require("./controllers/S3Controller");
app.get('/upload-url', adminMiddleware, S3Controller.getUploadUrl);

const NotificationController = require("./controllers/NotificationController");
app.get('/notifications', userMiddleware, NotificationController.getAll);
app.delete('/notifications/:id', userMiddleware, NotificationController.delete);

app.listen(process.env.PORT, () => {
  try {
    mongoose.connect(process.env.ATLAS_CONNECTION);
  } catch (ex) {
    console.log(ex.message);
  }
  console.log(`${process.env.BASE_URL}:${process.env.PORT}`);
});