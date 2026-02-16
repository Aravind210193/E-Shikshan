const express = require('express');
const router = express.Router();
const roadmapController = require('../controllers/roadmapController');

// Public routes - no authentication required
router.get('/', roadmapController.getAllRoadmaps);
router.get('/categories', roadmapController.getCategories);
router.get('/stats', roadmapController.getRoadmapStats);
router.get('/:id', roadmapController.getRoadmapById);

module.exports = router;
