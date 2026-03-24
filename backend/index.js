const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const urlencodedParser = bodyParser.urlencoded();

mongoose.connect(process.env.ATLAS_CONNECTION);

const UserController = require('./controllers/UserController');
app.get('/users/:id', UserController.getId);

const AuthController = require('./controllers/AuthController');
app.post('/signin', urlencodedParser, AuthController.signIn);
app.post('/login', urlencodedParser, AuthController.login);

const ReservationController = require('./controllers/ReservationController');
app.get('/reservations/:id', ReservationController.getId);
app.post('/reservations', urlencodedParser, ReservationController.create);

const SpaceController = require("./controllers/SpaceController");
app.post('/spaces', urlencodedParser, SpaceController.create);

app.listen(process.env.PORT, () => {
  console.log(`http://localhost:${process.env.PORT}`)
});