const express = require("express");
const router = express.Router();
const notificationsController = require("../controllers/notificationsController");

router.post("/request", notificationsController.createNotification);

router.delete("/delete/:bookingId", notificationsController.deleteNotification);

router.get("/", notificationsController.getNotifications);

module.exports = router;
