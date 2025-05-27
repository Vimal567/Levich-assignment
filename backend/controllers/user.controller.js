const User = require('../models/user.model');

const getAllUsers = async (req, res) => {
  try {
    // Check if the requester is admin (req.user is set by authMiddleware)
    if (!req.user.isAdmin) {
      return res.status(403).json({ success: false, message: 'Access denied. Admins only.' });
    }

    const users = await User.find({}, 'name email permissions isAdmin');

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

module.exports = { getAllUsers };
