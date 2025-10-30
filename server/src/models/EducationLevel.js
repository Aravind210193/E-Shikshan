const mongoose = require('mongoose');

const educationLevelSchema = new mongoose.Schema({
  level: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    default: '',
  },
  branches: [{
    title: String,
    link: String,
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('EducationLevel', educationLevelSchema);
