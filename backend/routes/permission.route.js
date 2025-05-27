const express = require('express');
const { getUserPermissions, updateUserPermissions, promoteToAdmin } = require('../controllers/permission.controller');
const authMiddleware = require('../middleware/auth.middleware');
const adminMiddleware = require('../middleware/admin.middleware');

const router = express.Router();

router.get('/', authMiddleware, getUserPermissions);
router.put('/', authMiddleware, adminMiddleware, updateUserPermissions);
router.put('/promote', authMiddleware, adminMiddleware, promoteToAdmin);

module.exports = router;
