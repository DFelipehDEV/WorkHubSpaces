const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  to: {
    type: mongoose.ObjectId,
    required: true,
  },
  level: {
    type: Number,
    required: true,
    enum: [0, 1, 2, 3] // 0 - Info, 1 - Warning, 2 - Error, 3 - Success
  },
  message: {
    type: String,
    required: true,
  },
  link: String
});

const Notification = mongoose.model('Notification', notificationSchema);

Notification.NotificationLevels = {
  Info: 0,
  Warning: 1,
  Error: 2,
  Success: 3,
};

module.exports = Notification;