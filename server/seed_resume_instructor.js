const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');

dotenv.config({ path: path.join(__dirname, '.env') });

const Admin = require('./src/models/Admin');

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        const hashedPassword = await bcrypt.hash('resume123', 10);

        const instructorData = {
            name: 'Resume Instructor',
            email: 'resume@eshikshan.com',
            password: hashedPassword,
            role: 'resume_instructor',
            permissions: ['resumes'],
            isActive: true
        };

        let admin = await Admin.findOne({ email: instructorData.email });

        if (admin) {
            console.log('Updating existing resume instructor...');
            admin.role = 'resume_instructor';
            admin.permissions = ['resumes'];
            admin.password = hashedPassword;
            await admin.save();
        } else {
            console.log('Creating new resume instructor...');
            admin = await Admin.create(instructorData);
        }

        console.log('Resume Instructor setup complete.');
        console.log('Email: resume@eshikshan.com');
        console.log('Password: resume123');

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
};

run();
