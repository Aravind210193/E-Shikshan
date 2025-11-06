const express = require('express');
const router = express.Router();
const CourseContent = require('../models/CourseModule');
const UserProgress = require('../models/UserProgress');
const { protect } = require('../middlewares/auth');

// @route   GET /api/course-content/:courseId
// @desc    Get course content (modules, videos, assignments, quizzes)
// @access  Private (enrolled students only)
router.get('/:courseId', protect, async (req, res) => {
  try {
    const { courseId } = req.params;

    // Check if user is enrolled and has access
    const enrollment = await require('../models/Enrollment').findOne({
      user: req.user._id,
      course: courseId,
      paymentStatus: { $in: ['completed', 'free'] },
      status: 'active'
    });

    if (!enrollment) {
      return res.status(403).json({ 
        message: 'Access denied. Please enroll in this course first.' 
      });
    }

    // Get course content
    const courseContent = await CourseContent.findOne({ courseId }).lean();

    if (!courseContent) {
      return res.status(404).json({ message: 'Course content not found' });
    }

    res.json({
      success: true,
      data: courseContent
    });
  } catch (error) {
    console.error('Error fetching course content:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/course-content/:courseId/progress
// @desc    Get user's progress in a course
// @access  Private
router.get('/:courseId/progress', protect, async (req, res) => {
  try {
    const { courseId } = req.params;

    let progress = await UserProgress.findOne({
      userId: req.user._id,
      courseId
    }).lean();

    if (!progress) {
      // Create initial progress if not exists
      const enrollment = await require('../models/Enrollment').findOne({
        user: req.user._id,
        course: courseId
      });

      if (!enrollment) {
        return res.status(403).json({ message: 'Not enrolled in this course' });
      }

      progress = await UserProgress.create({
        userId: req.user._id,
        courseId,
        enrollmentId: enrollment._id,
        moduleProgress: [],
        quizAttempts: [],
        assignmentSubmissions: [],
        overallProgress: 0
      });
    }

    res.json({
      success: true,
      data: progress
    });
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/course-content/:courseId/video-complete
// @desc    Mark a video as completed
// @access  Private
router.post('/:courseId/video-complete', protect, async (req, res) => {
  try {
    const { courseId } = req.params;
    const { moduleId, videoId } = req.body;

    let progress = await UserProgress.findOne({
      userId: req.user._id,
      courseId
    });

    if (!progress) {
      return res.status(404).json({ message: 'Progress record not found' });
    }

    // Find or create module progress
    let moduleProgress = progress.moduleProgress.find(
      mp => mp.moduleId.toString() === moduleId
    );

    if (!moduleProgress) {
      progress.moduleProgress.push({
        moduleId,
        completedVideos: [videoId],
        downloadedResources: [],
        completedAssignments: [],
        completedQuizzes: []
      });
    } else if (!moduleProgress.completedVideos.includes(videoId)) {
      moduleProgress.completedVideos.push(videoId);
    }

    progress.lastAccessedAt = Date.now();
    await progress.save();

    res.json({
      success: true,
      message: 'Video marked as complete',
      data: progress
    });
  } catch (error) {
    console.error('Error marking video complete:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/course-content/:courseId/quiz-submit
// @desc    Submit quiz answers and get score
// @access  Private
router.post('/:courseId/quiz-submit', protect, async (req, res) => {
  try {
    const { courseId } = req.params;
    const { quizId, answers } = req.body; // answers: { questionId: selectedAnswer }

    const progress = await UserProgress.findOne({
      userId: req.user._id,
      courseId
    });

    if (!progress) {
      return res.status(404).json({ message: 'Progress record not found' });
    }

    // Get quiz details
    const courseContent = await CourseContent.findOne({ courseId });
    let quiz = null;
    let moduleId = null;

    for (const module of courseContent.modules) {
      quiz = module.quizzes.find(q => q._id.toString() === quizId);
      if (quiz) {
        moduleId = module._id;
        break;
      }
    }

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Calculate score
    let correctCount = 0;
    const answerDetails = quiz.questions.map(q => {
      const userAnswer = answers[q._id.toString()];
      const isCorrect = userAnswer === q.correctAnswer;
      if (isCorrect) correctCount++;

      return {
        questionId: q._id,
        selectedAnswer: userAnswer,
        isCorrect
      };
    });

    const percentage = Math.round((correctCount / quiz.questions.length) * 100);
    const passed = percentage >= quiz.passingScore;

    // Get attempt number
    const previousAttempts = progress.quizAttempts.filter(
      a => a.quizId.toString() === quizId
    );
    const attemptNumber = previousAttempts.length + 1;

    // Save attempt
    progress.quizAttempts.push({
      quizId,
      attemptNumber,
      score: correctCount,
      totalQuestions: quiz.questions.length,
      percentage,
      passed,
      answers: answerDetails,
      completedAt: Date.now()
    });

    // Mark quiz as completed if passed
    if (passed) {
      let moduleProgress = progress.moduleProgress.find(
        mp => mp.moduleId.toString() === moduleId.toString()
      );

      if (!moduleProgress) {
        progress.moduleProgress.push({
          moduleId,
          completedVideos: [],
          downloadedResources: [],
          completedAssignments: [],
          completedQuizzes: [quizId]
        });
      } else if (!moduleProgress.completedQuizzes.includes(quizId)) {
        moduleProgress.completedQuizzes.push(quizId);
      }
    }

    progress.lastAccessedAt = Date.now();
    await progress.save();

    res.json({
      success: true,
      data: {
        score: correctCount,
        totalQuestions: quiz.questions.length,
        percentage,
        passed,
        attemptNumber,
        answers: answerDetails
      }
    });
  } catch (error) {
    console.error('Error submitting quiz:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/course-content/:courseId/assignment-submit
// @desc    Record assignment submission
// @access  Private
router.post('/:courseId/assignment-submit', protect, async (req, res) => {
  try {
    const { courseId } = req.params;
    const { assignmentId, moduleId, submissionUrl } = req.body;

    const progress = await UserProgress.findOne({
      userId: req.user._id,
      courseId
    });

    if (!progress) {
      return res.status(404).json({ message: 'Progress record not found' });
    }

    // Check if already submitted
    const existingSubmission = progress.assignmentSubmissions.find(
      s => s.assignmentId.toString() === assignmentId
    );

    if (existingSubmission) {
      return res.status(400).json({ message: 'Assignment already submitted' });
    }

    // Record submission
    progress.assignmentSubmissions.push({
      assignmentId,
      submissionUrl,
      status: 'submitted',
      submittedAt: Date.now()
    });

    // Update module progress
    let moduleProgress = progress.moduleProgress.find(
      mp => mp.moduleId.toString() === moduleId
    );

    if (!moduleProgress) {
      progress.moduleProgress.push({
        moduleId,
        completedVideos: [],
        downloadedResources: [],
        completedAssignments: [assignmentId],
        completedQuizzes: []
      });
    } else if (!moduleProgress.completedAssignments.includes(assignmentId)) {
      moduleProgress.completedAssignments.push(assignmentId);
    }

    progress.lastAccessedAt = Date.now();
    await progress.save();

    res.json({
      success: true,
      message: 'Assignment submitted successfully',
      data: progress
    });
  } catch (error) {
    console.error('Error submitting assignment:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
