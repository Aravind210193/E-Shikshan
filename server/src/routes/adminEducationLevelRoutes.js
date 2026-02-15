const express = require('express');
const router = express.Router();
const adminEducationLevelController = require('../controllers/adminEducationLevelController');
const { adminAuth } = require('../middlewares/adminAuth');

// Apply authentication middleware to all routes
router.use(adminAuth);

// Education Level routes
router.get('/', adminEducationLevelController.getAllEducationLevels);
router.get('/:id', adminEducationLevelController.getEducationLevelById);
router.post('/', adminEducationLevelController.createEducationLevel);
router.put('/:id', adminEducationLevelController.updateEducationLevel);
router.delete('/:id', adminEducationLevelController.deleteEducationLevel);
router.post('/:id/branches', adminEducationLevelController.addBranchToLevel);
router.delete('/:id/branches/:branchId', adminEducationLevelController.removeBranchFromLevel);

module.exports = router;
