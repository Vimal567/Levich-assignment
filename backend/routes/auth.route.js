const express = require("express");
const {
  register,
  login,
  refreshTokenHandler,
  logoutHandler,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth.controller");
const router = express.Router();

router.route("/login").post(login);
router.route("/register").post(register);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/refresh", refreshTokenHandler);
router.post("/logout", logoutHandler);

module.exports = router;
