const mongoose = require('mongoose');

const adminCourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['UG', 'PG', 'Intermediate', 'Professional'],
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
    enum: ['Active', 'Draft', 'Inactive'],
    default: 'Draft',
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
  thumbnail: {
    type: String,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('AdminCourse', adminCourseSchema);
