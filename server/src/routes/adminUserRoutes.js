const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserStats,
} = require('../controllers/adminUserController');
const { adminAuth, checkPermission } = require('../middlewares/adminAuth');

// All routes require admin authentication
router.use(adminAuth);

// Stats route
router.get('/stats', getUserStats);

// CRUD routes
router.route('/')
  .get(checkPermission('users'), getAllUsers)
  .post(checkPermission('users'), createUser);

router.route('/:id')
  .get(checkPermission('users'), getUserById)
  .put(checkPermission('users'), updateUser)
  .delete(checkPermission('users'), deleteUser);

module.exports = router;
