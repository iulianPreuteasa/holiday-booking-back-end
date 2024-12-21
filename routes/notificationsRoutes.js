const express = require("express");
const Notifications = require("../models/Notifications");
const Bookings = require("../models/Bookings");

const router = express.Router();

router.post("/request", async (req, res) => {
  const { user, bookingId, message } = req.body;

  if (!user || !bookingId || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Verifică dacă rezervarea există
    const booking = await Bookings.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Creează notificarea
    const notification = new Notifications({
      user,
      booking: bookingId,
      message,
    });
    await notification.save();

    res.status(201).json(notification);
  } catch (error) {
    console.error("Error creating notification: " + error);
    res.status(500).json({ message: "Error creating notification" });
  }
});

router.delete("/delete/:bookingId", async (req, res) => {
  const { bookingId } = req.params;
  try {
    if (!bookingId) {
      res.status(500).json({ message: "Booking not existent" });
    }
    Bookings.deleteOne({ booking: bookingId });

    res
      .status(200)
      .json({ message: `Booking ${bookingId} deleted successfully.` });
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({ message: "Error deleting booking." });
  }
});

router.get("/", async (req, res) => {
  const { userId } = req.query; // Obținem userId din query params

  try {
    // 1. Obținem notificările pentru userId-ul respectiv
    const notifications = await Notifications.find({ user: userId })
      .populate("booking") // Populăm notificările cu detalii despre booking
      .exec();

    // 2. Mergem prin notificări și adăugăm detaliile despre rezervări
    const notificationsWithBookingDetails = notifications.map(
      (notification) => {
        const booking = notification.booking; // Detaliile booking-ului asociat notificării

        // Extragem datele din requestDates pentru fiecare rezervare
        const requestDates = booking.requestDates.map((dateRange) => ({
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
        }));

        // Întoarcem notificările populate cu detaliile de rezervare
        return {
          ...notification.toObject(),
          bookingDetails: {
            requestDates, // Adăugăm requestDates în notificare
            user: booking.user,
          },
        };
      }
    );

    // Returnăm notificările cu detaliile de booking
    res.status(200).json(notificationsWithBookingDetails);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Error fetching notifications" });
  }
});

module.exports = router;
