const Notifications = require("../models/Notifications");
const Bookings = require("../models/Bookings");

const createNotification = async (req, res) => {
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
};

const deleteNotification = async (req, res) => {
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
};

const getNotifications = async (req, res) => {
  const { userId } = req.query;

  try {
    const notifications = await Notifications.find({ user: userId })
      .populate("booking")
      .exec();

    const notificationsWithBookingDetails = notifications.map(
      (notification) => {
        const booking = notification.booking;
        const bookings = {
          startDate: booking.booking.startDate,
          endDate: booking.booking.endDate,
        };

        return {
          ...notification.toObject(),
          bookingDetails: {
            bookings,
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
};

module.exports = {
  createNotification,
  deleteNotification,
  getNotifications,
};
