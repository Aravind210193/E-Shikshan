const express = require('express');
const router = express.Router();
const { handlePaymentWebhook, getPaymentStatus } = require('../controllers/paymentWebhookController');
const { protect } = require('../middlewares/authMiddleware');

// Public webhook endpoint (verified via signature)
// This is called by the payment gateway after payment completion
router.post('/payment', handlePaymentWebhook);

// Protected endpoint to check payment status
// Frontend can poll this to check if webhook was received
router.get('/payment-status/:orderId', protect, getPaymentStatus);

module.exports = router;
