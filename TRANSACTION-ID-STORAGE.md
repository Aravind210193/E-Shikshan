# Transaction ID Storage System

## Overview
When a user pays via UPI (PhonePe, Google Pay, Paytm, BHIM, etc.), the payment app generates a unique transaction ID. Our webhook system captures and stores this transaction ID along with comprehensive payment details.

---

## Transaction ID Flow

```
User Pays via UPI App (PhonePe/GPay/Paytm)
          ↓
Payment App Generates Transaction ID
          ↓
Payment Gateway Receives Payment
          ↓
Gateway Sends Webhook with Transaction Details
          ↓
Backend Stores All Transaction Information
          ↓
Database Contains Complete Payment Record
```

---

## Stored Transaction Information

### Primary Transaction IDs:
1. **transactionId** - Main transaction ID from payment gateway
2. **upiTransactionId** - UPI-specific transaction reference number
3. **bankReferenceNumber** - Bank RRN (Retrieval Reference Number)

### Payment App Details:
- **paymentApp** - Which app was used (PhonePe, GooglePay, Paytm, BHIM, etc.)
- **paymentSource** - Descriptive text (e.g., "Paid via PhonePe")
- **paymentMethod** - Payment type (upi, card, netbanking, wallet)

### UPI Details:
- **vpa** - Virtual Payment Address used for payment
- **payerVPA** - Customer's UPI ID (e.g., 9876543210@ybl)
- **payeeVPA** - Merchant's UPI ID (e.g., 9391774388@paytm)

### Customer Information:
- **customerPhone** - Customer's phone number
- **customerEmail** - Customer's email address
- **amount** - Payment amount
- **orderId** - Enrollment/Order ID

### Status & Timestamps:
- **gatewayStatus** - Payment status (SUCCESS, FAILED, PENDING)
- **verifiedAt** - When webhook was verified
- **webhookReceivedAt** - When webhook was received
- **paymentCompletedAt** - When payment was completed
- **paymentDate** - Date of payment

---

## Database Schema

### Enrollment Model Fields:
```javascript
{
  transactionId: String, // Main transaction ID
  amountPaid: Number,
  paymentDate: Date,
  paymentStatus: 'pending' | 'completed' | 'failed' | 'free',
  
  paymentDetails: {
    // Transaction identifiers
    transactionId: String,
    upiTransactionId: String,
    orderId: String,
    bankReferenceNumber: String,
    
    // Payment app details
    paymentApp: String,        // "PhonePe", "GooglePay", "Paytm", "BHIM"
    paymentSource: String,     // "Paid via PhonePe"
    method: String,            // "upi"
    
    // UPI details
    vpa: String,               // "9876543210@ybl"
    payerVPA: String,          // Customer's UPI ID
    payeeVPA: String,          // "9391774388@paytm"
    
    // Customer info
    amount: Number,
    customerPhone: String,
    customerEmail: String,
    
    // Status
    gatewayStatus: String,
    verifiedAt: Date,
    webhookReceivedAt: Date,
    paymentCompletedAt: Date,
    
    // Failure details (if any)
    failureReason: String,
    failedAt: Date
  }
}
```

---

## Webhook Payload Example

### What Payment Gateway Sends:
```json
{
  "transactionId": "TXN1699123456789ABC",
  "upiTransactionId": "UPI123456789DEF",
  "orderId": "673a1234567890abcdef1234",
  "amount": 4999.00,
  "status": "SUCCESS",
  "timestamp": "2025-11-05T10:30:45.123Z",
  "signature": "a1b2c3d4e5f6...",
  
  "paymentMethod": "upi",
  "paymentApp": "PhonePe",
  "bankReferenceNumber": "RRN334455667788",
  
  "vpa": "9876543210@ybl",
  "payerVPA": "9876543210@ybl",
  "payeeVPA": "9391774388@paytm",
  
  "customerPhone": "+91 9876543210",
  "customerEmail": "student@example.com"
}
```

### What Gets Stored in Database:
```json
{
  "_id": "673a1234567890abcdef1234",
  "userId": "user123",
  "courseId": "course456",
  "paymentStatus": "completed",
  "transactionId": "TXN1699123456789ABC",
  "amountPaid": 4999.00,
  "paymentDate": "2025-11-05T10:30:45.123Z",
  
  "paymentDetails": {
    "transactionId": "TXN1699123456789ABC",
    "upiTransactionId": "UPI123456789DEF",
    "orderId": "673a1234567890abcdef1234",
    "bankReferenceNumber": "RRN334455667788",
    
    "paymentApp": "PhonePe",
    "paymentSource": "Paid via PhonePe",
    "method": "upi",
    
    "vpa": "9876543210@ybl",
    "payerVPA": "9876543210@ybl",
    "payeeVPA": "9391774388@paytm",
    
    "amount": 4999.00,
    "customerPhone": "+91 9876543210",
    "customerEmail": "student@example.com",
    
    "gatewayStatus": "SUCCESS",
    "verifiedAt": "2025-11-05T10:30:46.000Z",
    "webhookReceivedAt": "2025-11-05T10:30:46.000Z",
    "paymentCompletedAt": "2025-11-05T10:30:45.123Z"
  }
}
```

---

## Webhook Processing Logs

