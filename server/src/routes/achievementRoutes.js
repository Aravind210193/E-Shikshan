const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

// @route   GET api/achievements
// @desc    Get all achievements for the logged in user
// @access  Private
router.route('/').get(authMiddleware, (req, res) => {
  // Placeholder implementation - returns empty array since we don't have full implementation yet
  res.json([]);
});

// @route   GET api/achievements/certificates
// @desc    Get certificates for the logged in user
// @access  Private
router.route('/certificates').get(authMiddleware, (req, res) => {
  // Placeholder implementation - returns empty array since we don't have full implementation yet
  res.json([]);
});

module.exports = router;