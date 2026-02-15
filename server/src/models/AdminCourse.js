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

const adminCourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  students: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['active', 'draft', 'archived', 'Active', 'Draft', 'Inactive'],
    default: 'draft',
  },
  published: {
    type: Date,
    default: Date.now,
  },
  description: {
    type: String,
  },
  instructor: {
    type: String,
  },
  instructorEmail: {
    type: String,
    lowercase: true,
  },
  instructorBio: {
    type: String,
  },
  thumbnail: {
    type: String,
  },
  price: { type: String, default: 'Free' },
  priceAmount: { type: Number, default: 0 },
  skills: [{ type: String }],
  prerequisites: [{ type: String }],
  whatYoullLearn: [{ type: String }],
  certificate: { type: Boolean, default: false },
  language: { type: String, default: 'English' },
  totalVideos: { type: Number, default: 0 },
  totalTasks: { type: Number, default: 0 },
  projects: { type: Number, default: 0 },
  videoLectures: [VideoLectureSchema],
  assignments: [AssignmentSchema],
  resources: [ResourceSchema],
  projectsDetails: [ProjectSchema],
}, {
  timestamps: true,
});

module.exports = mongoose.model('AdminCourse', adminCourseSchema);
