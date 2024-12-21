const express = require("express");
const User = require("../models/User");
const router = express.Router();

// Înregistrare utilizator
router.post("/signup", async (req, res) => {
  const { name, surname, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const newUser = new User({ name, surname, email, password });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error in signup:", error.message);
    res.status(400).json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && user.password === password) {
      res.json({ message: "Login successful", user });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const users = await User.find();

    const usersName = [];

    users.map((user) => {
      usersName.push({
        name: user.name,
        surname: user.surname,
        id: user._id,
      });
    });

    return res.json(usersName);
  } catch (error) {
    console.error("Error in getting users: " + error);
    res.status(500).json({ message: "Error getting users" });
  }
});

module.exports = router;
