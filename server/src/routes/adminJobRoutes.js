const express = require('express');
const router = express.Router();
const {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getJobStats,
} = require('../controllers/adminJobController');
const { adminAuth, checkPermission } = require('../middlewares/adminAuth');

// All routes require admin authentication
router.use(adminAuth);

// Stats route
router.get('/stats', getJobStats);

// CRUD routes
router.route('/')
  .get(checkPermission('jobs'), getAllJobs)
  .post(checkPermission('jobs'), createJob);

router.route('/:id')
  .get(checkPermission('jobs'), getJobById)
  .put(checkPermission('jobs'), updateJob)
  .delete(checkPermission('jobs'), deleteJob);

module.exports = router;
