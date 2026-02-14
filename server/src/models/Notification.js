const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    recipientEmail: { type: String, required: true, lowercase: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: { type: String, enum: ['doubt', 'general'], default: 'general' },
    title: { type: String, required: true },
    message: { type: String, required: true },
    relatedId: { type: mongoose.Schema.Types.ObjectId }, // e.g. Doubt ID
    isRead: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Notification', NotificationSchema);
