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
  // Enrollment status
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled', 'suspended'],
    default: 'active'
  },
  enrolledAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
  // Progress tracking
  progress: {
    videosWatched: [{ type: mongoose.Schema.Types.ObjectId }],
    assignmentsCompleted: [{ type: mongoose.Schema.Types.ObjectId }],
    projectsCompleted: [{ type: mongoose.Schema.Types.ObjectId }],
    quizzesTaken: [{ type: mongoose.Schema.Types.ObjectId }],
    overallProgress: { type: Number, default: 0, min: 0, max: 100 }
  },
  // Certificate
  certificateIssued: { type: Boolean, default: false },
  certificateId: { type: String },
  certificateIssuedAt: { type: Date }
}, { timestamps: true });

// Create compound index to prevent duplicate enrollments
EnrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', EnrollmentSchema);
