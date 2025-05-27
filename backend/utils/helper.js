const jwt = require("jsonwebtoken");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, "config", "config.env") });

const generateAccessToken = (userId, email, isAdmin) => {
  return jwt.sign({ userId, email, isAdmin }, process.env.JWT_SECRET, {
    expiresIn: "4h",
  });
};

const generateRefreshToken = (userId, email, isAdmin) => {
  return jwt.sign(
    { userId, email, isAdmin },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
};

module.exports = { generateAccessToken, generateRefreshToken };
