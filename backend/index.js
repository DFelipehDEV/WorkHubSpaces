const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');

const router = express();
const urlencodedParser = bodyParser.urlencoded();

mongoose.connect(process.env.ATLAS_CONNECTION);

const UserController = require('./controllers/UserController');
router.get('/users/:id', UserController.getId);

const AuthController = require('./controllers/AuthController');
router.post('/signin', urlencodedParser, AuthController.signIn);
router.post('/login', urlencodedParser, AuthController.login);

const ReservationController = require('./controllers/ReservationController');
router.get('/reservations/:id', ReservationController.getId);
router.post('/reservations', urlencodedParser, ReservationController.create);

const SpaceController = require("./controllers/SpaceController");
router.post('/spaces', urlencodedParser, SpaceController.create);

router.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`)
});