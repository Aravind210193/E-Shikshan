const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const passport = require('passport');

// @route   POST api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', authController.login);

// @route   POST api/auth/register
// @desc    Register new user
// @access  Public
router.post('/register', authController.register);

// Google OAuth routes
// @route   GET api/auth/google
// @desc    Start Google OAuth flow
// @access  Public
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// @route   GET api/auth/google/callback
// @desc    Google OAuth callback
// @access  Public
router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: `${process.env.CLIENT_URL || 'http://localhost:5173'}/login?error=google_auth_failed`,
    session: false 
  }),
  authController.googleAuthCallback
);

// @route   GET api/auth/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', protect, authController.getProfile);

// @route   GET api/auth/test
// @desc    Test auth middleware
// @access  Private
router.get('/test', protect, (req, res) => {
  res.json({
    message: 'Auth middleware working',
    user: req.user
  });
});

// @route   PUT api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, authController.updateProfile);

// @route   PUT api/auth/resume
// @desc    Save/Update user resume
// @access  Private
router.put('/resume', protect, authController.saveResume);

// @route   GET api/auth/resume
// @desc    Get user resume
// @access  Private
router.get('/resume', protect, authController.getResume);

// @route   POST api/auth/certificates
// @desc    Add certificate or badge
// @access  Private
router.post('/certificates', protect, authController.addCertificate);

// @route   GET api/auth/certificates
// @desc    Get user certificates and badges
// @access  Private
router.get('/certificates', protect, authController.getCertificates);

// @route   PUT api/auth/certificates/:id
// @desc    Update certificate or badge
// @access  Private
router.put('/certificates/:id', protect, authController.updateCertificate);

// @route   DELETE api/auth/certificates/:id
// @desc    Delete certificate or badge
// @access  Private
router.delete('/certificates/:id', protect, authController.deleteCertificate);

// @route   POST api/auth/login
// @desc    Login user & get token
// @access  Public
router.post('/login', authController.login);

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', authController.register);

module.exports = router;
