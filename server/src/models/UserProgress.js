const mongoose = require('mongoose');

// Quiz Attempt Schema
const QuizAttemptSchema = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, required: true },
  attemptNumber: { type: Number, required: true },
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  percentage: { type: Number, required: true },
  passed: { type: Boolean, required: true },
  answers: [{
    questionId: mongoose.Schema.Types.ObjectId,
    selectedAnswer: Number,
    isCorrect: Boolean
  }],
  completedAt: { type: Date, default: Date.now }
}, { _id: true });

// Assignment Submission Schema
const AssignmentSubmissionSchema = new mongoose.Schema({
  assignmentId: { type: mongoose.Schema.Types.ObjectId, required: true },
  submittedAt: { type: Date, default: Date.now },
  submissionUrl: { type: String },
  status: { 
    type: String, 
    enum: ['submitted', 'graded', 'pending'], 
    default: 'submitted' 
  },
  grade: { type: Number }, // Points received
  feedback: { type: String }
}, { _id: true });

// Module Progress Schema
const ModuleProgressSchema = new mongoose.Schema({
  moduleId: { type: mongoose.Schema.Types.ObjectId, required: true },
  completedVideos: [{ type: mongoose.Schema.Types.ObjectId }],
  downloadedResources: [{ type: mongoose.Schema.Types.ObjectId }],
  completedAssignments: [{ type: mongoose.Schema.Types.ObjectId }],
  completedQuizzes: [{ type: mongoose.Schema.Types.ObjectId }],
  isCompleted: { type: Boolean, default: false },
  completedAt: { type: Date }
}, { _id: true });

// User Progress Schema
const UserProgressSchema = new mongoose.Schema({
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
  enrollmentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Enrollment',
    required: true
  },
  
  // Module Progress
  moduleProgress: [ModuleProgressSchema],
  
  // Quiz Attempts
  quizAttempts: [QuizAttemptSchema],
  
  // Assignment Submissions
  assignmentSubmissions: [AssignmentSubmissionSchema],
  
  // Overall Progress
  overallProgress: { type: Number, default: 0, min: 0, max: 100 }, // Percentage
  lastAccessedAt: { type: Date, default: Date.now },
  
  // Completion Status
  isCompleted: { type: Boolean, default: false },
  completedAt: { type: Date },
  certificateIssued: { type: Boolean, default: false },
  certificateIssuedAt: { type: Date }
}, { timestamps: true });

// Compound index for faster queries
UserProgressSchema.index({ userId: 1, courseId: 1 }, { unique: true });

// Method to calculate overall progress
UserProgressSchema.methods.calculateProgress = function() {
  // This will be populated with actual calculation logic
  // Based on completed videos, assignments, quizzes, etc.
  return this.overallProgress;
};

// Method to check if user can access next module
UserProgressSchema.methods.canAccessModule = function(moduleOrder) {
  if (moduleOrder === 1) return true; // First module always accessible
  
  const previousModule = this.moduleProgress.find(mp => 
    mp.moduleOrder === moduleOrder - 1
  );
  
  return previousModule && previousModule.isCompleted;
};

module.exports = mongoose.model('UserProgress', UserProgressSchema);
