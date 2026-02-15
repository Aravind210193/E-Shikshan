const mongoose = require('mongoose');

// Quiz Question Schema
const QuizQuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }], // 4 options
  correctAnswer: { type: Number, required: true, min: 0, max: 3 }, // Index of correct option
  explanation: { type: String },
  points: { type: Number, default: 1 }
}, { _id: true });

// Quiz Schema
const QuizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  duration: { type: Number, default: 30 }, // minutes
  passingScore: { type: Number, default: 70 }, // percentage
  questions: [QuizQuestionSchema],
  attempts: { type: Number, default: 3 }, // Number of allowed attempts
  order: { type: Number, default: 0 }
}, { _id: true });

// PDF/Resource Schema
const ResourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  type: { type: String, enum: ['PDF', 'Document', 'Link', 'Slide'], default: 'PDF' },
  url: { type: String, required: true },
  size: { type: String }, // e.g., "2.5 MB"
  order: { type: Number, default: 0 }
}, { _id: true });

// Video Lecture Schema
const VideoLectureSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  duration: { type: String }, // e.g., "15:30"
  url: { type: String, required: true },
  thumbnailUrl: { type: String },
  free: { type: Boolean, default: false }, // Preview videos
  order: { type: Number, default: 0 }
}, { _id: true });

// Assignment Schema
const AssignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  instructions: { type: String },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
  points: { type: Number, default: 10 },
  deadline: { type: Date },
  submissionUrl: { type: String }, // Google Form or external submission link
  askAdminUrl: { type: String }, // Link to contact admin about this assignment
  order: { type: Number, default: 0 }
}, { _id: true });

// Module/Section Schema
const ModuleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  order: { type: Number, required: true },
  videos: [VideoLectureSchema],
  resources: [ResourceSchema], // PDFs, documents
  assignments: [AssignmentSchema],
  quizzes: [QuizSchema],
  isLocked: { type: Boolean, default: false } // Lock until previous module completed
}, { _id: true });

// Course Content Schema
const CourseContentSchema = new mongoose.Schema({
  courseId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Course',
    required: true,
    unique: true
  },
  modules: [ModuleSchema],
  totalVideos: { type: Number, default: 0 },
  totalResources: { type: Number, default: 0 },
  totalAssignments: { type: Number, default: 0 },
  totalQuizzes: { type: Number, default: 0 }
}, { timestamps: true });

// Pre-save hook to calculate totals
CourseContentSchema.pre('save', function(next) {
  let totalVideos = 0;
  let totalResources = 0;
  let totalAssignments = 0;
  let totalQuizzes = 0;

  this.modules.forEach(module => {
    totalVideos += module.videos.length;
    totalResources += module.resources.length;
    totalAssignments += module.assignments.length;
    totalQuizzes += module.quizzes.length;
  });

  this.totalVideos = totalVideos;
  this.totalResources = totalResources;
  this.totalAssignments = totalAssignments;
  this.totalQuizzes = totalQuizzes;

  next();
});

module.exports = mongoose.model('CourseContent', CourseContentSchema);
