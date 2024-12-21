const mongoose = require("mongoose");
const { Schema } = mongoose;

const bookingsSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the User model
  acceptedDates: [
    {
      startDate: { type: Date }, // Start date for the booking
      endDate: { type: Date }, // End date for the booking
    },
  ], // Array of accepted date ranges
  rejectedDates: [
    {
      startDate: { type: Date }, // Start date for rejected dates
      endDate: { type: Date }, // End date for rejected dates
    },
  ],
  requestDates: [
    {
      startDate: { type: Date }, // Start date for pending dates
      endDate: { type: Date }, // End date for pending dates
    },
  ],
  createdAt: { type: Date, default: Date.now }, // Date when the request was created
});

// Inițializare arrays goale dacă lipsesc
bookingsSchema.path("acceptedDates").default(() => []);
bookingsSchema.path("rejectedDates").default(() => []);
bookingsSchema.path("requestDates").default(() => []);

const Bookings = mongoose.model("Bookings", bookingsSchema);

module.exports = Bookings;
