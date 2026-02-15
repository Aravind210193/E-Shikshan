const mongoose = require('mongoose');

const folderSchema = new mongoose.Schema({
  branch: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  units: [{
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

// Create compound index for branch and subject
folderSchema.index({ branch: 1, subject: 1 }, { unique: true });

module.exports = mongoose.model('Folder', folderSchema);
