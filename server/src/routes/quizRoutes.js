const express = require('express');
const router = express.Router();
const {
  getQuizzes,
  getQuizById,
  submitQuiz,
} = require('../controllers/quizController');
const { protect } = require('../middlewares/authMiddleware');

// @route   GET api/quizzes
// @desc    Get all quizzes
// @access  Public
router.route('/').get(getQuizzes);

// @route   GET api/quizzes/:id
// @desc    Get single quiz
// @access  Public
router.route('/:id').get(getQuizById);

// @route   POST api/quizzes/:id/submit
// @desc    Submit a quiz
// @access  Private
router.route('/:id/submit').post(protect, submitQuiz);

module.exports = router;
