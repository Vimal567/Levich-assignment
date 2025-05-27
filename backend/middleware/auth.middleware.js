const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const Session = require('../models/session.model');
dotenv.config();

const authMiddleware = async (req, res, next) => {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token provided. Please log in."
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        // Token expired → clean up session(s)
        try {
          if (user && user.userId) {
            await Session.deleteMany({ userId: user.userId });
            console.log(`Expired session cleared for user ${user.userId}`);
          }
        } catch (cleanupError) {
          console.error("Error cleaning up expired sessions:", cleanupError);
        }

        return res.status(403).json({
          success: false,
          message: "Session expired. Please log in again."
        });
      }

      return res.status(403).json({
        success: false,
        message: "Invalid token."
      });
    }

    req.user = user;
    next();
  });
};

module.exports = authMiddleware;