### Console Output When Transaction ID is Stored:
```
🔔 Payment Gateway Webhook Received
📦 Webhook Payload: {...}
✅ Webhook signature verified
✅ Enrollment found: 673a1234567890abcdef1234
✅ Amount verified: 4999
✅ Payment successful - Updating enrollment
📱 Payment App: PhonePe
💳 Transaction ID: TXN1699123456789ABC
🔢 UPI Transaction ID: UPI123456789DEF
🏦 Bank Reference: RRN334455667788
💾 Enrollment updated successfully
📝 Stored Transaction ID: TXN1699123456789ABC
💳 Stored Payment App: PhonePe
🔢 Stored UPI Transaction ID: UPI123456789DEF
📊 Course student count incremented: 125
🎉 Payment webhook processed successfully
```

---

## Testing Transaction ID Storage

### 1. Using Test Script:
```bash
cd server
node test-webhook.js
```

The script will:
- Generate a random transaction ID
- Simulate payment from PhonePe/GooglePay/Paytm
- Send webhook to backend
- Backend stores all transaction details

### 2. Check Database:
```javascript
// MongoDB query to see stored transaction
db.enrollments.findOne({ _id: ObjectId('ENROLLMENT_ID') })

// Will show:
{
  transactionId: "TXN1699123456789ABC",
  paymentDetails: {
    transactionId: "TXN1699123456789ABC",
    upiTransactionId: "UPI123456789DEF",
    paymentApp: "PhonePe",
    bankReferenceNumber: "RRN334455667788",
    ...
  }
}
```

---

## Real-World Transaction ID Formats

### PhonePe:
```
transactionId: "T2025110512345678901"
upiTransactionId: "PP0012345678901234"
bankReferenceNumber: "334455667788"
paymentApp: "PhonePe"
```

### Google Pay:
```
transactionId: "GPAY2025110512345678"
upiTransactionId: "024567890123"
bankReferenceNumber: "445566778899"
paymentApp: "GooglePay"
```

### Paytm:
```
transactionId: "PTM2025110512345678"
upiTransactionId: "PTM0012345678901234"
bankReferenceNumber: "556677889900"
paymentApp: "Paytm"
```

### BHIM:
```
transactionId: "BHIM2025110512345678"
upiTransactionId: "BHIM012345678901"
bankReferenceNumber: "667788990011"
paymentApp: "BHIM"
```

---

## Retrieval & Usage

### Get Transaction Details from Enrollment:
```javascript
// Backend API
const enrollment = await Enrollment.findById(enrollmentId);

console.log('Transaction ID:', enrollment.transactionId);
console.log('Payment App:', enrollment.paymentDetails.paymentApp);
console.log('UPI Transaction:', enrollment.paymentDetails.upiTransactionId);
console.log('Bank Reference:', enrollment.paymentDetails.bankReferenceNumber);
console.log('Customer UPI:', enrollment.paymentDetails.payerVPA);
```

### Display to User:
```javascript
// Frontend
<div>
  <p>Transaction ID: {enrollment.transactionId}</p>
  <p>Paid via: {enrollment.paymentDetails.paymentApp}</p>
  <p>UPI ID Used: {enrollment.paymentDetails.payerVPA}</p>
  <p>Bank Reference: {enrollment.paymentDetails.bankReferenceNumber}</p>
  <p>Payment Date: {enrollment.paymentDate}</p>
</div>
```

---

## Benefits of Storing Transaction IDs

1. **Payment Tracking** - Complete audit trail of all payments
2. **Dispute Resolution** - Reference transaction ID for payment disputes
3. **Reconciliation** - Match bank statements with app transactions
4. **Customer Support** - Help users track their payments
5. **Analytics** - Know which payment apps are most popular
6. **Compliance** - Legal requirement to maintain transaction records
7. **Refunds** - Use transaction ID for processing refunds

---

## Compliance & Record Keeping

### Retention Period:
- Store transaction IDs for **7 years** (legal requirement)
- Keep payment details encrypted
- Regular backups of payment data

### Data Security:
- Transaction IDs stored in secure database
- Access restricted to authorized personnel
- Audit logs for all transaction queries

---

## Files Modified:

1. ✅ `server/src/models/Enrollment.js` - Added comprehensive payment fields
2. ✅ `server/src/controllers/paymentWebhookController.js` - Enhanced transaction storage
3. ✅ `server/test-webhook.js` - Updated test payload with transaction IDs

---

## Quick Reference

| Field | Example | Description |
|-------|---------|-------------|
| transactionId | TXN1699123456789ABC | Main gateway transaction ID |
| upiTransactionId | UPI123456789DEF | UPI-specific reference |
| bankReferenceNumber | RRN334455667788 | Bank retrieval reference |
| paymentApp | PhonePe | Which app was used |
| payerVPA | 9876543210@ybl | Customer's UPI ID |
| payeeVPA | 9391774388@paytm | Merchant's UPI ID |

---

**Transaction ID storage is now fully implemented and operational!** ✅

Every payment will automatically store:
- Transaction ID from payment app
- UPI transaction reference
- Bank reference number
- Payment app name
- Customer UPI ID
- Complete timestamp trail

All data is securely stored in MongoDB and can be retrieved for support, disputes, or reconciliation.
