const crypto = require('crypto');
const axios = require('axios');

// Test Payment Webhook
// This script simulates a payment gateway sending a webhook to our backend

const BACKEND_URL = 'http://localhost:5000';
const WEBHOOK_SECRET = 'your_webhook_secret_key'; // Should match .env PAYMENT_WEBHOOK_SECRET

// Function to generate webhook signature
function generateSignature(transactionId, orderId, amount, status, timestamp) {
  const signatureString = `${transactionId}|${orderId}|${amount}|${status}|${timestamp}`;
  return crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(signatureString)
    .digest('hex');
}

// Test webhook payload
async function testWebhook() {
  // Replace with actual enrollment ID from your database
  const enrollmentId = '673a1234567890abcdef1234'; // CHANGE THIS to actual enrollment ID
  
  const webhookPayload = {
    // Main transaction details
    transactionId: `TXN${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    orderId: enrollmentId, // This should be the enrollment ID
    amount: 4999.00, // Should match course price
    status: 'SUCCESS', // Can be: SUCCESS, FAILED, PENDING
    timestamp: new Date().toISOString(),
    
    // Payment method details
    paymentMethod: 'upi',
    
    // Customer details
    customerPhone: '+91 9876543210',
    customerEmail: 'student@example.com',
    
    // UPI and App-specific details
    upiTransactionId: `UPI${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`, // UPI transaction reference
    paymentApp: 'PhonePe', // PhonePe, GooglePay, Paytm, BHIM, etc.
    bankReferenceNumber: `RRN${Date.now().toString().substr(-12)}`, // Bank retrieval reference number
    vpa: '9876543210@ybl', // Customer's UPI ID
    payerVPA: '9876543210@ybl', // Payer's UPI ID
    payeeVPA: '9391774388@paytm' // Merchant's UPI ID
  };

  // Generate signature
  webhookPayload.signature = generateSignature(
    webhookPayload.transactionId,
    webhookPayload.orderId,
    webhookPayload.amount,
    webhookPayload.status,
    webhookPayload.timestamp
  );

  console.log('🚀 Sending webhook to backend...');
  console.log('📦 Payload:', JSON.stringify(webhookPayload, null, 2));

  try {
    const response = await axios.post(
      `${BACKEND_URL}/api/webhooks/payment`,
      webhookPayload,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Signature': webhookPayload.signature
        }
      }
    );

    console.log('✅ Webhook successful!');
    console.log('📬 Response:', response.data);
  } catch (error) {
    console.error('❌ Webhook failed!');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

// Test different payment statuses
async function testAllStatuses(enrollmentId) {
  const statuses = ['SUCCESS', 'FAILED', 'PENDING'];
  const paymentApps = ['PhonePe', 'GooglePay', 'Paytm', 'BHIM'];
  
  for (const status of statuses) {
    console.log(`\n\n${'='.repeat(50)}`);
    console.log(`Testing ${status} status`);
    console.log('='.repeat(50));
    
    const randomApp = paymentApps[Math.floor(Math.random() * paymentApps.length)];
    
    const webhookPayload = {
      transactionId: `TXN${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      orderId: enrollmentId,
      amount: 4999.00,
      status: status,
      timestamp: new Date().toISOString(),
      paymentMethod: 'upi',
      customerPhone: '+91 9876543210',
      customerEmail: 'student@example.com',
      upiTransactionId: `UPI${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      paymentApp: randomApp,
      bankReferenceNumber: `RRN${Date.now().toString().substr(-12)}`,
      vpa: '9876543210@ybl',
      payerVPA: '9876543210@ybl',
      payeeVPA: '9391774388@paytm'
    };

    webhookPayload.signature = generateSignature(
      webhookPayload.transactionId,
      webhookPayload.orderId,
      webhookPayload.amount,
      webhookPayload.status,
      webhookPayload.timestamp
    );

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/webhooks/payment`,
        webhookPayload
      );
      console.log('✅ Success:', response.data);
    } catch (error) {
      console.error('❌ Failed:', error.response?.data || error.message);
    }
    
    // Wait 1 second between tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

// Run the test
console.log('🧪 Payment Webhook Test Script');
console.log('================================\n');

// Uncomment one of these:
testWebhook(); // Test single webhook
// testAllStatuses('YOUR_ENROLLMENT_ID_HERE'); // Test all statuses
