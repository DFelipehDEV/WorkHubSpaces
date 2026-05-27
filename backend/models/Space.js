const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.ObjectId,
    required: true,
  },
  review: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 10,
  }
});

const spaceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: mongoose.ObjectId,
    required: true,
  },
  available: {
    type: Boolean,
    required: true,
  },
  description: String,
  capacity: {
    type: Number,
    required: true,
  },
  pricePerHour: Number,
  images: [String],
  favoritedBy: {
    type: [mongoose.ObjectId],
  },
  popularity: {
    type: Number,
    default: 0
  },
  reviews: {
    type: [reviewSchema]
  },
  equipments: {
    type: [mongoose.ObjectId]
  }
});

module.exports = mongoose.model('Space', spaceSchema);