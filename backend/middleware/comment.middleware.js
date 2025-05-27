const User = require("../models/user.model");

const commentMiddleware = (requiredPermission) => async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user || !user.permissions.includes(requiredPermission)) {
      return res.status(403).json({
        success: false,
        message: `You need ${requiredPermission} permission to perform this action.`,
      });
    }

    next();
  } catch (error) {
    console.error("Permission check error:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

module.exports = { commentMiddleware };
