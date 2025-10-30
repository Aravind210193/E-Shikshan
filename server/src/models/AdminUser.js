const mongoose = require('mongoose');

const adminUserSchema = new mongoose.Schema({
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
  role: {
    type: String,
    enum: ['Student', 'Premium', 'Instructor'],
    default: 'Student',
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Pending'],
    default: 'Pending',
  },
  courses: {
    type: Number,
    default: 0,
  },
  resumes: {
    type: Number,
    default: 0,
  },
  registered: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('AdminUser', adminUserSchema);
