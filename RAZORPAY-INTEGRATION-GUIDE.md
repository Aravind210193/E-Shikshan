# 🔐 Razorpay Payment Integration - Implementation Guide

## ✅ What's Been Done

### 1. Razorpay SDK Installed
- ✅ Added `razorpay` package to server dependencies
- ✅ Installed successfully with `npm install razorpay`

### 2. Environment Variables Configured
- ✅ Added Razorpay credentials to `server/.env`:
  - `RAZORPAY_KEY_ID` - Public key (used in frontend)
  - `RAZORPAY_KEY_SECRET` - Secret key (server-side only)
  - `RAZORPAY_WEBHOOK_SECRET` - Webhook signature verification

- ✅ Added Razorpay public key to `client/.env`:
  - `VITE_RAZORPAY_KEY_ID` - For frontend checkout

### 3. Backend Updated - Enrollment Controller
- ✅ Modified `server/src/controllers/enrollmentController.js`:
  - Initialized Razorpay SDK
  - Updated `enrollInCourse` to create real Razorpay orders
  - Generates `razorpayOrderId` for each paid enrollment
  - Returns order details to frontend for payment processing

---

## 📋 Remaining Tasks

### Task 1: Update Payment Webhook Controller ⚠️
**File**: `server/src/controllers/paymentWebhookController.js`

**Required Changes**:
1. Replace generic webhook handling with Razorpay-specific event handling
2. Handle `payment.captured` event (successful payment)
3. Handle `payment.failed` event (failed payment)
4. Verify Razorpay webhook signature using `x-razorpay-signature` header
5. Extract enrollment ID from payment notes
6. Update enrollment status based on payment result

**Key Implementation Points**:
- Webhook event format: `{ event: 'payment.captured', payload: { payment: { entity: {...} } } }`
- Payment data in `payload.payment.entity`
- Enrollment ID in `payment.notes.enrollmentId`
- Amount in paise (divide by 100 for rupees)
- VPA info in `payment.vpa` for UPI payments

### Task 2: Update Frontend Payment Modal ⚠️
**File**: `client/src/components/PaymentQRModal.jsx`

**Required Changes**:
1. Replace QR code display with Razorpay checkout button
2. Load Razorpay checkout script (`https://checkout.razorpay.com/v1/checkout.js`)
3. Initialize Razorpay with:
   - `key`: Razorpay Key ID from env
   - `order_id`: From enrollment response
   - `amount`: Course price in paise
   - `currency`: 'INR'
   - `name`: 'E-Shikshan'
   - `description`: Course title
   - `handler`: Success callback
   - `prefill`: User email, phone
   - `theme`: Match site theme

4. On payment success:
   - Razorpay automatically triggers webhook
   - Poll `GET /api/webhooks/payment-status/:enrollmentId` to check status
   - Redirect to course when status becomes 'active'

5. Remove TransactionVerificationModal completely

### Task 3: Clean Up Dummy Code ⚠️
**Files to Remove/Update**:
- ❌ Delete `server/simulate-payment.js`
- ❌ Delete `client/src/components/TransactionVerificationModal.jsx`
- ❌ Remove `processPayment` function from enrollmentController (deprecated)
- ❌ Remove `verifyTransactionAndGrantAccess` function (deprecated)
- ❌ Remove QR code generation logic from paymentConfig.js

---

##  🔑 Razorpay Dashboard Setup

### Step 1: Get API Keys
1. Go to https://dashboard.razorpay.com/
2. Navigate to **Settings** → **API Keys**
3. Generate **Test Mode** keys (for development)
4. Copy:
   - Key ID (starts with `rzp_test_`)
   - Key Secret (keep this secret!)

### Step 2: Configure Webhook
1. Go to **Settings** → **Webhooks**
2. Add new webhook URL: `https://your-domain.com/api/webhooks/payment`
3. Select events:
   - ✅ `payment.captured`
   - ✅ `payment.failed`
   - ✅ `payment.authorized` (optional)
4. Generate and copy **Webhook Secret**
5. Update environment variables with these values

### Step 3: Test Payment Flow
1. Use Razorpay test cards:
   - Success: `4111 1111 1111 1111`
   - Failure: `4000 0000 0000 0002`
   - CVV: Any 3 digits
   - Expiry: Any future date

---

## 📝 Environment Variables Template

### Server (.env)
```env
# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_your_key_id_here
RAZORPAY_KEY_SECRET=your_secret_key_here
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_here
```

### Client (.env)
```env
# Razorpay Public Key
VITE_RAZORPAY_KEY_ID=rzp_test_your_key_id_here
```

---

## 🔄 Payment Flow

### Current (Dummy) Flow:
1. User enrolls → enrollment created
2. QR code displayed with UPI ID
3. User pays manually and enters transaction ID
4. Backend manually verifies transaction
5. Access granted

### New (Razorpay) Flow:
1. User enrolls → enrollment created + Razorpay order created
2. Razorpay checkout modal opens
3. User completes payment through Razorpay
4. Razorpay automatically sends webhook to backend
5. Backend verifies signature and grants access
6. Frontend polls status and redirects when active

---

## 🐛 Debugging Tips

1. **Webhook not received**:
   - Check Razorpay dashboard → Webhooks → Logs
   - Ensure server URL is publicly accessible
   - Use ngrok for local testing: `ngrok http 5000`

2. **Signature verification fails**:
   - Confirm `RAZORPAY_WEBHOOK_SECRET` matches dashboard
   - Check webhook secret regeneration in dashboard

3. **Payment captured but enrollment not activated**:
   - Check enrollment ID in payment notes
   - Verify amount matches course price
   - Check server console logs

4. **Frontend checkout not opening**:
   - Verify Razorpay script loaded
   - Check `VITE_RAZORPAY_KEY_ID` environment variable
   - Inspect browser console for errors

---

## 📚 Razorpay Documentation
- Orders API: https://razorpay.com/docs/api/orders/
- Checkout Integration: https://razorpay.com/docs/payment-gateway/web-integration/standard/
- Webhooks: https://razorpay.com/docs/webhooks/
- Test Cards: https://razorpay.com/docs/payments/payments/test-card-details/

---

## 🚀 Next Steps

1. **Get Razorpay credentials** from dashboard
2. **Update environment variables** in both client and server
3. **Implement remaining tasks** (webhook controller, payment modal)
4. **Test with test mode** credentials
5. **Deploy and configure production webhook** URL
6. **Switch to live mode** credentials for production

---

**Status**: Backend infrastructure complete ✅ | Frontend integration pending ⚠️
