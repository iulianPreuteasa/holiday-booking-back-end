const mongoose = require("mongoose");
const { Schema } = mongoose;

const notificationsSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bookings",
    required: true,
  },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Notifications = mongoose.model("Notifications", notificationsSchema);

module.exports = Notifications;
