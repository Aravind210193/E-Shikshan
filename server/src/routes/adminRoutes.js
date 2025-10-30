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
  revokeCourseAccess,
  restoreCourseAccess,
  deleteEnrollment,
  getDashboardStats
} = require('../controllers/adminController');
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

// Enrollment management
router.post('/enrollments/grant', grantCourseAccess);
router.put('/enrollments/:id/revoke', revokeCourseAccess);
router.put('/enrollments/:id/restore', restoreCourseAccess);
router.delete('/enrollments/:id', deleteEnrollment);

module.exports = router;
