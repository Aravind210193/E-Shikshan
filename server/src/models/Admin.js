const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'course_manager'],
    default: 'course_manager',
  },
  permissions: [{
    type: String,
    enum: ['all', 'users', 'courses', 'jobs', 'hackathons', 'roadmaps', 'content', 'resumes', 'settings'],
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
  lastLogin: {
    type: Date,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Admin', adminSchema);
