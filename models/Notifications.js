const mongoose = require("mongoose");
const { Schema } = mongoose;

const notificationsSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Referință către utilizator
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bookings",
    required: true,
  }, // Referință către rezervare
  message: { type: String, required: true }, // Mesajul notificării
  read: { type: Boolean, default: false }, // Dacă notificarea a fost citită
  createdAt: { type: Date, default: Date.now }, // Data creării notificării
});

const Notifications = mongoose.model("Notifications", notificationsSchema);

module.exports = Notifications;
