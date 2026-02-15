const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { adminAuth } = require('../middlewares/adminAuth');

// All routes require admin authentication
router.use(adminAuth);

router.get('/', notificationController.getNotifications);
router.patch('/:id/read', notificationController.markAsRead);
router.patch('/read-all', notificationController.markAllAsRead);
router.delete('/:id', notificationController.deleteNotification);

module.exports = router;
