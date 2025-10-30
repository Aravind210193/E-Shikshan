const mongoose = require('mongoose');

const StepSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    resources: { type: [String], default: [] },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const RoadmapSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, default: '' },
    level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
    thumbnail: { type: String, default: '' },
    status: { type: String, enum: ['active', 'draft', 'archived'], default: 'active' },
    steps: { type: [StepSchema], default: [] },
    tags: { type: [String], default: [] },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AdminRoadmap', RoadmapSchema);
