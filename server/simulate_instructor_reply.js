
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const Notification = require('./src/models/Notification');
const HackathonRegistration = require('./src/models/HackathonRegistration');
const User = require('./src/models/User');
const connectDB = require('./src/config/db');

const simulateReply = async () => {
    try {
        await connectDB();
        console.log('🔄 Simulating instructor reply...');

        const user = await User.findOne({ email: 'bhuchiki12@gmail.com' });
        if (!user) {
            console.error('User not found.');
            process.exit(1);
        }

        const registration = await HackathonRegistration.findOne({ userId: user._id }).populate('hackathonId');
        if (!registration) {
            console.error('Registration not found.');
            process.exit(1);
        }

        // Update status and create notification
        registration.status = 'shortlisted';
        await registration.save();

        await Notification.create({
            recipient: user._id,
            recipientType: 'User',
            recipientEmail: user.email,
            title: `Congratulations! Shortlisted for ${registration.hackathonId.title}`,
            message: `You have been shortlisted for the next round of ${registration.hackathonId.title}. Please check your email for further instructions.`,
            type: 'application_update',
            relatedId: registration.hackathonId._id
        });

        console.log(`✅ Status updated and notification sent to ${user.email}`);

    } catch (err) {
        console.error('❌ Simulation failed:', err);
    } finally {
        process.exit();
    }
};

simulateReply();
