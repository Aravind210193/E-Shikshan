const mongoose = require('mongoose');

const VideoLectureSchema = new mongoose.Schema({
  title: { type: String, required: true },
  duration: { type: String },
  url: { type: String },
  free: { type: Boolean, default: false },
  order: { type: Number, default: 0 }
}, { _id: true });

const AssignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'] },
  points: { type: Number, default: 0 },
  instructions: { type: String },
  deadline: { type: String }
}, { _id: true });

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  duration: { type: String },
  instructions: { type: String },
  deadline: { type: String },
  submitUrl: { type: String },
  askAdminUrl: { type: String }
}, { _id: true });

const ResourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  type: { type: String, enum: ['pdf', 'doc', 'link', 'other'], default: 'pdf' }
}, { _id: true });

const SyllabusSchema = new mongoose.Schema({
  week: { type: Number },
  title: { type: String },
  topics: [{ type: String }]
}, { _id: false });

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  provider: { type: String, default: 'E-Shikshan' },
  category: { type: String, required: true },
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  duration: { type: String, required: true },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  students: { type: Number, default: 0 },
  price: { type: String, default: 'Free' }, // 'Free' or '₹3,999' format
  priceAmount: { type: Number, default: 0 }, // Numeric price for calculations
  thumbnail: { type: String, default: '' },
  description: { type: String, required: true },
  skills: [{ type: String }],
  instructor: { type: String, required: true },
  instructorEmail: { type: String, lowercase: true },
  instructorBio: { type: String },
  syllabus: [SyllabusSchema],
  prerequisites: [{ type: String }],
  whatYoullLearn: [{ type: String }],
  certificate: { type: Boolean, default: false },
  language: { type: String, default: 'English' },
  subtitles: [{ type: String }],
  totalVideos: { type: Number, default: 0 },
  totalQuizzes: { type: Number, default: 0 },
  projects: { type: Number, default: 0 },
  videoLectures: [VideoLectureSchema],
  assignments: [AssignmentSchema],
  resources: [ResourceSchema],
  projectsDetails: [ProjectSchema],
  status: { type: String, enum: ['active', 'draft', 'archived'], default: 'active' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }
}, { timestamps: true });

module.exports = mongoose.model('Course', CourseSchema);
