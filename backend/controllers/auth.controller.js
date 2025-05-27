const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/helper");
const Session = require("../models/session.model");

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userData = await User.findOne({ email });

    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "No account found with that email. Please register.",
      });
    }

    const isPasswordMatching = await bcrypt.compare(
      password,
      userData.password
    );

    if (!isPasswordMatching) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password.",
      });
    }

    const responseData = {
      id: userData._id,
      name: userData.name,
      email: userData.email,
      isAdmin: userData.isAdmin,
      permissions: userData.permissions,
    };

    const accessToken = generateAccessToken(
      userData._id,
      userData.email,
      userData.isAdmin
    );
    const refreshToken = generateRefreshToken(
      userData._id,
      userData.email,
      userData.isAdmin
    );

    await Session.create({ userId: userData._id, refreshToken });

    res.status(200).json({
      success: true,
      data: responseData,
      accessToken,
      refreshToken
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred during login. Please try again later.",
    });
  }
};

const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingData = await User.findOne({ email });

    if (existingData) {
      return res.status(400).json({
        success: false,
        message: "Email already exists! Please use a different one.",
      });
    }

    //Hashing password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const userDetails = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const responseData = {
      id: userDetails._id,
      name: userDetails.name,
      email: userDetails.email,
      isAdmin: userDetails.isAdmin,
      permissions: userDetails.permissions,
    };

    const accessToken = generateAccessToken(
      userDetails._id,
      userDetails.email,
      userDetails.isAdmin
    );
    const refreshToken = generateRefreshToken(
      userDetails._id,
      userDetails.email,
      userDetails.isAdmin
    );

    // Save refresh token
    await Session.create({ userId: userDetails._id, refreshToken });

    res.status(201).json({
      success: true,
      data: responseData,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "An error occurred during registration. Please try again later.",
    });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No user found with that email.",
      });
    }

    // Generate a random token (e.g., hex string)
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Save it on the user
    user.resetPasswordToken = resetToken;
    await user.save();

    // ⚠ Normally, you'd send this via email. Here, we mock it.
    res.status(200).json({
      success: true,
      message:
        "Password reset token generated.  Please use this token to reset password.",
      resetToken: resetToken, // Expose it here for testing/mock
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

const resetPassword = async (req, res) => {
  const { resetToken, newPassword } = req.body;

  try {
    const user = await User.findOne({ resetPasswordToken: resetToken });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid reset token.",
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    user.password = hashedPassword;
    user.resetPasswordToken = null; // Clear the token after use
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password has been reset successfully.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

const refreshTokenHandler = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res
      .status(401)
      .json({ success: false, message: "No refresh token provided." });
  }

  try {
    // Check if refresh token exists in DB
    const session = await Session.findOne({ refreshToken });
    if (!session) {
      return res
        .status(403)
        .json({ success: false, message: "Invalid refresh token." });
    }

    // Verify refresh token
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, user) => {
        if (err) {
          // On expired or invalid token → cleanup session
          await Session.findOneAndDelete({ refreshToken });

          return res.status(403).json({
            success: false,
            message: "Expired refresh token. Please log in again.",
          });
        }

        const newAccessToken = generateAccessToken(user.userId, user.email);

        res.status(200).json({
          success: true,
          accessToken: newAccessToken,
          refreshToken: refreshToken, // or generate a new one if rotating
        });
      }
    );
  } catch (error) {
    console.error("Error in refresh handler:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

const logoutHandler = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res
      .status(400)
      .json({ success: false, message: "No refresh token provided." });
  }

  try {
    await Session.findOneAndDelete({ refreshToken });

    res
      .status(200)
      .json({ success: true, message: "Logged out successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

module.exports = {
  login,
  register,
  forgotPassword,
  resetPassword,
  refreshTokenHandler,
  logoutHandler,
};
