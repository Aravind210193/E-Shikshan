const express = require('express');
const router = express.Router();
const {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseStats,
} = require('../controllers/adminCourseController');
const { adminAuth, checkPermission } = require('../middlewares/adminAuth');

// All routes require admin authentication
router.use(adminAuth);

// Stats route
router.get('/stats', getCourseStats);

// CRUD routes
router.route('/')
  .get(checkPermission('courses'), getAllCourses)
  .post(checkPermission('courses'), createCourse);

router.route('/:id')
  .get(checkPermission('courses'), getCourseById)
  .put(checkPermission('courses'), updateCourse)
  .delete(checkPermission('courses'), deleteCourse);

module.exports = router;
