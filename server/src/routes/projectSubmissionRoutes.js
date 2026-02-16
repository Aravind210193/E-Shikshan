const express = require('express');
const router = express.Router();
const {
    submitProject,
    getInstructorSubmissions,
    updateSubmission,
    replyToSubmission,
    deleteSubmission,
    getStudentSubmissions
} = require('../controllers/projectSubmissionController');
const { protect } = require('../middlewares/authMiddleware');
const { adminAuth } = require('../middlewares/adminAuth');

// Student route
router.post('/', protect, submitProject);
router.get('/student', protect, getStudentSubmissions);

// Instructor routes
router.get('/instructor', adminAuth, getInstructorSubmissions);
router.put('/:id', adminAuth, updateSubmission);
router.post('/:id/reply', adminAuth, replyToSubmission);
router.delete('/:id', adminAuth, deleteSubmission);

module.exports = router;
