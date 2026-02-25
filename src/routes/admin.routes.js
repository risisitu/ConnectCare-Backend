const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/admin.controller');

// Admin login route
router.post('/login', AdminController.login);

module.exports = router;
