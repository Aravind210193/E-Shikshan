const mongoose = require('mongoose');
const Admin = require('./src/models/Admin');
const AdminJob = require('./src/models/AdminJob');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
};

const instructorsData = [
    { name: 'Job Guru Alpha', email: 'alpha@eshikshan.com', password: 'Password123!', role: 'job_instructor', permissions: ['jobs'] },
    { name: 'Career Coach Beta', email: 'beta@eshikshan.com', password: 'Password123!', role: 'job_instructor', permissions: ['jobs'] },
    { name: 'HR Pro Gamma', email: 'gamma@eshikshan.com', password: 'Password123!', role: 'job_instructor', permissions: ['jobs'] },
    { name: 'Talent Hunter Delta', email: 'delta@eshikshan.com', password: 'Password123!', role: 'job_instructor', permissions: ['jobs'] },
];

const jobsData = [
    { title: 'Full Stack Engineer', company: 'Tech Giants', location: 'Bangalore', type: 'Full-time', salary: '₹12-20 LPA', category: 'Engineering' },
    { title: 'Frontend Developer', company: 'UI Masters', location: 'Remote', type: 'Contract', salary: '₹8-12 LPA', category: 'Frontend' },
    { title: 'Backend Architect', company: 'Scale Systems', location: 'Hyderabad', type: 'Full-time', salary: '₹25-40 LPA', category: 'Engineering' },
    { title: 'Product Manager', company: 'Next Unicorn', location: 'Mumbai', type: 'Full-time', salary: '₹15-25 LPA', category: 'Management' },
    { title: 'UI/UX Designer', company: 'Creative Labs', location: 'Pune', type: 'Internship', salary: '₹25-40k/month', category: 'Design' },
    { title: 'Data Scientist', company: 'Insight Corp', location: 'Chennai', type: 'Full-time', salary: '₹14-22 LPA', category: 'Data' },
    { title: 'DevOps Engineer', company: 'Cloud Native', location: 'Bangalore', type: 'Full-time', salary: '₹10-18 LPA', category: 'Engineering' },
    { title: 'Mobile Developer', company: 'App Innovators', location: 'Remote', type: 'Full-time', salary: '₹12-18 LPA', category: 'Mobile' },
    { title: 'Quality Assurance', company: 'Bug Hunters', location: 'Hyderabad', type: 'Contract', salary: '₹6-9 LPA', category: 'Engineering' },
    { title: 'Marketing Lead', company: 'Brand Pulse', location: 'Delhi', type: 'Full-time', salary: '₹10-15 LPA', category: 'Marketing' },
    { title: 'Sales Engineer', company: 'Global Reach', location: 'Mumbai', type: 'Full-time', salary: '₹12-18 LPA', category: 'Sales' },
    { title: 'HR Manager', company: 'People First', location: 'Bangalore', type: 'Full-time', salary: '₹8-12 LPA', category: 'HR' },
    { title: 'Legal Counsel', company: 'Fair Law', location: 'Delhi', type: 'Contract', salary: '₹15-20 LPA', category: 'Legal' },
    { title: 'Financial Analyst', company: 'Gold Standard', location: 'Mumbai', type: 'Full-time', salary: '₹10-14 LPA', category: 'Finance' },
    { title: 'Cybersecurity Expert', company: 'Safe Guard', location: 'Remote', type: 'Full-time', salary: '₹18-30 LPA', category: 'Security' },
];

const seedData = async () => {
    try {
        await connectDB();

        // Create Instructors
        const instructors = [];
        for (const data of instructorsData) {
            const hashedPassword = await bcrypt.hash(data.password, 10);
            const instructor = await Admin.findOneAndUpdate(
                { email: data.email },
                { ...data, password: hashedPassword },
                { upsert: true, new: true }
            );
            instructors.push(instructor);
        }
        console.log(`Created ${instructors.length} Job Instructors`);

        // Create Jobs and distribute among instructors
        for (let i = 0; i < jobsData.length; i++) {
            const jobData = jobsData[i];
            const instructor = instructors[i % instructors.length];

            await AdminJob.create({
                ...jobData,
                postedBy: instructor._id,
                status: 'Active',
                description: `Exciting opportunity for a ${jobData.title} at ${jobData.company}. Join our team in ${jobData.location}.`,
                about: `${jobData.company} is leading the way in ${jobData.category}.`,
                responsibilities: ['Write clean code', 'Collaborate with teams', 'Review requirements'],
                requirements: ['2+ years experience', 'Relevant degree', 'Good communication skills'],
                skills: [jobData.category, 'Software Development'],
                applyUrl: 'https://eshikshan.com/apply',
                posted: new Date()
            });
        }
        console.log(`Created ${jobsData.length} Jobs distributed among instructors`);

        console.log('Seeding completed successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Seeding error:', err);
        process.exit(1);
    }
};

seedData();
