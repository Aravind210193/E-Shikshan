// Payment Configuration
// Update these details for payment collection

export const PAYMENT_CONFIG = {
  // UPI Details
  phoneNumber: '9391774388',
  upiId: '9391774388@paytm', // Format: phone@provider (paytm, okaxis, ybl, etc.)
  
  // Merchant Details
  merchantName: 'E-Shikshan',
  merchantVPA: '9391774388@paytm',
  
  // Alternative UPI IDs (if available)
  alternativeUPIs: [
    '9391774388@paytm',
    '9391774388@ybl',     // Google Pay
    '9391774388@okaxis',  // Google Pay (Axis)
    '9391774388@oksbi',   // Google Pay (SBI)
    '9391774388@okicici', // PhonePe
  ],
  
  // Payment Gateway Settings (for future integration)
  razorpay: {
    enabled: false,
    keyId: process.env.REACT_APP_RAZORPAY_KEY_ID || '',
  },
  
  stripe: {
    enabled: false,
    publishableKey: process.env.REACT_APP_STRIPE_KEY || '',
  },
  
  // QR Code Settings
  qrCode: {
    size: 250,
    format: 'png',
    errorCorrectionLevel: 'M',
  },
  
  // Polling Settings
  polling: {
    interval: 5000, // 5 seconds
    maxAttempts: 60, // 5 minutes total (60 * 5s)
    timeoutMessage: 'Payment verification timeout. Please contact support if payment was made.',
  },
};

// Generate UPI deep link
export const generateUPILink = (amount, transactionNote, upiId = PAYMENT_CONFIG.upiId) => {
  const params = new URLSearchParams({
    pa: upiId,
    pn: PAYMENT_CONFIG.merchantName,
    am: amount.toFixed(2),
    tn: transactionNote,
    cu: 'INR',
  });
  
  return `upi://pay?${params.toString()}`;
};

// Generate QR code URL
export const generateQRCodeURL = (upiLink) => {
  const encodedLink = encodeURIComponent(upiLink);
  return `https://api.qrserver.com/v1/create-qr-code/?size=${PAYMENT_CONFIG.qrCode.size}x${PAYMENT_CONFIG.qrCode.size}&data=${encodedLink}`;
};

export default PAYMENT_CONFIG;
