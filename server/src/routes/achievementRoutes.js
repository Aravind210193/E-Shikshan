const express = require('express');
const router = express.Router();
const achievementController = require('../controllers/achievementController');
const { protect } = require('../middlewares/authMiddleware');

// @route   GET api/achievements
// @desc    Get all achievements for the logged in user
// @access  Private
router.route('/').get(protect, achievementController.getUserAchievements);

// @route   GET api/achievements/certificates
// @desc    Get certificates for the logged in user
// @access  Private
router.route('/certificates').get(protect, achievementController.getUserCertificates);

// Admin routes for achievement management
// @route   POST api/achievements
// @desc    Create a new achievement
// @access  Private (Admin only)
router.route('/').post(protect, achievementController.createAchievement);

// @route   DELETE api/achievements/:id
// @desc    Delete an achievement
// @access  Private (Admin only)
router.route('/:id').delete(protect, achievementController.deleteAchievement);

module.exports = router;