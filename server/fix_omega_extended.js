
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const AdminJob = require('./src/models/AdminJob');
const JobApplication = require('./src/models/JobApplication');
const Admin = require('./src/models/Admin');
const User = require('./src/models/User');
const Notification = require('./src/models/Notification');
const sendEmail = require('./src/utils/sendEmail');
const connectDB = require('./src/config/db');

async function fixExtended() {
    try {
        await connectDB();
        console.log('--- EXTENDING OMEGA JOB APPLICATIONS ---');

        // 1. Get Instructor
        const instructor = await Admin.findOne({ email: 'omega@eshikshan.com' });
        if (!instructor) {
            console.log('❌ Instructor omega@eshikshan.com not found.');
            process.exit();
        }
        console.log(`✅ Instructor: ${instructor.name}`);

        // 2. Setup TWO Jobs
        const job1Data = {
            title: 'Omega Backend Architect',
            company: 'Omega Systems',
            location: 'Remote',
            type: 'Full-time',
            salary: '20-30 LPA',
            description: 'Lead the backend architecture of our omega scale systems.',
            postedBy: instructor._id,
            status: 'Active'
        };

        const job2Data = {
            title: 'Omega Frontend Specialist',
            company: 'Omega Labs',
            location: 'Bangalore, KA',
            type: 'Full-time',
            salary: '15-25 LPA',
            description: 'Craft beautiful and performant frontend experiences.',
            postedBy: instructor._id,
            status: 'Active'
        };

        const job1 = await AdminJob.findOneAndUpdate({ title: job1Data.title }, job1Data, { upsert: true, new: true });
        const job2 = await AdminJob.findOneAndUpdate({ title: job2Data.title }, job2Data, { upsert: true, new: true });
        console.log(`✅ Job 1: ${job1.title}`);
        console.log(`✅ Job 2: ${job2.title}`);

        // 3. Students
        const studentEmails = ['bhuchiki12@gmail.com', 'bujjisekhar345@gmail.com'];
        const statuses = {
            'bhuchiki12@gmail.com': { job1: 'accepted', job2: 'further_round' },
            'bujjisekhar345@gmail.com': { job1: 'shortlisted', job2: 'pending' }
        };

        for (const email of studentEmails) {
            const user = await User.findOne({ email });
            if (!user) continue;

            // Application for Job 1
            await JobApplication.findOneAndUpdate(
                { student: user._id, job: job1._id },
                {
                    jobModel: 'AdminJob',
                    instructor: instructor._id,
                    status: statuses[email].job1,
                    coverLetter: 'Applying for the Backend position.'
                },
                { upsert: true, new: true }
            );

            // Application for Job 2
            await JobApplication.findOneAndUpdate(
                { student: user._id, job: job2._id },
                {
                    jobModel: 'AdminJob',
                    instructor: instructor._id,
                    status: statuses[email].job2,
                    coverLetter: 'Applying for the Frontend position.'
                },
                { upsert: true, new: true }
            );

            console.log(`✅ Applications created for ${email} on both jobs.`);

            // Platform Notification to Student
            await Notification.create({
                recipient: user._id,
                recipientType: 'User',
                title: 'Job Market Updates',
                message: `You have new updates on your applications for ${job1.title} and ${job2.title}.`,
                type: 'job_application'
            });

            // Email to Student
            try {
                await sendEmail({
                    to: user.email,
                    subject: 'Application Status Update - Omega Jobs',
                    html: `
                        <h2>Application Update</h2>
                        <p>Hi ${user.name},</p>
                        <p>Your applications for the following positions at <b>Dev Jam Omega</b> have been updated:</p>
                        <ul>
                            <li><b>${job1.title}:</b> ${statuses[email].job1}</li>
                            <li><b>${job2.title}:</b> ${statuses[email].job2}</li>
                        </ul>
                        <p>Check your student dashboard for next steps.</p>
                    `
                });
            } catch (e) {
                console.error(`Email to ${email} failed:`, e.message);
            }
        }

        // 4. Notification/Email to Instructor
        try {
            await sendEmail({
                to: instructor.email,
                subject: 'New Candidate Activity: Omega Jobs',
                html: `
                    <h2>Instructor Alert</h2>
                    <p>Hello ${instructor.name},</p>
                    <p>Two candidates (${studentEmails.join(', ')}) have active applications for your jobs:</p>
                    <ol>
                        <li>${job1.title}</li>
                        <li>${job2.title}</li>
                    </ol>
                    <p>You can manage their progress and move them to further rounds via your admin portal.</p>
                `
            });
        } catch (e) {
            console.error('Email to instructor failed:', e.message);
        }

        console.log('--- EXTENDED FIX COMPLETE ---');
    } catch (err) {
        console.error(err);
    } finally {
        process.exit();
    }
}

fixExtended();
