const express = require('express');
const router = express.Router();
const {
  getCourses,
  getCourseById,
} = require('../controllers/courseController');
const { protect } = require('../middlewares/authMiddleware');
const { checkCourseAccess } = require('../middlewares/courseAccessMiddleware');

// @route   GET api/courses
// @desc    Get all courses
// @access  Public
router.route('/').get(getCourses);

// @route   GET api/courses/enrolled
// @desc    Get enrolled courses for logged in user
// @access  Private
router.route('/enrolled').get(protect, (req, res) => {
  // Placeholder implementation - returns empty array since we don't have full implementation yet
  res.json([]);
});

// @route   GET api/courses/:id
// @desc    Get single course (public - basic info)
// @access  Public
router.route('/:id').get(getCourseById);

// @route   GET api/courses/:courseId/content
// @desc    Get course content (protected - requires enrollment)
// @access  Private + Enrollment Required
router.route('/:courseId/content').get(protect, checkCourseAccess, async (req, res) => {
  try {
    const { courseId } = req.params;
    const Course = require('../models/Course');
    
    // User has access (verified by middleware)
    const course = await Course.findById(courseId).select('-__v');
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Return full course content including videos, assignments, etc.
    res.json({
      success: true,
      message: 'Course content retrieved successfully',
      hasAccess: true,
      course: course,
      enrollment: req.courseAccess
    });
  } catch (error) {
    console.error('Error fetching course content:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching course content',
      error: error.message
    });
  }
});

module.exports = router;
