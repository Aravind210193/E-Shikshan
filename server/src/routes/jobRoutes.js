const express = require('express');
const router = express.Router();
const jobCtrl = require('../controllers/jobController');

// Public job listings (career pathways)
router.get('/', jobCtrl.getAll);
router.get('/:id', jobCtrl.getById);

module.exports = router;
