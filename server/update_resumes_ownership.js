const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');

dotenv.config({ path: path.join(__dirname, '.env') });

const AdminResume = require('./src/models/AdminResume');
const Admin = require('./src/models/Admin');

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        // Find or create a dedicated 'Resume Instructor'
        let instructor = await Admin.findOne({ role: 'resume_instructor' });

        if (!instructor) {
            console.log('Creating resume_instructor...');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('resume123', salt);

            instructor = await Admin.create({
                name: 'Resume Instructor',
                email: 'resume@eshikshan.com',
                password: hashedPassword,
                role: 'resume_instructor'
            });
            console.log('Created resume_instructor:', instructor._id);
        } else {
            console.log('Found resume_instructor:', instructor._id);
        }

        // Update all existing resume templates to belong to this instructor
        const result = await AdminResume.updateMany({}, { createdBy: instructor._id });
        console.log(`Updated ${result.modifiedCount} resume templates to be owned by ${instructor.email}`);

        // Verify
        const resumes = await AdminResume.find({});
        console.log(`Total resumes now: ${resumes.length}`);
        resumes.forEach(r => console.log(`- ${r.name} (Owner: ${r.createdBy})`));

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
};

run();
