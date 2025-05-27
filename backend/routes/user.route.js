const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const adminMiddleware = require('../middleware/admin.middleware');
const { getAllUsers } = require('../controllers/user.controller');

// Only admins can access
router.get('/', authMiddleware, adminMiddleware, getAllUsers);

module.exports = router;
