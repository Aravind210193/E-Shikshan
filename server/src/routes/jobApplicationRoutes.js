const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { adminAuth } = require('../middlewares/adminAuth');
const {
    applyToJob,
    getMyApplications,
    getInstructorApplications,
    updateApplicationStatus
} = require('../controllers/jobApplicationController');

// Student routes
router.post('/:id/apply', protect, applyToJob);
router.get('/my-applications', protect, getMyApplications);

// Admin/Instructor routes
router.get('/admin/applications', adminAuth, getInstructorApplications);
router.put('/admin/:id/status', adminAuth, updateApplicationStatus);

module.exports = router;
