const express = require('express');
const router = express.Router();
const branchController = require('../controllers/branchController');

// Public routes
router.get('/', branchController.getAllBranches);
router.get('/:id', branchController.getBranchById);
router.get('/title/:title', branchController.getBranchByTitle);

module.exports = router;
