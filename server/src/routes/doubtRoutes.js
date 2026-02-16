const express = require('express');
const router = express.Router();
const {
    createDoubt,
    getDoubtsForInstructor,
    getAllDoubts,
    replyDoubt,
    getPendingDoubtsCount,
    deleteDoubt,
    studentReply
} = require('../controllers/doubtController');
const { protect } = require('../middlewares/authMiddleware');
const { adminAuth } = require('../middlewares/adminAuth');

// Student routes
router.post('/', protect, createDoubt);
router.get('/student', protect, require('../controllers/doubtController').getStudentDoubts);
router.delete('/:id', protect, deleteDoubt);
router.put('/:id/student-reply', protect, studentReply);

// Instructor/Admin routes
router.get('/instructor', adminAuth, getDoubtsForInstructor);
router.get('/all', adminAuth, getAllDoubts);
router.put('/:id/reply', adminAuth, replyDoubt);
router.get('/count/pending', adminAuth, getPendingDoubtsCount);

module.exports = router;

