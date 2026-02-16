const mongoose = require('mongoose');

const WorkSubmissionSchema = new mongoose.Schema({
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' }, // Optional now
    roadmap: { type: mongoose.Schema.Types.ObjectId, ref: 'Roadmap' }, // New field for roadmap submissions
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    instructorEmail: { type: String }, // Optional, maybe needed for course but not roadmap if single instructor
    workId: { type: String, required: true }, // ID of assignment or project or roadmap step
    workType: { type: String, enum: ['assignment', 'project', 'roadmap_project'], required: true },
    title: { type: String, required: true }, // Title of assignment or project
    submissionUrl: { type: String, required: true },
    comments: { type: String },
    status: {
        type: String,
        enum: ['pending', 'reviewed', 'graded'],
        default: 'pending'
    },
    grade: { type: String },
    feedback: { type: String },
    instructorReply: { type: String },
    instructorRepliedAt: { type: Date },
    reviewedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('ProjectSubmission', WorkSubmissionSchema);
