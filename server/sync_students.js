require('dotenv').config();
const connectDB = require('./src/config/db');
const mongoose = require('mongoose');
const Course = require('./src/models/Course');
const AdminCourse = require('./src/models/AdminCourse');
const Enrollment = require('./src/models/Enrollment');

const syncStudentCounts = async () => {
    console.log('🔄 Starting Student Count Synchronization...');
    await connectDB();

    try {
        // 1. Sync Normal Courses
        console.log('\n--- Syncing Normal Courses ---');
        const courses = await Course.find({});
        for (const course of courses) {
            const count = await Enrollment.countDocuments({
                courseId: course._id,
                // Consider counting only active/completed enrollments if needed, 
                // but usually total enrollments is what's displayed.
                // status: { $in: ['active', 'completed'] } 
            });

            if (course.students !== count) {
                console.log(`📝 Updating ${course.title}: ${course.students} -> ${count}`);
                course.students = count;
                await course.save();
            } else {
                console.log(`✅ ${course.title}: ${count} (Correct)`);
            }
        }

        // 2. Sync Admin Courses
        console.log('\n--- Syncing Admin Courses ---');
        const adminCourses = await AdminCourse.find({});
        for (const course of adminCourses) {
            const count = await Enrollment.countDocuments({ courseId: course._id });

            if (course.students !== count) {
                console.log(`📝 Updating ${course.title}: ${course.students} -> ${count}`);
                course.students = count;
                await course.save();
            } else {
                console.log(`✅ ${course.title}: ${count} (Correct)`);
            }
        }

        console.log('\n✨ Synchronization Complete!');

    } catch (e) {
        console.error('Error during sync:', e);
    }

    process.exit();
};

syncStudentCounts();
