
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const Notification = require('./src/models/Notification');
const connectDB = require('./src/config/db');

async function cleanupDuplicates() {
    await connectDB();
    console.log('--- Cleaning Up Duplicate Notifications ---');

    // Find all notifications grouped by recipient, title and message
    const duplicates = await Notification.aggregate([
        {
            $group: {
                _id: {
                    recipient: "$recipient",
                    recipientEmail: "$recipientEmail",
                    title: "$title",
                    message: "$message"
                },
                uniqueIds: { $addToSet: "$_id" },
                count: { $sum: 1 }
            }
        },
        { $match: { count: { $gt: 1 } } }
    ]);

    console.log(`Found ${duplicates.length} sets of duplicates.`);

    let totalRemoved = 0;
    for (const group of duplicates) {
        // Keep the first one, remove the others
        const idsToRemove = group.uniqueIds.slice(1);
        await Notification.deleteMany({ _id: { $in: idsToRemove } });
        totalRemoved += idsToRemove.length;
    }

    console.log(`Removed ${totalRemoved} duplicate notifications.`);
    process.exit();
}

cleanupDuplicates();
