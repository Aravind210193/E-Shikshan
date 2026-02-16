
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const AdminHackathon = require('./src/models/AdminHackathon');
const HackathonRegistration = require('./src/models/HackathonRegistration');
const AdminJob = require('./src/models/AdminJob');
const JobApplication = require('./src/models/JobApplication');
const Admin = require('./src/models/Admin');
const User = require('./src/models/User');
const Notification = require('./src/models/Notification');
const sendEmail = require('./src/utils/sendEmail');
const connectDB = require('./src/config/db');

async function fixAll() {
    try {
        await connectDB();
        console.log('--- FIXING OMEGA INSTRUCTOR (HACKATHONS & JOBS) ---');

        // 1. Get/Update Instructor
        let instructor = await Admin.findOne({ email: 'omega@eshikshan.com' });
        if (!instructor) {
            console.log('Creating instructor Dev Jam Omega...');
            instructor = await Admin.create({
                name: 'Dev Jam Omega',
                email: 'omega@eshikshan.com',
                password: 'password123', // Student would know this or it was seeded
                role: 'admin', // Give them admin role or ensure they have permissions
                permissions: ['all'],
                isActive: true
            });
        } else {
            instructor.permissions = ['hackathons', 'jobs', 'all'];
            instructor.role = 'admin'; // Elevate to admin to ensure visibility
            instructor.isActive = true;
            await instructor.save();
        }
        console.log(`✅ Instructor ID: ${instructor._id} (${instructor.email})`);

        // 2. Setup Hackathon
        let hackathon = await AdminHackathon.findOne({ title: /omega/i });
        if (!hackathon) {
            console.log('Creating Dev Jam Omega Initiative Hackathon...');
            hackathon = await AdminHackathon.create({
                title: 'Dev Jam Omega Initiative',
                description: 'The ultimate omega challenge for full-stack developers.',
                organizer: 'E-Shikshan',
                createdBy: instructor._id,
                status: 'active',
                startDate: new Date(),
                endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            });
        } else {
            hackathon.createdBy = instructor._id;
            await hackathon.save();
        }
        console.log(`✅ Hackathon: "${hackathon.title}" (ID: ${hackathon._id})`);

        // 3. Setup Job
        let job = await AdminJob.findOne({ title: /omega/i });
        if (!job) {
            console.log('Creating Omega Full Stack Engineer Job...');
            job = await AdminJob.create({
                title: 'Omega Full Stack Engineer',
                company: 'Omega Tech Solutions',
                location: 'Remote',
                type: 'Full-time',
                salary: '12-18 LPA',
                description: 'Looking for a skilled full-stack developer to join our omega team.',
                postedBy: instructor._id,
                status: 'Active'
            });
        } else {
            job.postedBy = instructor._id;
            await job.save();
        }
        console.log(`✅ Job: "${job.title}" (ID: ${job._id})`);

        // 4. Register Students
        const studentEmails = ['bhuchiki12@gmail.com', 'bujjisekhar345@gmail.com'];

        for (const email of studentEmails) {
            const user = await User.findOne({ email });
            if (!user) {
                console.log(`⚠️ Student ${email} not found.`);
                continue;
            }

            // A. Hackathon Registration
            await HackathonRegistration.findOneAndUpdate(
                { userId: user._id, hackathonId: hackathon._id },
                {
                    instructor: instructor._id,
                    status: 'pending',
                    userDetails: { name: user.name, email: user.email, phone: '1234567890' },
                    teamName: 'Omega Team',
                    teamSize: 1
                },
                { upsert: true, new: true }
            );
            console.log(`✅ Registered ${email} for Hackathon.`);

            // B. Job Application
            await JobApplication.findOneAndUpdate(
                { student: user._id, job: job._id },
                {
                    jobModel: 'AdminJob',
                    instructor: instructor._id,
                    status: 'pending',
                    coverLetter: 'I am excited to apply for the Omega position!'
                },
                { upsert: true, new: true }
            );
            console.log(`✅ Applied ${email} for Job.`);

            // C. Platform Notifications
            await Notification.create({
                recipient: user._id,
                recipientType: 'User',
                title: 'Application Successful',
                message: `You have successfully applied for the ${job.title} and registered for ${hackathon.title}.`,
                type: 'general'
            });

            // D. Email to Student
            try {
                await sendEmail({
                    to: user.email,
                    subject: 'Application Confirmation: Omega Initiative',
                    html: `
                        <h1>Confirmation</h1>
                        <p>Hi ${user.name},</p>
                        <p>You have successfully applied for:</p>
                        <ul>
                            <li><b>Hackathon:</b> ${hackathon.title}</li>
                            <li><b>Job:</b> ${job.title}</li>
                        </ul>
                        <p>Best of luck!</p>
                    `
                });
            } catch (e) {
                console.error(`Email to ${email} failed:`, e.message);
            }
        }

        // 5. Notification to Instructor
        await Notification.create({
            recipient: instructor._id,
            recipientType: 'Admin',
            title: 'New Omega Applications',
            message: `Two new students have registered for your Omega programs.`,
            type: 'general'
        });

        // Email to Instructor
        try {
            await sendEmail({
                to: instructor.email,
                subject: 'New Applications Received',
                html: `
                    <h1>New Applications</h1>
                    <p>Hello ${instructor.name},</p>
                    <p>New students have applied for your programs:</p>
                    <ul>
                        <li><b>Hackathon:</b> ${hackathon.title}</li>
                        <li><b>Job:</b> ${job.title}</li>
                    </ul>
                    <p>Check your dashboard for details.</p>
                `
            });
        } catch (e) {
            console.error('Email to instructor failed:', e.message);
        }

        console.log('--- ALL FIXES COMPLETE ---');
    } catch (err) {
        console.error('Fatal error:', err);
    } finally {
        process.exit();
    }
}

fixAll();
