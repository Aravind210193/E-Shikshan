const express = require('express');
const router = express.Router();
const {
    getDoubtsForInstructor,
    getAllDoubts,
    replyDoubt,
    getPendingDoubtsCount,
} = require('../controllers/doubtController');
const { adminAuth } = require('../middlewares/adminAuth');

// Protected routes (Admin/Instructor)
router.use(adminAuth);

router.get('/instructor', getDoubtsForInstructor);
router.get('/pending-count', getPendingDoubtsCount);
router.put('/:id/reply', replyDoubt);
router.get('/all', getAllDoubts);

module.exports = router;
