require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Admin = require('./src/models/Admin');
const Course = require('./src/models/Course');
const connectDB = require('./src/config/db');
const fs = require('fs');

const instructors = [
    { name: 'Swarna Raja', email: 'o210900@rguktong.ac.in', password: 'instructor123' },
    { name: 'Aravind', email: 'o210193@rguktong.ac.in', password: 'instructor123' },
    { name: 'Sruthi', email: 'o210318@rguktong.ac.in', password: 'instructor123' },
    { name: 'Anusha', email: 'o210377@rgukong.ac.in', password: 'instructor123' },
];

(async () => {
    try {
        await connectDB();
        let report = '';

        // ─── Step 1: Remove old course_manager accounts (except super admin) ───
        const deleted = await Admin.deleteMany({ role: 'course_manager' });
        report += 'Removed ' + deleted.deletedCount + ' old course_manager accounts.\n\n';

        // ─── Step 2: Create 4 new instructor (course_manager) accounts ───
        const salt = await bcrypt.genSalt(10);
        const adminDocs = [];
        for (const inst of instructors) {
            const hashed = await bcrypt.hash(inst.password, salt);
            adminDocs.push({
                name: inst.name,
                email: inst.email,
                password: hashed,
                role: 'course_manager',
                permissions: ['courses'],
                isActive: true,
            });
        }
        await Admin.insertMany(adminDocs);
        report += '=== Created 4 Instructor Accounts ===\n';
        instructors.forEach(i => {
            report += '  ' + i.name + ' | ' + i.email + ' | password: ' + i.password + '\n';
        });
        report += '\n';

        // ─── Step 3: Fetch all courses & distribute among 4 instructors ───
        const courses = await Course.find({}).sort({ title: 1 });
        report += '=== Total courses found: ' + courses.length + ' ===\n\n';

        // Distribute: round-robin assignment
        for (let i = 0; i < courses.length; i++) {
            const inst = instructors[i % instructors.length];
            const course = courses[i];

            course.instructor = inst.name;
            course.instructorEmail = inst.email;
            await course.save();

            report += '  Course ' + (i + 1) + ': "' + course.title + '" -> ' + inst.name + ' (' + inst.email + ')\n';
        }

        report += '\n=== Assignment complete! ===\n';
        fs.writeFileSync('assignReport.txt', report, 'utf8');
        console.log(report);
        console.log('Full report saved to assignReport.txt');
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
})();
