require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const Admin = require('./src/models/Admin');
const Course = require('./src/models/Course');
const Enrollment = require('./src/models/Enrollment');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log(`📊 Database: ${conn.connection.name}\n`);
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
};

const checkDatabaseStats = async () => {
    await connectDB();

    try {
        console.log('='.repeat(60));
        console.log('DATABASE STATISTICS CHECK');
        console.log('='.repeat(60));

        // Check Users
        const totalUsers = await User.countDocuments();
        const totalStudents = await User.countDocuments({ role: 'student' });
        console.log('\n👥 USERS:');
        console.log(`   Total Users: ${totalUsers}`);
        console.log(`   Total Students: ${totalStudents}`);

        if (totalUsers > 0) {
            const sampleUsers = await User.find().select('name email role').limit(3);
            console.log('   Sample Users:');
            sampleUsers.forEach(u => {
                console.log(`     - ${u.name} (${u.email}) - ${u.role}`);
            });
        } else {
            console.log('   ⚠️  NO USERS FOUND IN DATABASE!');
        }

        // Check Admins/Instructors
        console.log('\n👨‍🏫 ADMINS & INSTRUCTORS:');
        const totalAdmins = await Admin.countDocuments();
        const totalInstructors = await Admin.countDocuments({
            role: { $in: ['course_manager', 'instructor', 'faculty'] }
        });
        console.log(`   Total Admins: ${totalAdmins}`);
        console.log(`   Total Instructors: ${totalInstructors}`);

        if (totalAdmins > 0) {
            const sampleAdmins = await Admin.find().select('name email role').limit(5);
            console.log('   Sample Admins/Instructors:');
            sampleAdmins.forEach(a => {
                console.log(`     - ${a.name} (${a.email}) - ${a.role}`);
            });
        } else {
            console.log('   ⚠️  NO ADMINS/INSTRUCTORS FOUND IN DATABASE!');
        }

        // Check Courses
        console.log('\n📚 COURSES:');
        const totalCourses = await Course.countDocuments();
        const activeCourses = await Course.countDocuments({ status: 'active' });
        console.log(`   Total Courses: ${totalCourses}`);
        console.log(`   Active Courses: ${activeCourses}`);

        if (totalCourses > 0) {
            const sampleCourses = await Course.find()
                .select('title instructorEmail students status')
                .limit(3);
            console.log('   Sample Courses:');
            sampleCourses.forEach(c => {
                console.log(`     - ${c.title} (Instructor: ${c.instructorEmail || 'None'}, Students: ${c.students || 0})`);
            });
        } else {
            console.log('   ⚠️  NO COURSES FOUND IN DATABASE!');
        }

        // Check Enrollments
        console.log('\n📝 ENROLLMENTS:');
        const totalEnrollments = await Enrollment.countDocuments();
        const activeEnrollments = await Enrollment.countDocuments({ status: 'active' });
        const completedPayments = await Enrollment.countDocuments({
            paymentStatus: { $in: ['completed', 'active'] }
        });
        console.log(`   Total Enrollments: ${totalEnrollments}`);
        console.log(`   Active Enrollments: ${activeEnrollments}`);
        console.log(`   Completed Payments: ${completedPayments}`);

        // Calculate Revenue
        const revenueData = await Enrollment.aggregate([
            { $match: { paymentStatus: { $in: ['completed', 'active'] } } },
            { $group: { _id: null, totalRevenue: { $sum: '$amountPaid' } } }
        ]);
        const totalRevenue = revenueData[0]?.totalRevenue || 0;
        console.log(`   💰 Total Revenue: ₹${totalRevenue}`);

        if (totalEnrollments > 0) {
            const sampleEnrollments = await Enrollment.find()
                .populate('userId', 'name email')
                .populate('courseId', 'title')
                .select('userId courseId paymentStatus amountPaid status')
                .limit(3);
            console.log('   Sample Enrollments:');
            sampleEnrollments.forEach(e => {
                console.log(`     - ${e.userId?.name || 'Unknown'} enrolled in ${e.courseId?.title || 'Unknown Course'} (Payment: ${e.paymentStatus}, Amount: ₹${e.amountPaid || 0})`);
            });
        } else {
            console.log('   ⚠️  NO ENROLLMENTS FOUND IN DATABASE!');
        }

        console.log('\n' + '='.repeat(60));
        console.log('SUMMARY:');
        console.log('='.repeat(60));

        const issues = [];
        if (totalUsers === 0) issues.push('❌ No users in database');
        if (totalAdmins === 0) issues.push('❌ No admins/instructors in database');
        if (totalCourses === 0) issues.push('❌ No courses in database');
        if (totalEnrollments === 0) issues.push('❌ No enrollments in database');

        if (issues.length > 0) {
            console.log('\n⚠️  ISSUES FOUND:');
            issues.forEach(issue => console.log(`   ${issue}`));
            console.log('\n💡 RECOMMENDATION: Run seed script to populate database with sample data.');
        } else {
            console.log('\n✅ Database has all required data!');
        }

        console.log('='.repeat(60) + '\n');

    } catch (error) {
        console.error('❌ Error checking database:', error);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 Database connection closed.');
    }
};

checkDatabaseStats();
