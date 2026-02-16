const mongoose = require('mongoose');

// Schema for individual path/topic items
const PathItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    topics: { type: [String], default: [] },
    resources: { type: [String], default: [] },
    project: { type: String, default: '' },
    projectId: { type: String } // Unique ID for project submission linking
  }
);

const RoadmapSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true },
    tagline: { type: String, default: '' },
    image: { type: String, default: '' },
    duration: { type: String, default: '' },
    difficulty: { type: String, default: '' },
    popularity: { type: String, default: '' },
    description: { type: String, default: '' },
    path: { type: [PathItemSchema], default: [] },
    rating: { type: Number, default: 4.5 },
    enrolled: { type: Number, default: 0 },
    isNew: { type: Boolean, default: false },
    isUpdated: { type: Boolean, default: false },
    trending: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'draft', 'archived'], default: 'active' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Roadmap', RoadmapSchema);
