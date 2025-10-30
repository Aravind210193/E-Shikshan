const express = require('express');
const router = express.Router();
const adminBranchController = require('../controllers/adminBranchController');
const { adminAuth } = require('../middlewares/adminAuth');

// Apply authentication middleware to all routes
router.use(adminAuth);

// Branch routes
router.get('/', adminBranchController.getAllBranches);
router.get('/:id', adminBranchController.getBranchById);
router.post('/', adminBranchController.createBranch);
router.put('/:id', adminBranchController.updateBranch);
router.delete('/:id', adminBranchController.deleteBranch);
router.patch('/:id/toggle-status', adminBranchController.toggleBranchStatus);

module.exports = router;
