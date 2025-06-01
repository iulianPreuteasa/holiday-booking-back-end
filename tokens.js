const { sign } = require("jsonwebtoken");

const createAccessToken = (userId, role) => {
  return sign({ userId, role }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
};

const createRefreshToken = (userId, role) => {
  return sign({ userId, role }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

const sendAccessToken = (req, res, accesstoken, user) => {
  res.send({
    accesstoken,
    user: {
      name: user.name,
      surname: user.surname,
      _id: user._id,
      role: user.role,
    },
  });
};

const sendRefreshToken = (res, refreshtoken) => {
  res.cookie("refreshtoken", refreshtoken, {
    httpOnly: true,
    path: "/users/refresh_token",
    sameSite: "lax",
    secure: false,
  });
};

module.exports = {
  createAccessToken,
  createRefreshToken,
  sendAccessToken,
  sendRefreshToken,
};
