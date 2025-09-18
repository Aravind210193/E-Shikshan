const express = require('express');
const router = express.Router();
const {
  getCourses,
  getCourseById,
} = require('../controllers/courseController');
const authMiddleware = require('../middlewares/authMiddleware');

// @route   GET api/courses
// @desc    Get all courses
// @access  Public
router.route('/').get(getCourses);

// @route   GET api/courses/enrolled
// @desc    Get enrolled courses for logged in user
// @access  Private
router.route('/enrolled').get(authMiddleware, (req, res) => {
  // Placeholder implementation - returns empty array since we don't have full implementation yet
  res.json([]);
});

// @route   GET api/courses/:id
// @desc    Get single course
// @access  Public
router.route('/:id').get(getCourseById);

module.exports = router;
