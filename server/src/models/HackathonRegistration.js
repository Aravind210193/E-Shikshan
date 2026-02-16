const mongoose = require('mongoose');

const HackathonRegistrationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    hackathonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AdminHackathon',
      required: true,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
    },
    // User details at registration
    userDetails: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String },
    },
    // Team information
    teamName: { type: String, required: true },
    teamSize: { type: Number, required: true },
    teamMembers: [
      {
        name: { type: String },
        email: { type: String },
        role: { type: String },
      },
    ],
    // Project details
    projectTitle: { type: String },
    projectDescription: { type: String },
    techStack: { type: [String], default: [] },
    // Additional info
    githubUrl: { type: String },
    portfolioUrl: { type: String },
    experience: { type: String },
    motivation: { type: String },
    // Status
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'waitlisted', 'shortlisted', 'further_round'],
      default: 'pending',
    },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Ensure user can only register once per hackathon
HackathonRegistrationSchema.index({ userId: 1, hackathonId: 1 }, { unique: true });

module.exports = mongoose.model('HackathonRegistration', HackathonRegistrationSchema);
