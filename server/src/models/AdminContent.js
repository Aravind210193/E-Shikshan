const mongoose = require('mongoose');

const ContentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    type: { type: String, enum: ['pdf', 'video', 'article', 'link', 'subject'], required: true },
    branch: { type: String, default: '' },
    subject: { type: String, default: '' },
    semester: { type: String, default: '' },
    category: { type: String, default: '' },
    url: { type: String, default: '' },
    description: { type: String, default: '' },
    tags: { type: [String], default: [] },
    status: { type: String, enum: ['published', 'draft', 'archived'], default: 'draft' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AdminContent', ContentSchema);
