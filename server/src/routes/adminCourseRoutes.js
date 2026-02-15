const express = require('express');
const router = express.Router();
const {
    getAllCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    getCourseStats,
    addLesson,
    updateLesson,
    deleteLesson,
    addProject,
    updateProject,
    deleteProject,
    addAssignment,
    updateAssignment,
    deleteAssignment,
    addResource,
    deleteResource,
    getCourseEnrollments,
    getInstructors
} = require('../controllers/adminCourseController');
const { adminAuth, checkPermission } = require('../middlewares/adminAuth');

// All routes require admin authentication
router.use(adminAuth);

// Instructors list for course assignment (Admin only)
router.get('/instructors', checkPermission('courses'), getInstructors);

// Stats route
router.get('/stats', getCourseStats);

// Enrollment list for a specific course (Move above /:id to avoid conflict)
router.get('/:id/enrollments', getCourseEnrollments);

// CRUD routes
router.route('/')
    .get(checkPermission('courses'), getAllCourses)
    .post(checkPermission('courses'), createCourse);

router.route('/:id')
    .get(checkPermission('courses'), getCourseById)
    .put(checkPermission('courses'), updateCourse)
    .delete(checkPermission('courses'), deleteCourse);

// Lesson Management
router.post('/:id/lessons', checkPermission('courses'), addLesson);
router.put('/:id/lessons/:lessonId', checkPermission('courses'), updateLesson);
router.delete('/:id/lessons/:lessonId', checkPermission('courses'), deleteLesson);

// Project Management
router.post('/:id/projects', checkPermission('courses'), addProject);
router.put('/:id/projects/:projectId', checkPermission('courses'), updateProject);
router.delete('/:id/projects/:projectId', checkPermission('courses'), deleteProject);

// Assignment (Task) Management
router.post('/:id/assignments', checkPermission('courses'), addAssignment);
router.put('/:id/assignments/:assignmentId', checkPermission('courses'), updateAssignment);
router.delete('/:id/assignments/:assignmentId', checkPermission('courses'), deleteAssignment);

// Resource Management
router.post('/:id/resources', checkPermission('courses'), addResource);
router.delete('/:id/resources/:resourceId', checkPermission('courses'), deleteResource);

module.exports = router;
