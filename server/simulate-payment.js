/**
 * Payment Simulation Script
 * This simulates what a real payment gateway would do:
 * 1. QR code scanned
 * 2. Payment completed
 * 3. Webhook sent to backend
 * 
 * Usage: node simulate-payment.js <enrollmentId>
 */

const axios = require('axios');
const crypto = require('crypto');

// Configuration
const WEBHOOK_URL = 'http://localhost:5000/api/webhooks/payment';
const WEBHOOK_SECRET = 'your-webhook-secret-key-change-in-production'; // Default secret

// Simulated payment gateway data
const simulatePayment = async (enrollmentId) => {
  console.log('\n🚀 === PAYMENT GATEWAY SIMULATION START ===\n');
  
  // STEP 1: QR Code Scanned
  console.log('📱 STEP 1: QR Code Scanned');
  console.log('   └─ Mobile Number: +91 9876543210');
  console.log('   └─ Payment App: PhonePe');
  console.log('   └─ User VPA: user@phonepe');
  console.log('   └─ Merchant VPA: 9391774388@paytm');
  console.log('   └─ QR Scan Time:', new Date().toISOString());
  console.log('   ✓ QR Code scan detected!\n');
  
  await sleep(2000); // Simulate user entering PIN
  
  // STEP 2: Payment Processing
  console.log('💳 STEP 2: Processing Payment...');
  console.log('   └─ User entered PIN');
  console.log('   └─ Authenticating with bank...');
  console.log('   └─ Checking account balance...');
  
  await sleep(3000);
  
  // STEP 3: Payment Completed
  const transactionId = `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`;
  const upiTransactionId = `UPI${Date.now()}${Math.floor(Math.random() * 1000)}`;
  const bankReferenceNumber = `BRN${Date.now()}`;
  
  console.log('   ✓ Payment Successful!\n');
  
  console.log('✅ STEP 3: Payment Completed');
  console.log('   └─ Transaction ID:', transactionId);
  console.log('   └─ UPI Transaction ID:', upiTransactionId);
  console.log('   └─ Bank Reference:', bankReferenceNumber);
  console.log('   └─ Status: SUCCESS');
  console.log('   └─ Amount: ₹499.00');
  console.log('   └─ Payment Time:', new Date().toISOString());
  console.log('   └─ Payment App: PhonePe\n');
  
  // STEP 4: Sending Webhook to Backend
  console.log('🔔 STEP 4: Sending Webhook to Backend');
  console.log('   └─ Webhook URL:', WEBHOOK_URL);
  console.log('   └─ Order ID (Enrollment ID):', enrollmentId);
  
  // Prepare webhook payload
  const webhookPayload = {
    transactionId: transactionId,
    upiTransactionId: upiTransactionId,
    orderId: enrollmentId, // This is the enrollment ID
    amount: 499.00,
    status: 'SUCCESS',
    timestamp: new Date().toISOString(),
    paymentMethod: 'upi',
    paymentApp: 'PhonePe',
    bankReferenceNumber: bankReferenceNumber,
    customerPhone: '+919876543210',
    customerEmail: 'user@example.com',
    vpa: 'user@phonepe',
    payerVPA: 'user@phonepe',
    payeeVPA: '9391774388@paytm'
  };
  
  // Generate signature (Format: transactionId|orderId|amount|status|timestamp)
  const signatureString = `${webhookPayload.transactionId}|${webhookPayload.orderId}|${webhookPayload.amount}|${webhookPayload.status}|${webhookPayload.timestamp}`;
  const signature = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(signatureString)
    .digest('hex');
  
  webhookPayload.signature = signature;
  
  console.log('   └─ Signature String:', signatureString);
  console.log('   └─ Signature:', signature);
  console.log('   └─ Payload:', JSON.stringify(webhookPayload, null, 2));
  
  try {
    console.log('\n📤 Sending webhook to backend...\n');
    const response = await axios.post(WEBHOOK_URL, webhookPayload, {
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Signature': signature
      }
    });
    
    console.log('✅ WEBHOOK RESPONSE:');
    console.log('   └─ Status:', response.status);
    console.log('   └─ Response:', JSON.stringify(response.data, null, 2));
    console.log('\n🎉 Payment simulation completed successfully!');
    console.log('   └─ Enrollment should now be ACTIVE');
    console.log('   └─ User should have access to course content');
    
  } catch (error) {
    console.error('\n❌ WEBHOOK ERROR:');
    if (error.response) {
      console.error('   └─ Status:', error.response.status);
      console.error('   └─ Error:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('   └─ Error:', error.message);
    }
  }
  
  console.log('\n🏁 === PAYMENT GATEWAY SIMULATION END ===\n');
};

// Helper function to simulate delay
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Get enrollment ID from command line
const enrollmentId = process.argv[2];

if (!enrollmentId) {
  console.error('❌ Error: Enrollment ID is required');
  console.log('Usage: node simulate-payment.js <enrollmentId>');
  console.log('Example: node simulate-payment.js 673a1b2c3d4e5f6g7h8i9j0k');
  process.exit(1);
}

// Run simulation
simulatePayment(enrollmentId);
