const jwt = require("jsonwebtoken");

const generateToken = (res, customerId) => {
  const secret = process.env.JWT_SECRET || "default_jwt_secret_key_shopkart";

  const token = jwt.sign({ id: customerId }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });

  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("token", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 24 * 60 * 60 * 1000,
  });

  return token;
};

module.exports = generateToken;

