
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const AdminHackathon = require('./src/models/AdminHackathon');
const HackathonRegistration = require('./src/models/HackathonRegistration');
const Admin = require('./src/models/Admin');
const connectDB = require('./src/config/db');

async function fix() {
    await connectDB();
    console.log('--- FIXING OMEGA INSTRUCTOR ---');

    // 1. Get the target instructor
    const instructor = await Admin.findOne({ email: 'omega@eshikshan.com' });
    if (!instructor) {
        console.log('❌ Instructor omega@eshikshan.com not found.');
        process.exit();
    }
    console.log(`✅ Instructor ID: ${instructor._id}`);

    // 2. Find the hackathon (searching for any with Omega in the title)
    let hackathon = await AdminHackathon.findOne({ title: /omega/i });

    if (!hackathon) {
        console.log('❌ No hackathon with "Omega" in title found. Creating one for testing...');
        hackathon = await AdminHackathon.create({
            title: 'Dev Jam Omega Initiative',
            description: 'The ultimate omega challenge.',
            organizer: 'E-Shikshan',
            createdBy: instructor._id,
            status: 'active'
        });
    } else {
        console.log(`✅ Found Hackathon: "${hackathon.title}" (Current Creator: ${hackathon.createdBy})`);
        // Force ownership to our instructor
        hackathon.createdBy = instructor._id;
        await hackathon.save();
        console.log(`✅ Ownership updated to ${instructor.name}`);
    }

    // 3. Update registrations to point to this hackathon AND this instructor
    const emails = ['bhuchiki12@gmail.com', 'bujjisekhar345@gmail.com'];
    const User = require('./src/models/User');

    for (const email of emails) {
        const user = await User.findOne({ email });
        if (user) {
            // Update or create registration
            const reg = await HackathonRegistration.findOneAndUpdate(
                { userId: user._id, hackathonId: hackathon._id },
                {
                    instructor: instructor._id,
                    status: 'pending',
                    userDetails: { name: user.name, email: user.email }
                },
                { upsert: true, new: true }
            );
            console.log(`✅ Registered/Updated ${email} for hackathon "${hackathon.title}"`);
        }
    }

    console.log('--- FIX COMPLETE ---');
    process.exit();
}
fix();
