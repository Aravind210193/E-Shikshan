
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const AdminHackathon = require('./src/models/AdminHackathon');
const HackathonRegistration = require('./src/models/HackathonRegistration');
const Admin = require('./src/models/Admin');
const User = require('./src/models/User');
const connectDB = require('./src/config/db');

const debug = async () => {
    try {
        await connectDB();
        console.log('--- HACKATHON DEBUG ---');

        // 1. Find the "omegainstructor" admin
        const instructor = await Admin.findOne({
            $or: [
                { name: /omega/i },
                { email: /omega/i }
            ]
        });

        if (!instructor) {
            console.log('❌ Instructor "omega" not found.');
        } else {
            console.log(`✅ Found Instructor: ${instructor.name} (${instructor.email}) [ID: ${instructor._id}]`);
            console.log(`   Role: ${instructor.role}`);
        }

        // 2. Find the hackathons created by this instructor or with "omega" in title
        const hackathons = await AdminHackathon.find({
            $or: [
                { title: /omega/i },
                { createdBy: instructor?._id }
            ]
        });

        console.log(`\nFound ${hackathons.length} relevant hackathons:`);
        for (const h of hackathons) {
            const creator = await Admin.findById(h.createdBy);
            console.log(`\n📍 Hackathon: "${h.title}" (ID: ${h._id})`);
            console.log(`   Created By: ${creator ? creator.name : 'Unknown'} (${h.createdBy})`);

            // 3. Check registrations for this hackathon
            const regs = await HackathonRegistration.find({ hackathonId: h._id }).populate('userId', 'email');
            console.log(`   Total Registrations: ${regs.length}`);

            regs.forEach(r => {
                console.log(`   - Student: ${r.userId?.email || 'N/A'}`);
                console.log(`     Assigned Instructor ID: ${r.instructor}`);
                if (instructor && r.instructor && r.instructor.toString() === instructor._id.toString()) {
                    console.log('     ✅ Assigned correctly to "omega"');
                } else {
                    console.log('     ❌ NOT assigned to "omega"');
                }
            });
        }

        console.log('\n--- DEBUG END ---');
    } catch (err) {
        console.error(err);
    } finally {
        process.exit();
    }
};

debug();
