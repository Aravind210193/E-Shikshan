const express = require('express');
const router = express.Router();
const supportController = require('../controllers/supportController');

// @route   POST /api/support/contact
// @desc    Send contact email
// @access  Public
router.post('/contact', supportController.sendContactEmail);

module.exports = router;
