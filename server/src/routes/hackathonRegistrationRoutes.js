const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/hackathonRegistrationController');
const { protect } = require('../middlewares/authMiddleware');

// All routes require authentication
router.use(protect);

// Register for a hackathon
router.post('/:hackathonId/register', ctrl.register);

// Get my registrations
router.get('/my-registrations', ctrl.getMyRegistrations);

// Check if registered for a hackathon
router.get('/:hackathonId/check', ctrl.checkRegistration);

// Cancel registration
router.delete('/:hackathonId/cancel', ctrl.cancelRegistration);

module.exports = router;
