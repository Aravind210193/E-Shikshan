const express = require('express');
const router = express.Router();
const {
    createDoubt,
    getDoubtsForInstructor,
    getAllDoubts,
    replyDoubt,
    getPendingDoubtsCount,
} = require('../controllers/doubtController');
const { protect } = require('../middlewares/authMiddleware');
const { adminAuth } = require('../middlewares/adminAuth');

// Student routes
router.post('/', protect, createDoubt);

module.exports = router;

