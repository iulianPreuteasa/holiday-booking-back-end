const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  refreshToken: String,
  role: {
    type: String,
    enum: ["admin", "employee", "employer"],
    default: "employee",
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
