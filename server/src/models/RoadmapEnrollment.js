const mongoose = require('mongoose');

const RoadmapEnrollmentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    roadmapId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Roadmap',
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'dropped'],
        default: 'active'
    },
    enrolledAt: {
        type: Date,
        default: Date.now
    },
    grantedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
    }
}, { timestamps: true });

RoadmapEnrollmentSchema.index({ userId: 1, roadmapId: 1 }, { unique: true });

module.exports = mongoose.model('RoadmapEnrollment', RoadmapEnrollmentSchema);
