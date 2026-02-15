require('dotenv').config();
const connectDB = require('./src/config/db');
const Enrollment = require('./src/models/Enrollment');

const checkDuplicates = async () => {
    console.log('🔍 Checking for duplicate enrollments...');
    await connectDB();

    try {
        const duplicates = await Enrollment.aggregate([
            {
                $group: {
                    _id: { userId: "$userId", courseId: "$courseId" },
                    count: { $sum: 1 },
                    docs: { $push: "$_id" }
                }
            },
            {
                $match: {
                    count: { $gt: 1 }
                }
            }
        ]);

        if (duplicates.length > 0) {
            console.log(`⚠️ Found ${duplicates.length} duplicate enrollment pairs!`);
            console.log(JSON.stringify(duplicates, null, 2));

            // Optional: Auto-fix logic could go here
        } else {
            console.log('✅ No duplicate enrollments found.');
        }

        // Also check if adminController logic matches sync logic
        const allEnrollments = await Enrollment.countDocuments({});
        const uniqueUsers = await Enrollment.distinct('userId');

        console.log(`\n📊 Global Stats:`);
        console.log(`Total Enrollment Records: ${allEnrollments}`);
        console.log(`Unique Students (Global): ${uniqueUsers.length}`);

    } catch (e) {
        console.error('Error:', e);
    }

    process.exit();
};

checkDuplicates();
