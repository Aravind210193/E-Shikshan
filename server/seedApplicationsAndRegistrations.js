const mongoose = require('mongoose');
const User = require('./src/models/User');
const AdminJob = require('./src/models/AdminJob');
const AdminHackathon = require('./src/models/AdminHackathon');
const JobApplication = require('./src/models/JobApplication');
const HackathonRegistration = require('./src/models/HackathonRegistration');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/e-shikshan';

const seedInteractions = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const students = await User.find().limit(10);
        const jobs = await AdminJob.find().limit(5);
        const hackathons = await AdminHackathon.find().limit(5);

        if (students.length === 0 || jobs.length === 0 || hackathons.length === 0) {
            console.log('Missing data to seed interactions. Ensure students, jobs, and hackathons exist.');
            process.exit(1);
        }

        // Seed Job Applications
        await JobApplication.deleteMany({});
        console.log('Cleared existing job applications');

        for (let i = 0; i < jobs.length; i++) {
            const job = jobs[i];
            // Each job gets 2-3 applicants
            for (let j = 0; j < 3; j++) {
                const student = students[(i * 3 + j) % students.length];
                const statuses = ['pending', 'reviewed', 'shortlisted', 'interview', 'rejected', 'accepted'];
                const status = statuses[Math.floor(Math.random() * statuses.length)];

                await JobApplication.create({
                    job: job._id,
                    jobModel: 'AdminJob',
                    student: student._id,
                    instructor: job.postedBy,
                    resumeUrl: 'https://example.com/resume.pdf',
                    coverLetter: `I am highly interested in the ${job.title} position at ${job.company}. I have relevant experience and skills.`,
                    status: status
                });
                console.log(`Created Job Application: ${student.name} -> ${job.title} (${status})`);
            }
        }

        // Seed Hackathon Registrations
        await HackathonRegistration.deleteMany({});
        console.log('Cleared existing hackathon registrations');

        for (let i = 0; i < hackathons.length; i++) {
            const hack = hackathons[i];
            // Each hackathon gets 2-3 teams/soloists
            for (let j = 0; j < 3; j++) {
                const student = students[(i * 3 + j) % students.length];
                const statuses = ['pending', 'approved', 'rejected', 'waitlisted', 'shortlisted', 'further_round'];
                const status = statuses[Math.floor(Math.random() * statuses.length)];
                const teamSize = Math.floor(Math.random() * 4) + 1;

                await HackathonRegistration.create({
                    userId: student._id,
                    hackathonId: hack._id,
                    instructor: hack.createdBy,
                    userDetails: {
                        name: student.name,
                        email: student.email,
                        phone: '1234567890'
                    },
                    teamName: teamSize > 1 ? `Team ${student.name.split(' ')[0]} Heroes` : student.name,
                    teamSize: teamSize,
                    teamMembers: teamSize > 1 ? [
                        { name: student.name, email: student.email, role: 'Lead' },
                        { name: 'Partner One', email: 'partner1@example.com', role: 'Dev' }
                    ] : [{ name: student.name, email: student.email, role: 'Solo' }],
                    projectTitle: `Project for ${hack.title}`,
                    projectDescription: `An innovative solution addressing the core challenges of ${hack.title} using cutting edge tech.`,
                    techStack: ['React', 'Node.js', 'MongoDB'],
                    status: status,
                    githubUrl: 'https://github.com/example/project',
                    portfolioUrl: 'https://example.com',
                    motivation: 'I want to build something that makes an impact.'
                });
                console.log(`Created Hackathon Registration: ${student.name} -> ${hack.title} (${status})`);
            }
        }

        console.log('Seeding of interactions completed successfully');
        process.exit();
    } catch (err) {
        console.error('Seeding failed:', err);
        process.exit(1);
    }
};

seedInteractions();
