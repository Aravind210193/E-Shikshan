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
  // New fields to match public Job model
  logo: String,
  category: String,
  duration: String,
  startDate: String,
  timePerWeek: String,
  mode: String,
  credential: String,
  about: String,
  experienceLevel: String,
  openings: Number,
  companyWebsite: String,
  applyUrl: String,
  salaryMin: Number,
  salaryMax: Number,
  currency: { type: String, default: 'INR' },
  benefits: [{ type: String }],
  howto: [{ type: String }],
  skills: [{ type: String }],
}, {
  timestamps: true,
});

module.exports = mongoose.model('AdminJob', adminJobSchema);
