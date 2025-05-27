const User = require("../models/user.model");

// Get user permissions
const getUserPermissions = async (req, res) => {
  const userId = req.user.userId;

  try {
    const user = await User.findById(userId).select("permissions");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    res.status(200).json({ success: true, permissions: user.permissions });
  } catch (error) {
    console.error("Get permissions error:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// Update user permissions
const updateUserPermissions = async (req, res) => {
  const userId = req.user.userId;
  const { permissions } = req.body; // expects array like ['read', 'write']

  if (!Array.isArray(permissions)) {
    return res
      .status(400)
      .json({ success: false, message: "Permissions must be an array." });
  }

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { permissions },
      { new: true }
    ).select("permissions");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    res.status(200).json({ success: true, permissions: user.permissions });
  } catch (error) {
    console.error("Update permissions error:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

//Make admin
const promoteToAdmin = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    if (user.isAdmin) {
      return res
        .status(400)
        .json({ success: false, message: "User is already an admin." });
    }

    user.isAdmin = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: `${user.email} has been promoted to admin.`,
    });
  } catch (error) {
    console.error("Promote error:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

module.exports = { getUserPermissions, updateUserPermissions, promoteToAdmin };
