require('dotenv').config();
const mongoose = require('mongoose');
const Enrollment = require('./src/models/Enrollment');
const Course = require('./src/models/Course');
const connectDB = require('./src/config/db');

(async () => {
    try {
        await connectDB();

        console.log('\n=== Checking Enrollments ===\n');

        // Get all enrollments
        const enrollments = await Enrollment.find({})
            .populate('courseId', 'title')
            .populate('userId', 'name email');

        console.log(`Total Enrollments: ${enrollments.length}\n`);

        if (enrollments.length > 0) {
            console.log('Enrollment Details:');
            enrollments.forEach((enr, idx) => {
                console.log(`\n${idx + 1}. Student: ${enr.userId?.name || 'Unknown'}`);
                console.log(`   Course: ${enr.courseId?.title || 'Unknown'}`);
                console.log(`   Status: ${enr.status}`);
                console.log(`   Payment Status: ${enr.paymentStatus}`);
                console.log(`   Enrolled At: ${enr.enrolledAt}`);
            });
        } else {
            console.log('⚠️  No enrollments found in database!');
            console.log('\nTo test the student count feature, you need to:');
            console.log('1. Register a user account');
            console.log('2. Login and enroll in a course');
            console.log('3. Complete payment (or enroll in a free course)');
        }

        // Check enrollment counts by course
        console.log('\n\n=== Enrollment Counts by Course ===\n');
        const counts = await Enrollment.aggregate([
            {
                $match: {
                    status: { $in: ['active', 'completed'] }
                }
            },
            {
                $group: {
                    _id: '$courseId',
                    count: { $sum: 1 }
                }
            }
        ]);

        if (counts.length > 0) {
            for (const item of counts) {
                const course = await Course.findById(item._id);
                console.log(`${course?.title || 'Unknown Course'}: ${item.count} students`);
            }
        } else {
            console.log('No active/completed enrollments found.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
})();
