const express = require('express');
const router = express.Router();
const adminSubjectController = require('../controllers/adminSubjectController');
const { adminAuth } = require('../middlewares/adminAuth');

// Apply authentication middleware to all routes
router.use(adminAuth);

// Subject routes
router.get('/', adminSubjectController.getAllSubjects);
router.get('/:id', adminSubjectController.getSubjectById);
router.post('/', adminSubjectController.createSubject);
router.put('/:id', adminSubjectController.updateSubject);
router.delete('/:id', adminSubjectController.deleteSubject);
router.post('/:id/subjects', adminSubjectController.addSubjectToGroup);
router.delete('/:id/subjects/:subjectId', adminSubjectController.removeSubjectFromGroup);

module.exports = router;
