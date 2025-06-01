const Bookings = require("../models/Bookings");
const Notifications = require("../models/Notifications");
const User = require("../models/User");
const mongoose = require("mongoose");

const patchBooking = async (req, res) => {
  const { status } = req.params;
  const { bookingId, notificationId } = req.body;

  const notificationToRemove = await Notifications.findById(notificationId);

  const validStatuses = ["requested", "accepted", "rejected"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  if (!mongoose.Types.ObjectId.isValid(bookingId)) {
    return res.status(400).json({ message: "Invalid booking ID" });
  }

  try {
    const bookingToChange = await Bookings.findById(bookingId);

    if (!bookingToChange) {
      return res.status(404).json({ message: "Booking not found" });
    }
    bookingToChange.status = status;
    await bookingToChange.save();

    await Notifications.findByIdAndDelete(notificationToRemove);

    return res.status(200).json({
      message: "Booking status updated successfully",
      booking: bookingToChange,
    });
  } catch (error) {
    console.error("Error in request: ", error);
    res.status(500).json({ message: "An error occurred" });
  }
};

const createBooking = async (req, res) => {
  const { userId, dateStart, dateEnd } = req.body;
  const startDate = new Date(dateStart);
  const endDate = new Date(dateEnd);

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingBookings = await Bookings.find({
      user: userId,
    });

    // Verifică dacă deja există intervalul de date
    const isDuplicate = existingBookings.some((booking) => {
      // Verifică dacă booking.booking este un obiect și dacă are startDate și endDate
      if (
        booking.booking &&
        booking.booking.startDate &&
        booking.booking.endDate
      ) {
        return (
          booking.booking.startDate.getTime() === startDate.getTime() &&
          booking.booking.endDate.getTime() === endDate.getTime()
        );
      }
      return false; // Dacă booking.booking nu este valid, returnează false
    });

    if (isDuplicate) {
      return res
        .status(400)
        .json({ message: "Booking request for these dates already exists." });
    }

    const newBooking = new Bookings({
      user: user._id,
      booking: { startDate, endDate },
      status: "requested",
    });

    await newBooking.save();

    return res.status(201).json({
      message: "Booking created successfully",
      bookingId: newBooking._id,
    });
  } catch (error) {
    console.error("Error in request: ", error);
    res.status(400).json({ message: error.message });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;

    const deletedBooking = await Bookings.findByIdAndDelete(bookingId);

    const notificationToDelete = await Notifications.findOne(
      {
        booking: bookingId,
      },
      { _id: 1 }
    );

    if (notificationToDelete) {
      await Notifications.deleteOne({ _id: notificationToDelete._id });
    }

    if (!deletedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    return res.status(200).json({
      message: "Booking deleted successfully",
      booking: deletedBooking,
    });
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getBookings = async (req, res) => {
  const { userId } = req.query;
  try {
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Fetch bookings that belong to the given userId
    const bookings = await Bookings.find({ user: userId });

    return res.json(bookings);
  } catch (error) {
    console.error("Error in getting bookings: " + error);
    res.status(500).json({ message: "Error getting bookings" });
  }
};

module.exports = {
  patchBooking,
  createBooking,
  deleteBooking,
  getBookings,
};
