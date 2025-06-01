const User = require("../models/User");
const { hash, compare } = require("bcryptjs");
const {
  createAccessToken,
  createRefreshToken,
  sendAccessToken,
  sendRefreshToken,
} = require("../tokens.js");
const { verify } = require("jsonwebtoken");

// Înregistrare utilizator
const createUser = async (req, res) => {
  const { name, surname, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const hashedPassword = await hash(password, 10);

    const newUser = new User({
      name,
      surname,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error in signup:", error.message);
    res.status(400).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const valid = await compare(password, user.password);

    if (valid) {
      const accessToken = createAccessToken(user.id, user.role);
      const refreshToken = createRefreshToken(user.id, user.role);
      // Salvează refreshToken-ul în baza de date
      user.refreshToken = refreshToken;
      await user.save();

      sendRefreshToken(res, refreshToken);
      sendAccessToken(req, res, accessToken, user);
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// logout

const logoutUser = (_req, res) => {
  res.clearCookie("refreshtoken", {
    path: "/users/refresh_token",
    sameSite: "Lax",
    secure: false,
  });
  return res.send({ message: "Logged out!" });
};

// refresh tooken

const refreshToken = async (req, res) => {
  const token = req.cookies.refreshtoken;

  if (!token) return res.send({ accesstoken: "" });
  let payload = null;

  try {
    payload = verify(token, process.env.REFRESH_TOKEN_SECRET);
  } catch (error) {
    return res.send({ accesstoken: "" });
  }

  const user = await User.findById(payload.userId);
  if (!user) return res.send({ accesstoken: "" });

  if (user.refreshToken !== token) {
    return res.send({ accesstoken: "" });
  }

  const accesstoken = createAccessToken(user.id, user.role);
  const refreshtoken = createRefreshToken(user.id, user.role);

  user.refreshToken = refreshtoken;
  await user.save();

  sendRefreshToken(res, refreshtoken);

  return res.send({
    accesstoken,
    user: {
      name: user.name,
      surname: user.surname,
      _id: user._id,
      role: user.role,
    },
  });
};

// get

const getUsers = async (req, res) => {
  try {
    const users = await User.find();

    const usersName = [];

    users.map((user) => {
      usersName.push({
        name: user.name,
        surname: user.surname,
        id: user._id,
        role: user.role,
      });
    });

    return res.json(usersName);
  } catch (error) {
    console.error("Error in getting users: " + error);
    res.status(500).json({ message: "Error getting users" });
  }
};

module.exports = {
  createUser,
  loginUser,
  logoutUser,
  getUsers,
  refreshToken
};
