# Razorpay Payment Integration Setup

## Overview

The E-Shikshan platform now supports paid course enrollments through Razorpay payment gateway. This document explains the complete setup and workflow.

## Features Implemented

✅ Razorpay payment gateway integration
✅ Secure order creation on backend
✅ Payment signature verification
✅ Automatic enrollment activation after payment
✅ Support for both free and paid courses
✅ Fallback to manual payment entry if needed

## Server Setup

### 1. Install Dependencies

```bash
cd server
npm install
```

This installs the `razorpay` package added to dependencies.

### 2. Configure Razorpay Keys

Get your API keys from [Razorpay Dashboard](https://dashboard.razorpay.com/app/keys)

Update `server/.env`:

```env
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxx
```

**Important:** Use test keys for development, live keys for production.

### 3. Start the Server

```bash
npm run dev
# or
node server.js
```

Server will run on http://localhost:5000

## Client Setup

### 1. Install Dependencies

```bash
cd client
npm install
```

### 2. Start Client

```bash
npm run dev
```

Client will run on http://localhost:5173 (or your configured port)

## Payment Flow

### Step 1: User Views Course
- Course page displays all details (title, description, price, instructor, syllabus)
- Shows "Enroll Now" button

### Step 2: Login Check
- On clicking "Enroll Now", system checks if user is logged in
- If not logged in → Redirects to `/login`
- If logged in → Shows enrollment form modal

### Step 3: User Fills Enrollment Details
- Full Name (required)
- Email (required)
- Phone (required)
- Address (required)

### Step 4: Payment Integration
- **Free Courses**: Instant enrollment, access granted immediately
- **Paid Courses**: 
  1. Backend creates pending enrollment
  2. Backend creates Razorpay order (POST `/api/payment/create-order`)
  3. Razorpay Checkout opens in browser
  4. User completes payment

### Step 5: Payment Verification
- After successful payment, Razorpay sends response with:
  - `razorpay_payment_id`
  - `razorpay_order_id`
  - `razorpay_signature`
- Frontend sends these to backend (POST `/api/payment/verify`)
- Backend verifies HMAC signature
- If valid:
  - Marks enrollment as `completed`
  - Sets enrollment status to `active`
  - Increments course student count
  - Returns success

### Step 6: Access Granted
- Frontend updates UI to show "You're enrolled!"
- Course content unlocked:
  - Video lectures
  - Assignments
  - Projects
  - Quizzes (if applicable)

## API Endpoints

### Payment Endpoints

#### Create Razorpay Order
```
POST /api/payment/create-order
Authorization: Bearer <user_token>
Content-Type: application/json

{
  "amount": 49900,  // Amount in paise (₹499.00)
  "currency": "INR",
  "courseId": "course_id_here",
  "enrollmentId": "enrollment_id_here"
}

Response:
{
  "order": {
    "id": "order_xxxxx",
    "amount": 49900,
    "currency": "INR",
    ...
  },
  "key": "rzp_test_xxxxx"
}
```

#### Verify Payment
```
POST /api/payment/verify
Authorization: Bearer <user_token>
Content-Type: application/json

{
  "razorpay_payment_id": "pay_xxxxx",
  "razorpay_order_id": "order_xxxxx",
  "razorpay_signature": "signature_xxxxx",
  "enrollmentId": "enrollment_id_here"
}

Response:
{
  "message": "Payment verified successfully",
  "enrollment": { ... }
}
```

### Enrollment Endpoints

#### Check Enrollment Status
```
GET /api/enrollments/check/:courseId
Authorization: Bearer <user_token>

Response:
{
  "enrolled": true,
  "hasAccess": true,
  "paymentStatus": "completed",
  "enrollment": { ... }
}
```

#### Get My Enrollments
```
GET /api/enrollments/my-courses
Authorization: Bearer <user_token>

Response: [
  {
    "_id": "...",
    "courseId": { ... },
    "paymentStatus": "completed",
    "status": "active",
    ...
  }
]
```

## Database Schema

### Enrollment Model
```javascript
{
  userId: ObjectId,          // Reference to User
  courseId: ObjectId,        // Reference to Course
  userDetails: {
    fullName: String,
    email: String,
    phone: String,
    address: String
  },
  paymentStatus: String,     // 'pending' | 'completed' | 'failed' | 'free'
  paymentMethod: String,     // 'razorpay' | 'free' | 'admin_granted'
  transactionId: String,     // Razorpay payment_id
  amountPaid: Number,
  paymentDate: Date,
  status: String,            // 'active' | 'completed' | 'cancelled' | 'suspended'
  enrolledAt: Date,
  progress: {
    videosWatched: [ObjectId],
    assignmentsCompleted: [ObjectId],
    projectsCompleted: [ObjectId],
    overallProgress: Number  // 0-100
  }
}
```

## Testing

### Test with Razorpay Test Mode

1. Use test API keys in `.env`
2. Go to any paid course page
3. Click "Enroll Now"
4. Fill enrollment form
5. Razorpay checkout will open
6. Use test card details:
   - **Card Number**: 4111 1111 1111 1111
   - **CVV**: Any 3 digits
   - **Expiry**: Any future date
   - **Name**: Any name

7. Complete payment
8. Verify enrollment is marked as completed
9. Verify course content is unlocked

### Manual Testing Checklist

- [ ] Free course enrollment works without payment
- [ ] Paid course triggers Razorpay checkout
- [ ] Payment verification succeeds with test credentials
- [ ] Enrollment status updates to active
- [ ] Course content unlocks after payment
- [ ] User can see enrolled courses
- [ ] Enrollment count increments
- [ ] Invalid payment signature is rejected
- [ ] Duplicate enrollment prevented

## Security Features

✅ JWT-based authentication
✅ Razorpay signature verification (HMAC-SHA256)
✅ Backend validates enrollment ownership
✅ Prevents duplicate enrollments
✅ Secure environment variable storage
✅ No sensitive data in frontend

## Troubleshooting

### Razorpay Checkout Not Opening
- Check if `RAZORPAY_KEY_ID` is set in server `.env`
- Verify server is running on port 5000
- Check browser console for errors
- Ensure Razorpay script loads (check Network tab)

### Payment Verification Fails
- Verify `RAZORPAY_KEY_SECRET` matches your Razorpay dashboard
- Check server logs for signature mismatch
- Ensure all three fields sent: order_id, payment_id, signature

### 401 Unauthorized
- User token may be expired
- Check `localStorage.getItem('token')` in browser console
- Re-login if needed

### Server Not Starting
- Run `npm install` in server directory
- Check MongoDB connection string in `.env`
- Verify port 5000 is not in use

## Production Deployment

### Before Going Live

1. **Switch to Live Keys**
   - Get live keys from Razorpay Dashboard
   - Update `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in production `.env`

2. **Enable Webhooks (Recommended)**
   - Set up webhook endpoint: `POST /api/payment/webhook`
   - Add webhook secret to `.env`: `RAZORPAY_WEBHOOK_SECRET`
   - Configure webhook URL in Razorpay Dashboard

3. **SSL Certificate**
   - Ensure your production site has valid SSL (HTTPS)
   - Razorpay requires HTTPS for live mode

4. **Environment Variables**
   - Never commit `.env` to git
   - Use environment variable management in production (e.g., Vercel, Heroku, AWS)

5. **Testing in Production**
   - Test with real low-amount transactions
   - Verify email notifications (if implemented)
   - Monitor Razorpay dashboard for transactions

## Support

For Razorpay integration issues:
- [Razorpay Documentation](https://razorpay.com/docs/)
- [Razorpay API Reference](https://razorpay.com/docs/api/)
- [Razorpay Support](https://razorpay.com/support/)

For application issues:
- Check server logs
- Check browser console
- Verify database connection
- Review API endpoint responses

## License

This integration is part of the E-Shikshan platform.
