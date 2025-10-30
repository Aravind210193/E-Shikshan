const mongoose = require('mongoose');

const semesterDataSchema = new mongoose.Schema({
  programKey: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  shortName: String,
  totalSemesters: Number,
  color: String,
  description: String,
  semesters: {
    type: mongoose.Schema.Types.Mixed,  // Flexible structure for nested semester data
    default: {},
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
  strict: false,  // Allow flexible schema for complex nested data
});

module.exports = mongoose.model('SemesterData', semesterDataSchema);
