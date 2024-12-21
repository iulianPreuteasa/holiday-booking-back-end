const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // pentru a gestiona variabilele de mediu

const app = express();

app.use(cors()); // Permite cererile din frontend (React)
app.use(express.json()); // Parsează corpul request-urilor în JSON
app.use(express.urlencoded({ extended: true }));

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
