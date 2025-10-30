const express = require('express');
const router = express.Router();
const adminFolderController = require('../controllers/adminFolderController');
const { adminAuth } = require('../middlewares/adminAuth');

// Apply authentication middleware to all routes
router.use(adminAuth);

// Folder routes
router.get('/', adminFolderController.getAllFolders);
router.get('/:id', adminFolderController.getFolderById);
router.post('/', adminFolderController.createFolder);
router.put('/:id', adminFolderController.updateFolder);
router.delete('/:id', adminFolderController.deleteFolder);
router.post('/:id/units', adminFolderController.addUnitToFolder);
router.put('/:id/units/:unitId', adminFolderController.updateUnitInFolder);
router.delete('/:id/units/:unitId', adminFolderController.removeUnitFromFolder);

module.exports = router;
