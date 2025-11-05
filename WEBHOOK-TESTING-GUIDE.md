# Payment Webhook Testing Guide

## Overview
This guide explains how to test the payment webhook system without integrating a real payment gateway.

## 🚀 How to Test Payment Flow

### Step 1: Start the Server
```bash
cd server
npm start
```
Server should be running on `http://localhost:5000`

### Step 2: Enroll in a Course
1. Open the frontend in browser
2. Navigate to a paid course
3. Click "Enroll Now"
4. Payment QR Modal will open

### Step 3: Check Browser Console
When the payment modal opens, you'll see:
```
🎯 === PAYMENT QR MODAL OPENED ===
📋 Enrollment ID: 673a1b2c3d4e5f6g7h8i9j0k
💰 Amount: ₹499
🏦 Merchant UPI: 9391774388@paytm
📱 Merchant Phone: 9391774388
```

**COPY THE ENROLLMENT ID** - you'll need it for the next step!

### Step 4: Simulate Payment Gateway Webhook
Open a new terminal and run:
```bash
cd server
node simulate-payment.js <ENROLLMENT_ID>
```

Example:
```bash
node simulate-payment.js 673a1b2c3d4e5f6g7h8i9j0k
```

### Step 5: Watch the Console Logs

#### In the Simulation Terminal:
You'll see the complete payment flow:
```
🚀 === PAYMENT GATEWAY SIMULATION START ===

📱 STEP 1: QR Code Scanned
   └─ Mobile Number: +91 9876543210
   └─ Payment App: PhonePe
   └─ User VPA: user@phonepe
   └─ Merchant VPA: 9391774388@paytm
   └─ QR Scan Time: 2025-11-05T10:30:45.123Z
   ✓ QR Code scan detected!

💳 STEP 2: Processing Payment...
   └─ User entered PIN
   └─ Authenticating with bank...
   └─ Checking account balance...
   ✓ Payment Successful!

✅ STEP 3: Payment Completed
   └─ Transaction ID: TXN1730803845123456
   └─ UPI Transaction ID: UPI1730803845123789
   └─ Bank Reference: BRN1730803845123
   └─ Status: SUCCESS
   └─ Amount: ₹499.00
   └─ Payment Time: 2025-11-05T10:30:50.123Z
   └─ Payment App: PhonePe

🔔 STEP 4: Sending Webhook to Backend
   └─ Webhook URL: http://localhost:5000/api/webhooks/payment
   └─ Order ID (Enrollment ID): 673a1b2c3d4e5f6g7h8i9j0k
```

#### In the Server Terminal:
You'll see detailed webhook processing:
```
═══════════════════════════════════════════════════════════
🔔 PAYMENT GATEWAY WEBHOOK RECEIVED
═══════════════════════════════════════════════════════════
⏰ Timestamp: 2025-11-05T10:30:50.500Z
📦 Webhook Payload: {
  "transactionId": "TXN1730803845123456",
  "orderId": "673a1b2c3d4e5f6g7h8i9j0k",
  "amount": 499.00,
  "status": "SUCCESS",
  ...
}

✅ ═══ PAYMENT SUCCESSFUL ═══
📱 Payment App: PhonePe
💳 Transaction ID: TXN1730803845123456
🔢 UPI Transaction ID: UPI1730803845123789
🏦 Bank Reference: BRN1730803845123
📞 Customer Phone: +919876543210
💰 Amount Paid: 499
🎯 Order ID: 673a1b2c3d4e5f6g7h8i9j0k

💾 ═══ DATABASE UPDATED ═══
✓ Enrollment Status: active
✓ Payment Status: completed
✓ Stored Transaction ID: TXN1730803845123456
✓ Stored Payment App: PhonePe
✓ Stored UPI Transaction ID: UPI1730803845123789

🎉 ═══ WEBHOOK PROCESSING COMPLETE ═══
✓ Payment verified successfully
✓ Enrollment activated
✓ User can now access course content
```

### Step 6: Verify Access
1. Refresh the course page
2. You should now have access to the course content
3. Check "My Courses" - the course should appear there

## 🔧 What the Simulation Does

1. **Simulates QR Scan**: Shows mobile number and payment app
2. **Simulates Payment Processing**: Mimics PIN entry and bank authentication
3. **Generates Transaction IDs**: Creates realistic transaction, UPI, and bank reference numbers
4. **Sends Webhook**: Posts to your backend webhook endpoint
5. **Verifies Signature**: Includes HMAC SHA256 signature for security
6. **Updates Database**: Backend processes webhook and grants access

## 📝 Testing Different Scenarios

### Test Successful Payment
```bash
node simulate-payment.js <ENROLLMENT_ID>
```

### Test with Different Payment Apps
Edit `simulate-payment.js` and change:
```javascript
paymentApp: 'GooglePay',  // or 'Paytm', 'BHIM', etc.
```

### Test Failed Payment
Edit the status in `simulate-payment.js`:
```javascript
status: 'FAILED',
```

## 🔍 Verifying the Results

### Check Database
You can verify the transaction was stored:
1. Connect to MongoDB
2. Find the enrollment by ID
3. Check fields:
   - `transactionId`
   - `paymentStatus` (should be 'completed')
   - `status` (should be 'active')
   - `paymentDetails.upiTransactionId`
   - `paymentDetails.paymentApp`

### Check Frontend
1. User should automatically have access to course
2. Course should appear in "My Courses"
3. All course content should be unlocked

## ⚠️ Important Notes

1. **Localhost Only**: This simulation only works with localhost
2. **Real Webhooks**: Real payment gateways require publicly accessible webhook URLs
3. **Production**: For production, you need:
   - Public domain with HTTPS
   - Webhook URL registered with payment gateway
   - Valid webhook secret from gateway
   - Proper signature verification

## 🐛 Troubleshooting

### Webhook Not Received
- Ensure server is running on port 5000
- Check if WEBHOOK_URL in simulate-payment.js is correct
- Verify enrollment ID exists

### Signature Verification Failed
- Check WEBHOOK_SECRET matches in both files
- Ensure .env file has the correct secret

### Transaction ID Not Stored
- Check server console for error messages
- Verify MongoDB connection
- Check enrollment exists before simulation

## 🎯 Next Steps for Production

For real payment integration:
1. Register with payment gateway (Razorpay, Stripe, PayU)
2. Get API keys and webhook secret
3. Deploy backend to public server with HTTPS
4. Register webhook URL with gateway
5. Test with real payments in sandbox mode
6. Go live after testing
