require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const Admin = require('./src/models/Admin');
const Course = require('./src/models/Course');
const connectDB = require('./src/config/db');

(async () => {
    await connectDB();
    let output = '';

    output += '\n=== Admin users ===\n';
    const admins = await Admin.find({}, 'name email role');
    admins.forEach(a => { output += '  ' + a.role + ': ' + a.email + ' (' + a.name + ')\n'; });

    output += '\n=== Courses with instructorEmail ===\n';
    const courses = await Course.find({ instructorEmail: { $exists: true, $ne: '' } }, 'title instructorEmail');
    if (courses.length === 0) {
        output += '  No courses have an instructorEmail set\n';
    } else {
        courses.forEach(c => { output += '  ' + c.title + ' -> ' + c.instructorEmail + '\n'; });
    }

    const unique = await Course.distinct('instructorEmail', { instructorEmail: { $exists: true, $ne: '' } });
    output += '\n=== Unique instructor emails in courses: ' + unique.length + ' ===\n';
    unique.forEach(e => { output += '  ' + e + '\n'; });

    const totalCourses = await Course.countDocuments();
    output += '\n=== Total courses: ' + totalCourses + ' ===\n';

    fs.writeFileSync('dbReport.txt', output, 'utf8');
    console.log('Report written to dbReport.txt');
    process.exit(0);
})();
