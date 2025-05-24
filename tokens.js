const { sign } = require("jsonwebtoken");

const createAccessToken = (userId) => {
  return sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
};

const createRefreshToken = (userId) => {
  return sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
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
