const express = require('express');
const router = express.Router();
const subjectController = require('../controllers/subjectController');

// Public routes
router.get('/', subjectController.getAllSubjects);
router.get('/branch/:branch', subjectController.getSubjectsByBranch);
router.get('/branch/:branch/semester/:semester', subjectController.getSubjectsByBranchAndSemester);

module.exports = router;
