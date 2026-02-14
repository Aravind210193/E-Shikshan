require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./src/models/Admin');
const Course = require('./src/models/Course');
const connectDB = require('./src/config/db');
const fs = require('fs');

(async () => {
    await connectDB();
    const lines = [];

    const admins = await Admin.find({}, 'name email role').lean();
    lines.push('ADMIN ACCOUNTS (' + admins.length + '):');
    admins.forEach(a => lines.push('  ' + a.role + ' | ' + a.email + ' | ' + a.name));
    lines.push('');

    const courses = await Course.find({}, 'title instructor instructorEmail').lean();
    lines.push('COURSE ASSIGNMENTS (' + courses.length + ' courses):');
    courses.forEach((c, i) => lines.push('  ' + (i + 1) + '. ' + c.title));
    lines.push('');
    courses.forEach((c, i) => lines.push('  ' + (i + 1) + '. INSTR=' + (c.instructor || 'NONE') + ' EMAIL=' + (c.instructorEmail || 'NONE')));

    fs.writeFileSync('verifyResult.txt', lines.join('\n'), 'utf8');
    // Also print each line separately for console
    for (const l of lines) {
        console.log(l);
    }
    process.exit(0);
})();
