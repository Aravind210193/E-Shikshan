const express = require('express');
const router = express.Router();
const { login, getProfile, register, logout } = require('../controllers/adminAuthController');
const { adminAuth } = require('../middlewares/adminAuth');

// Public routes
router.post('/login', login);

// Protected routes
router.get('/profile', adminAuth, getProfile);
router.post('/register', adminAuth, register);
router.post('/logout', adminAuth, logout);

module.exports = router;
