const express = require('express');
const router = express.Router();
const {
  enrollInCourse,
  processPayment,
  getMyEnrollments,
  getEnrollmentById,
  checkEnrollmentStatus,
  updateProgress,
  deletePendingEnrollment
} = require('../controllers/enrollmentController');
const { protect } = require('../middlewares/authMiddleware');

// Enrollment routes (all require authentication)
router.post('/', protect, enrollInCourse);
router.get('/my-courses', protect, getMyEnrollments);
router.get('/check/:courseId', protect, checkEnrollmentStatus);
router.get('/:id', protect, getEnrollmentById);
router.post('/:enrollmentId/payment', protect, processPayment);
router.put('/:id/progress', protect, updateProgress);
router.delete('/:id', protect, deletePendingEnrollment);

module.exports = router;
