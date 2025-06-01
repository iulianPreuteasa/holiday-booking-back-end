const express = require("express");
const router = express.Router();
const bookingsController = require("../controllers/bookingsController");

router.patch("/request/:status", bookingsController.patchBooking);

router.post("/request", bookingsController.createBooking);

router.delete("/delete/:id", bookingsController.deleteBooking);

router.get("/", bookingsController.getBookings);

module.exports = router;
