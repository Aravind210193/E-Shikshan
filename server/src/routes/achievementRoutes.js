const express = require('express');
const router = express.Router();
const achievementController = require('../controllers/achievementController');
const authMiddleware = require('../middlewares/authMiddleware');

// @route   GET api/achievements
// @desc    Get all achievements for the logged in user
// @access  Private
router.route('/').get(authMiddleware, achievementController.getUserAchievements);

// @route   GET api/achievements/certificates
// @desc    Get certificates for the logged in user
// @access  Private
router.route('/certificates').get(authMiddleware, achievementController.getUserCertificates);

// Admin routes for achievement management
// @route   POST api/achievements
// @desc    Create a new achievement
// @access  Private (Admin only)
router.route('/').post(authMiddleware, achievementController.createAchievement);

// @route   DELETE api/achievements/:id
// @desc    Delete an achievement
// @access  Private (Admin only)
router.route('/:id').delete(authMiddleware, achievementController.deleteAchievement);

module.exports = router;