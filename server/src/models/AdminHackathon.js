const mongoose = require('mongoose');

const SectionSchema = new mongoose.Schema({
  title: String,
  description: String,
  icon: String,
}, { _id: false });

const HackathonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    organizer: { type: String, default: '' },
    location: { type: String, default: 'Online' },
    mode: { type: String, enum: ['online', 'offline', 'hybrid'], default: 'online' },
    startDate: { type: Date },
    endDate: { type: Date },
    registrationCloses: { type: Date },
    submissionDeadline: { type: Date },
    prize: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    bgImage: { type: String, default: '' },
    applyUrl: { type: String, default: '' },
    tags: { type: [String], default: [] },
    status: { type: String, enum: ['upcoming', 'active', 'closed', 'draft'], default: 'upcoming' },
    tagline: { type: String, default: '' },
    teamSize: { type: String, default: '' },
    payment: { type: String, default: '' },
    overview: { type: String, default: '' },
    about: { type: [SectionSchema], default: [] },
    whoCanParticipate: { type: [SectionSchema], default: [] },
    challenges: { type: [SectionSchema], default: [] },
    howit: { type: [String], default: [] },
    leadName: { type: String, default: '' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AdminHackathon', HackathonSchema);
