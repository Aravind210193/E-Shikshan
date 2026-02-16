
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

const seed = async () => {
    try {
        await connectDB();
        console.log('🌱 Seeding applications and registrations...');

        // 1. Get Students
        const students = await User.find({ role: 'student' }).limit(10);
        if (!students.length) {
            console.error('No student users found. Creating mock student...');
            // Optional: create a student if none exist
        }

        const allUsers = await User.find({}).limit(10);
        if (!allUsers.length) {
            console.error('No users found in database.');
            process.exit(1);
        }

        // 2. Get Instructors
        const hackathonInstructor = await Admin.findOne({ role: 'hackathon_instructor' });
        const jobInstructor = await Admin.findOne({ role: 'job_instructor' });

        if (!hackathonInstructor || !jobInstructor) {
            console.error('Instructors not found. Please ensure instructors with roles hackathon_instructor and job_instructor exist.');
            process.exit(1);
        }

        // 3. Get Hackathons and Jobs
        const hackathons = await AdminHackathon.find({ createdBy: hackathonInstructor._id });
        const jobs = await AdminJob.find({ postedBy: jobInstructor._id });

        if (!hackathons.length) console.warn('⚠️ No hackathons found for hackathon_instructor');
        if (!jobs.length) console.warn('⚠️ No jobs found for job_instructor');

        // 4. Create Hackathon Registrations
        if (hackathons.length) {
            console.log('Creating hackathon registrations...');
            for (let i = 0; i < Math.min(allUsers.length, 5); i++) {
                const student = allUsers[i];
                const hackathon = hackathons[i % hackathons.length];

                try {
                    await HackathonRegistration.create({
                        userId: student._id,
                        hackathonId: hackathon._id,
                        instructor: hackathonInstructor._id,
                        userDetails: {
                            name: student.name,
                            email: student.email,
                            phone: '9876543210'
                        },
                        teamName: `${student.name.split(' ')[0]}'s Coders`,
                        teamSize: Math.floor(Math.random() * 3) + 1,
                        projectTitle: `Innovative Project ${i + 1}`,
                        projectDescription: 'This is a sample project description for the hackathon registration.',
                        status: 'pending'
                    });
                    console.log(`✅ Registered ${student.name} for ${hackathon.title}`);
                } catch (err) {
                    console.log(`⚠️ Skip: ${student.name} may already be registered.`);
                }
            }
        }

        // 5. Create Job Applications
        if (jobs.length) {
            console.log('Creating job applications...');
            for (let i = 0; i < Math.min(allUsers.length, 5); i++) {
                const student = allUsers[i];
                const job = jobs[i % jobs.length];

                try {
                    await JobApplication.create({
                        job: job._id,
                        jobModel: 'AdminJob',
                        student: student._id,
                        instructor: jobInstructor._id,
                        resumeUrl: 'https://example.com/resume.pdf',
                        coverLetter: `Hi, I am really interested in the ${job.title} position. I have the required skills and experience.`,
                        status: 'pending'
                    });
                    console.log(`✅ ${student.name} applied for ${job.title}`);
                } catch (err) {
                    console.log(`⚠️ Skip: ${student.name} may already have applied.`);
                }
            }
        }

        console.log('✨ Seeding complete!');
    } catch (err) {
        console.error('❌ Seeding failed:', err);
    } finally {
        process.exit();
    }
};

seed();
