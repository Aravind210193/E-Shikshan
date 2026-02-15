require('dotenv').config();
const mongoose = require('mongoose');
const Enrollment = require('./src/models/Enrollment');
const Course = require('./src/models/Course');
const AdminCourse = require('./src/models/AdminCourse'); // In case some courses are admin courses
const connectDB = require('./src/config/db');

const calculateRevenue = async () => {
    try {
        await connectDB();
        console.log('\n💰 Calculating Revenue based on Enrollments...\n');

        // Find all completed enrollments where amountPaid is 0 or missing
        // We assume 'completed' or 'active' status for paid courses implies revenue
        // Free courses (priceAmount: 0) are fine to be 0.

        const enrollments = await Enrollment.find({
            paymentStatus: { $in: ['completed', 'active'] }
        });

        console.log(`Found ${enrollments.length} completed/active enrollments.`);

        let updatedCount = 0;
        let totalRevenue = 0;

        for (const enrollment of enrollments) {
            // Find the course
            let course = await Course.findById(enrollment.courseId);
            if (!course) {
                course = await AdminCourse.findById(enrollment.courseId);
            }

            if (!course) {
                console.log(`⚠️ Course not found for enrollment: ${enrollment._id}`);
                continue;
            }

            const price = course.priceAmount || 0;

            // Update amountPaid if it's 0 but course has a price
            if (enrollment.amountPaid === 0 && price > 0) {
                console.log(`📝 Updating Enrollment ${enrollment._id}:`);
                console.log(`   Course: ${course.title}`);
                console.log(`   Price: ₹${price}`);
                console.log(`   Old Amount: ₹${enrollment.amountPaid} -> New Amount: ₹${price}`);

                enrollment.amountPaid = price;
                await enrollment.save();
                updatedCount++;
            }

            totalRevenue += (enrollment.amountPaid || 0);
        }

        console.log(`\n✅ Processed all enrollments.`);
        console.log(`📊 Updated ${updatedCount} records.`);
        console.log(`💰 Total Calculated Revenue: ₹${totalRevenue.toLocaleString()}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

calculateRevenue();
