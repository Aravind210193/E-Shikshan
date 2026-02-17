const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/resumeTemplateController');

// Public route to fetch all active resume templates
router.get('/', ctrl.getAll);

module.exports = router;
