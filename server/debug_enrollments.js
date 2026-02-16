const mongoose = require('mongoose');
const User = require('./src/models/User');
const Enrollment = require('./src/models/Enrollment');
const Course = require('./src/models/Course');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const debugEnrollments = async () => {
    try {
        const uri = process.env.MONGODB_URI; // Using loaded env
        if (!uri) {
            console.error("MONGODB_URI not found in environment");
            return;
        }
        await mongoose.connect(uri);
        console.log('Connected to DB');

        const email = 'bujjisekhar345@gmail.com';
        const user = await User.findOne({ email });

        if (!user) {
            console.log(`User ${email} not found!`);
            return;
        }

        console.log(`User found: ${user.name} (ID: ${user._id})`);

        // Check Enrollments direct query
        const enrollments = await Enrollment.find({ userId: user._id });
        console.log(`Found ${enrollments.length} enrollments in Enrollment collection for userId ${user._id}:`);

        for (const e of enrollments) {
            const course = await Course.findById(e.courseId);
            console.log(` - Enrollment ID: ${e._id}`);
            console.log(`   Course ID: ${e.courseId} (${course ? course.title : 'NOT FOUND'})`);
            console.log(`   Status: ${e.status}, Payment: ${e.paymentStatus}`);
            console.log(`   User Details in Enrollment:`, e.userDetails);
        }

        // Check User.enrolledCourses
        console.log(`\nUser.enrolledCourses array length: ${user.enrolledCourses?.length || 0}`);
        if (user.enrolledCourses) {
            user.enrolledCourses.forEach(ec => {
                console.log(` - CourseId: ${ec.courseId}, EnrollmentId: ${ec.enrollmentId}, Status: ${ec.status}`);
            });
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
};

debugEnrollments();
