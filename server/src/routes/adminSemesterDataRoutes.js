const express = require('express');
const router = express.Router();
const adminSemesterDataController = require('../controllers/adminSemesterDataController');
const { adminAuth } = require('../middlewares/adminAuth');

// Apply authentication middleware to all routes
router.use(adminAuth);

// Program/Semester Data routes
router.get('/', adminSemesterDataController.getAllPrograms);
router.get('/:id', adminSemesterDataController.getProgramById);
router.post('/', adminSemesterDataController.createProgram);
router.put('/:id', adminSemesterDataController.updateProgram);
router.delete('/:id', adminSemesterDataController.deleteProgram);
router.put('/:id/semester', adminSemesterDataController.updateSemesterData);

module.exports = router;
