const mongoose = require("mongoose");
const { Schema } = mongoose;

const bookingsSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the User model
  booking: {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
  },

  status: {
    type: String,
    enum: {
      values: ["accepted", "requested", "rejected"], // Restrict values to these options
      message: "{VALUE} is not a valid status", // Custom error message for invalid values
    },
    required: [true, "Status is required"],
  },

  createdAt: { type: Date, default: Date.now },
});

const Bookings = mongoose.model("Bookings", bookingsSchema);

module.exports = Bookings;
