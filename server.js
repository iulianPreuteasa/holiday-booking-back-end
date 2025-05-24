const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000", // frontend-ul tău
    credentials: true, // permite trimiterea cookie-urilor
  })
);
app.use(express.json()); // Parsează corpul request-urilor în JSON
app.use(express.urlencoded({ extended: true })); // support URL-encoded bodies
app.use(cookieParser());

// Conectează-te la MongoDB
mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

// Definește un endpoint simplu
app.get("/", (req, res) => {
  res.send("API is running...");
});

const userRoutes = require("./routes/userRoutes");
app.use("/users", userRoutes);

const bookingsRoutes = require("./routes/bookingsRoutes");
app.use("/bookings", bookingsRoutes);

const notificationsRoutes = require("./routes/notificationsRoutes");
app.use("/notifications", notificationsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
