const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/signup", userController.createUser);

router.post("/login", userController.loginUser);

router.post("/logout", userController.logoutUser);

router.post("/refresh_token", userController.refreshToken);

router.get("/", userController.getUsers);

module.exports = router;
