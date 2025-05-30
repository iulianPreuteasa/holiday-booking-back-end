const { verify } = require("jsonwebtoken");

const isAuth = (req) => {
  const authorization = req.headers["authorization"];
  if (!authorization) throw new Error("You need to login");

  try {
    const token = authorization.split(" ")[1];
    const { userId } = verify(token, process.env.ACCESS_TOKEN_SECRET);
    return userId;
  } catch {
    throw new Error("Token invalid");
  }
};

module.exports = { isAuth };
