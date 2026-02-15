const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['achievement', 'certificate', 'badge'],
    default: 'achievement'
  },
  date: {
    type: Date,
    default: Date.now
  },
  image: {
    type: String,
    default: ''
  },
  metadata: {
    type: Object,
    default: {}
  }
}, {
  timestamps: true
});

const Achievement = mongoose.model('Achievement', achievementSchema);

module.exports = Achievement;