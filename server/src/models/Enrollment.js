const mongoose = require('mongoose');

const EnrollmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  // User details at time of enrollment
  userDetails: {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    address: { type: String }
  },
  // Payment details
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'free'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'upi', 'netbanking', 'wallet', 'free', 'admin_granted'],
    default: 'free'
  },
  transactionId: { type: String },
  amountPaid: { type: Number, default: 0 },
  paymentDate: { type: Date },
  paymentDetails: {
    // Transaction identifiers
    transactionId: { type: String }, // Main transaction ID from payment gateway
    upiTransactionId: { type: String }, // UPI-specific transaction reference
    orderId: { type: String }, // Order/Enrollment ID
    bankReferenceNumber: { type: String }, // Bank RRN (Retrieval Reference Number)

    // Payment app and method details
    paymentApp: { type: String }, // PhonePe, GooglePay, Paytm, BHIM, etc.
    paymentSource: { type: String }, // Descriptive source (e.g., "Paid via PhonePe")
    method: { type: String }, // upi, card, netbanking, wallet

    // UPI details
    vpa: { type: String }, // Virtual Payment Address used
    payerVPA: { type: String }, // Customer's UPI ID
    payeeVPA: { type: String }, // Merchant's UPI ID (e.g., 9391774388@paytm)

    // Amount and customer details
    amount: { type: Number },
    phoneNumber: { type: String },
    customerPhone: { type: String },
    customerEmail: { type: String },

    // Status and timestamps
    gatewayStatus: { type: String }, // SUCCESS, FAILED, PENDING, COMPLETED
    verifiedAt: { type: Date },
    webhookReceivedAt: { type: Date },
    paymentCompletedAt: { type: Date },

    // Failure details (if applicable)
    failureReason: { type: String },
    failedAt: { type: Date },
    pendingAt: { type: Date },

    // Additional fields for reconciliation
    expectedAmount: { type: Number },
    receivedAmount: { type: Number }
  },
  // Enrollment status
  status: {
    type: String,
    enum: ['pending', 'active', 'completed', 'cancelled', 'suspended'],
    default: 'pending'
  },
  enrolledAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
  // Progress tracking
  progress: {
    videosWatched: [{ type: mongoose.Schema.Types.ObjectId }],
    assignmentsCompleted: [{ type: mongoose.Schema.Types.ObjectId }],
    projectsCompleted: [{ type: mongoose.Schema.Types.ObjectId }],
    quizzesTaken: [{ type: mongoose.Schema.Types.ObjectId }],
    overallProgress: { type: Number, default: 0, min: 0, max: 100 },
    points: { type: Number, default: 0 }
  },
  // Certificate
  certificateIssued: { type: Boolean, default: false },
  certificateId: { type: String },
  certificateIssuedAt: { type: Date }
}, { timestamps: true });

// Create compound index to prevent duplicate enrollments
EnrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', EnrollmentSchema);
