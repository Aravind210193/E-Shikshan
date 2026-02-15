const Quiz = require('../models/Quiz');

// @desc    Get all quizzes
// @route   GET /api/quizzes
// @access  Public
const getQuizzes = async (req, res) => {
  const quizzes = await Quiz.find({});
  res.json(quizzes);
};

// @desc    Get single quiz
// @route   GET /api/quizzes/:id
// @access  Public
const getQuizById = async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);

  if (quiz) {
    res.json(quiz);
  } else {
    res.status(404).send('Quiz not found');
  }
};

// @desc    Submit a quiz
// @route   POST /api/quizzes/:id/submit
// @access  Private
const submitQuiz = async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  const { answers } = req.body;

  if (quiz) {
    let score = 0;
    quiz.questions.forEach((question, index) => {
      if (question.correctAnswer === answers[index]) {
        score++;
      }
    });
    res.json({ score });
  } else {
    res.status(404).send('Quiz not found');
  }
};

module.exports = { getQuizzes, getQuizById, submitQuiz };
