const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'jobModel'
    },
    jobModel: {
        type: String,
        required: true,
        enum: ['Job', 'AdminJob'],
        default: 'Job'
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true
    },
    resumeUrl: String,
    coverLetter: String,
    status: {
        type: String,
        enum: ['pending', 'reviewed', 'shortlisted', 'interview', 'rejected', 'accepted', 'further_round'],
        default: 'pending'
    },
    appliedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('JobApplication', jobApplicationSchema);
