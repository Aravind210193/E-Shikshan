const express = require('express');
const router = express.Router();
const folderController = require('../controllers/folderController');

// Public routes
router.get('/', folderController.getAllFolders);
router.get('/branch/:branch', folderController.getFoldersByBranch);
router.get('/branch/:branch/subject/:subject', folderController.getFolderByBranchAndSubject);

module.exports = router;
