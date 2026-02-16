const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./src/models/Admin');
const AdminHackathon = require('./src/models/AdminHackathon');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/e-shikshan';

const instructors = [
    { name: 'Hackathon Maestro X', email: 'maestro@eshikshan.com', password: 'Password123!', role: 'hackathon_instructor' },
    { name: 'Innovation Hub Gamma', email: 'gamma@eshikshan.com', password: 'Password123!', role: 'hackathon_instructor' },
    { name: 'Code Sprint Sigma', email: 'sigma@eshikshan.com', password: 'Password123!', role: 'hackathon_instructor' },
    { name: 'Dev Jam Omega', email: 'omega@eshikshan.com', password: 'Password123!', role: 'hackathon_instructor' }
];

const hackathons = [
    {
        title: 'Global AI Innovation Challenge 2026',
        organizer: 'AI Research Lab',
        location: 'Online',
        mode: 'online',
        tagline: 'Build the future with Generative AI',
        teamSize: '1-4 Members',
        prize: '$50,000 Total Prize Pool',
        tags: ['Artificial Intelligence', 'Machine Learning', 'Python'],
        status: 'active',
        overview: 'A global challenge to push the boundaries of AI.',
        howit: ['Register on E-Shikshan', 'Build your team', 'Submit project by deadline']
    },
    {
        title: 'Web3 Future-Hack',
        organizer: 'Blockchain Foundation',
        location: 'Online',
        mode: 'online',
        tagline: 'Decentralizing the world, one block at a time',
        teamSize: '1-3 Members',
        prize: '10 ETH + Mentorship',
        tags: ['Blockchain', 'Solidity', 'Web3'],
        status: 'active',
        overview: 'Create decentralized applications for the next generation of the web.',
        howit: ['Register', 'Submit smart contract link', 'Pitch to judges']
    },
    {
        title: 'Cyber Security Shield-a-thon',
        organizer: 'SecureLink Systems',
        location: 'Hybrid (Delhi/Online)',
        mode: 'hybrid',
        tagline: 'Hack it to Protect it',
        teamSize: '2-5 Members',
        prize: 'Job Offers + $5,000',
        tags: ['Cybersecurity', 'Ethical Hacking', 'Networking'],
        status: 'active',
        overview: 'Test your skills in finding vulnerabilities and securing systems.',
        howit: ['Capture the Flag', 'Defense simulation', 'Final presentation']
    },
    {
        title: 'FinTech Revolution 2026',
        organizer: 'Global Bank Corp',
        location: 'Online',
        mode: 'online',
        tagline: 'Reimagining Finance with Technology',
        teamSize: '1-4 Members',
        prize: '$20,000 Equity-free seed fund',
        tags: ['FinTech', 'Java', 'Cloud Computing'],
        status: 'active',
        overview: 'Solve real-world financial problems using innovative tech.',
        howit: ['Idea phase', 'Prototype phase', 'Demo day']
    },
    {
        title: 'Eco-Tech Sustainability Jam',
        organizer: 'Green Future Org',
        location: 'Online',
        mode: 'online',
        tagline: 'Coding for a Greener Planet',
        teamSize: '1-4 Members',
        prize: 'Sustainability Award + $10,000',
        tags: ['Environment', 'IoT', 'Sustainability'],
        status: 'upcoming',
        overview: 'Develop technology to combat climate change and promote sustainability.',
        howit: ['Register', 'Develop green tech', 'Submit impact report']
    }
];

// Duplicate some hackathons to get to 15
const allHackathons = [];
for (let i = 0; i < 3; i++) {
    hackathons.forEach(h => {
        allHackathons.push({
            ...h,
            title: i === 0 ? h.title : `${h.title} (Vol ${i + 1})`
        });
    });
}

const seed = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Create Instructors
        const createdInstructors = [];
        for (const inst of instructors) {
            const existing = await Admin.findOne({ email: inst.email });
            if (existing) {
                createdInstructors.push(existing);
                console.log(`Instructor ${inst.name} already exists`);
            } else {
                const hashedPassword = await bcrypt.hash(inst.password, 10);
                const newInst = await Admin.create({ ...inst, password: hashedPassword });
                createdInstructors.push(newInst);
                console.log(`Created Instructor: ${inst.name}`);
            }
        }

        // Create Hackathons
        await AdminHackathon.deleteMany({ createdBy: { $in: createdInstructors.map(i => i._id) } });

        for (let i = 0; i < allHackathons.length; i++) {
            const hack = allHackathons[i];
            const instructor = createdInstructors[i % createdInstructors.length];

            const startDate = new Date();
            startDate.setDate(startDate.getDate() + 7);
            const endDate = new Date();
            endDate.setDate(endDate.getDate() + 10);
            const regCloses = new Date();
            regCloses.setDate(regCloses.getDate() + 5);

            await AdminHackathon.create({
                ...hack,
                startDate,
                endDate,
                registrationCloses: regCloses,
                submissionDeadline: endDate,
                createdBy: instructor._id
            });
            console.log(`Created Hackathon: ${hack.title} posted by ${instructor.name}`);
        }

        console.log('Seeding completed successfully');
        process.exit();
    } catch (err) {
        console.error('Seeding failed:', err);
        process.exit(1);
    }
};

seed();
