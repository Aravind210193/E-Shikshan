const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        required: false // Optional if using recipientEmail
    },
    recipientType: {
        type: String,
        enum: ['User', 'Admin'],
        default: 'User'
    },
    recipientEmail: { type: String, required: false, lowercase: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: {
        type: String,
        enum: ['doubt', 'general', 'job_application', 'hackathon_registration', 'application_update'],
        default: 'general'
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    data: { type: Object }, // Flexible payload
    relatedId: { type: mongoose.Schema.Types.ObjectId },
    isRead: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Notification', NotificationSchema);
