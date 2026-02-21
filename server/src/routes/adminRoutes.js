const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUserRole,
  createUser,
  updateUser,
  deleteUser,
  grantCourseAccess,
  grantRoadmapAccess,
  grantResumeAccess,
  revokeCourseAccess,
  restoreCourseAccess,
  deleteEnrollment,
  getDashboardStats
} = require('../controllers/adminController');
const {
  getInstructorRegistrations,
  grantHackathonAccess
} = require('../controllers/hackathonRegistrationController');
const {
  grantJobAccess
} = require('../controllers/jobApplicationController');
const notificationController = require('../controllers/notificationController');
const {
  getDoubtsForInstructor,
  getAllDoubts,
  replyDoubt,
  getPendingDoubtsCount,
} = require('../controllers/doubtController');
const {
  getInstructorSubmissions,
  updateSubmission
} = require('../controllers/projectSubmissionController');
const { adminAuth } = require('../middlewares/adminAuth');

// All routes require authentication and admin privileges
router.use(adminAuth);

// Dashboard stats
router.get('/stats', getDashboardStats);

// User management
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

// Enrollment / Access management
router.post('/enrollments/grant', grantCourseAccess);
router.post('/hackathons/grant', grantHackathonAccess);
router.post('/jobs/grant', grantJobAccess);
router.post('/roadmaps/grant', grantRoadmapAccess);
router.post('/resumes/grant', grantResumeAccess);
router.put('/enrollments/:id/revoke', revokeCourseAccess);
router.put('/enrollments/:id/restore', restoreCourseAccess);
router.delete('/enrollments/:id', deleteEnrollment);

// Notifications
router.get('/notifications', notificationController.getNotifications);
router.patch('/notifications/:id/read', notificationController.markAsRead);
router.patch('/notifications/read-all', notificationController.markAllAsRead);
router.delete('/notifications/:id', notificationController.deleteNotification);

// Doubts
router.get('/doubts/instructor', getDoubtsForInstructor);
router.get('/doubts/pending-count', getPendingDoubtsCount);
router.put('/doubts/:id/reply', replyDoubt);
router.get('/doubts/all', getAllDoubts);

// Project Submissions
router.get('/project-submissions/instructor', getInstructorSubmissions);
router.put('/project-submissions/:id', updateSubmission);

module.exports = router;
