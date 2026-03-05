const connection = process.env.ATLAS_CONNECTION;
const mongoose = require('mongoose');
console.log(mongoose.connect(connection));