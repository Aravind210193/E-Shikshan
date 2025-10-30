const express = require('express');
const router = express.Router();
const semesterDataController = require('../controllers/semesterDataController');

// Public routes
router.get('/', semesterDataController.getAllPrograms);
router.get('/:programKey', semesterDataController.getProgramByKey);
router.get('/:programKey/semester/:semesterNumber', semesterDataController.getSemesterData);

module.exports = router;
