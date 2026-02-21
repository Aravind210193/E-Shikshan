const mongoose = require('mongoose');

const ResumeEnrollmentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    templateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AdminResumeTemplate',
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'expired'],
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

ResumeEnrollmentSchema.index({ userId: 1, templateId: 1 }, { unique: true });

module.exports = mongoose.model('ResumeEnrollment', ResumeEnrollmentSchema);
