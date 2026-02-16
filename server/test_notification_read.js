
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const Notification = require('./src/models/Notification');
const connectDB = require('./src/config/db');

async function testRead() {
    await connectDB();

    // Find an unread notification
    const note = await Notification.findOne({ isRead: false });
    if (!note) {
        console.log('No unread notifications to test.');
        process.exit();
    }

    console.log(`Testing with notification ID: ${note._id}`);
    console.log(`Current isRead: ${note.isRead}`);

    // Simulating markAsRead
    note.isRead = true;
    await note.save();

    const updated = await Notification.findById(note._id);
    console.log(`Updated isRead: ${updated.isRead}`);

    if (updated.isRead === true) {
        console.log('✅ Success: isRead persisted.');
    } else {
        console.log('❌ Failure: isRead not persisted.');
    }

    process.exit();
}

testRead();
