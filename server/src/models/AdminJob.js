const mongoose = require('mongoose');

const adminJobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
    required: true,
  },
  salary: {
    type: String,
    required: true,
  },
  applicants: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['Active', 'Pending', 'Closed'],
    default: 'Pending',
  },
  posted: {
    type: Date,
    default: Date.now,
  },
  description: {
    type: String,
  },
  requirements: [{
    type: String,
  }],
  responsibilities: [{
    type: String,
  }],
}, {
  timestamps: true,
});

module.exports = mongoose.model('AdminJob', adminJobSchema);
