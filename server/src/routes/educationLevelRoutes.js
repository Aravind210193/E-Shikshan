const express = require('express');
const router = express.Router();
const educationLevelController = require('../controllers/educationLevelController');

// Public routes
router.get('/', educationLevelController.getAllEducationLevels);
router.get('/:id', educationLevelController.getEducationLevelById);
router.get('/level/:level', educationLevelController.getEducationLevelByName);

module.exports = router;
