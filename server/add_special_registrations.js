
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const User = require('./src/models/User');
const Admin = require('./src/models/Admin');
const AdminHackathon = require('./src/models/AdminHackathon');
const AdminJob = require('./src/models/AdminJob');
const HackathonRegistration = require('./src/models/HackathonRegistration');
const JobApplication = require('./src/models/JobApplication');
const connectDB = require('./src/config/db');

const addSpecificRegistrations = async () => {
    try {
        await connectDB();
        console.log('🔍 Looking for specific users and hackathon...');

        const targetEmails = ['bhuchiki12@gmail.com', 'bujjisekhar345@gmail.com'];
        const users = await User.find({ email: { $in: targetEmails } });

        if (users.length === 0) {
            console.error('❌ Specified users not found in database.');
            // Let's create them if they don't exist to satisfy the request
            for (const email of targetEmails) {
                const name = email.split('@')[0];
                const newUser = await User.create({
                    name: name.charAt(0).toUpperCase() + name.slice(1),
                    email: email,
                    password: 'password123', // Admin seeded password
                    role: 'student',
                    isActive: true
                });
                console.log(`✅ Created user: ${newUser.email}`);
                users.push(newUser);
            }
        } else {
            console.log(`✅ Found ${users.length} users.`);
        }

        // Find hackathon omegainstructor
        let hackathon = await AdminHackathon.findOne({ title: /omegainstructor/i });
        if (!hackathon) {
            console.warn('⚠️ Hackathon "omegainstructor" not found. Looking for any hackathon...');
            hackathon = await AdminHackathon.findOne({});
            if (!hackathon) {
                console.error('❌ No hackathons found at all.');
                process.exit(1);
            }
            console.log(`Using hackathon: ${hackathon.title}`);
        } else {
            console.log(`✅ Found hackathon: ${hackathon.title}`);
        }

        const hackathonInstructor = await Admin.findById(hackathon.createdBy) || await Admin.findOne({ role: 'hackathon_instructor' });

        // Find a job
        let job = await AdminJob.findOne({});
        const jobInstructor = job ? (await Admin.findById(job.postedBy) || await Admin.findOne({ role: 'job_instructor' })) : await Admin.findOne({ role: 'job_instructor' });

        if (!job) {
            console.warn('⚠️ No jobs found. Skipping job application seeding.');
        }

        // Create Hackathon Registrations
        console.log('📝 Creating registrations...');
        for (const user of users) {
            try {
                // Remove existing if any to ensure fresh data
                await HackathonRegistration.deleteOne({ userId: user._id, hackathonId: hackathon._id });

                await HackathonRegistration.create({
                    userId: user._id,
                    hackathonId: hackathon._id,
                    instructor: hackathonInstructor?._id,
                    userDetails: {
                        name: user.name,
                        email: user.email,
                        phone: '1234567890'
                    },
                    teamName: `${user.name}'s Squad`,
                    teamSize: 1,
                    projectTitle: `Project Omega for ${user.name}`,
                    projectDescription: 'Building something great at the Omega Hackathon.',
                    status: 'pending'
                });
                console.log(`✅ Registered ${user.email} for ${hackathon.title}`);
            } catch (err) {
                console.error(`❌ Error registering ${user.email}:`, err.message);
            }

            if (job) {
                try {
                    await JobApplication.deleteOne({ student: user._id, job: job._id });
                    await JobApplication.create({
                        job: job._id,
                        jobModel: 'AdminJob',
                        student: user._id,
                        instructor: jobInstructor?._id,
                        resumeUrl: 'https://example.com/omega_resume.pdf',
                        coverLetter: `I am highly motivated to join your company. Application by ${user.name}.`,
                        status: 'pending'
                    });
                    console.log(`✅ ${user.email} applied for job: ${job.title}`);
                } catch (err) {
                    console.error(`❌ Error applying for job for ${user.email}:`, err.message);
                }
            }
        }

        console.log('✨ All specific registrations added!');
    } catch (err) {
        console.error('❌ Script failed:', err);
    } finally {
        process.exit();
    }
};

addSpecificRegistrations();
