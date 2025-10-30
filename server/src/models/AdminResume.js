const mongoose = require('mongoose');

const SectionSchema = new mongoose.Schema(
  {
    key: { type: String, required: true },
    label: { type: String, required: true },
    fields: { type: [String], default: [] },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const ResumeTemplateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    previewImage: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    sections: { type: [SectionSchema], default: [] },
    tags: { type: [String], default: [] },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AdminResumeTemplate', ResumeTemplateSchema);
