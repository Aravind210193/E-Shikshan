const mongoose = require('mongoose');

const DoubtSchema = new mongoose.Schema({
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    instructorEmail: { type: String, required: true }, // For efficient filtering for instructors
    itemType: { type: String, enum: ['assignment', 'project', 'general'], default: 'general' },
    itemId: { type: String }, // ID of the assignment or project
    itemTitle: { type: String }, // Title of the assignment or project for display
    question: { type: String, required: true },
    status: { type: String, enum: ['pending', 'resolved'], default: 'pending' },
    reply: { type: String }, // Optional reply associated with the doubt
}, { timestamps: true });

module.exports = mongoose.model('Doubt', DoubtSchema);
