const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  branch: {
    type: String,
    required: true,
  },
  semester: {
    type: String,
    required: true,
  },
  subjects: [{
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

// Create compound index for branch and semester
subjectSchema.index({ branch: 1, semester: 1 }, { unique: true });

module.exports = mongoose.model('Subject', subjectSchema);
