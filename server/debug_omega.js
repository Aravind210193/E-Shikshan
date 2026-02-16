
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
        console.log('--- DEBUG START ---');

        const hackathon = await AdminHackathon.findOne({ title: { $regex: /dev jam omega/i } });
        if (!hackathon) {
            console.log('❌ Hackathon "dev jam omega" not found.');
            const anyH = await AdminHackathon.findOne({ title: { $regex: /omega/i } });
            if (anyH) {
                console.log(`💡 Found similar hackathon: "${anyH.title}" (ID: ${anyH._id})`);
                await checkH(anyH);
            } else {
                console.log('Existing hackathons:');
                const allH = await AdminHackathon.find({}).limit(10);
                allH.forEach(h => console.log(`- ${h.title} (ID: ${h._id})`));
            }
        } else {
            console.log(`✅ Found hackathon: "${hackathon.title}" (ID: ${hackathon._id})`);
            await checkH(hackathon);
        }

        async function checkH(h) {
            console.log(`   CreatedBy: ${h.createdBy}`);
            const creator = await Admin.findById(h.createdBy);
            if (creator) {
                console.log(`   Instructor: ${creator.name} (${creator.email}) [ID: ${creator._id}]`);
            } else {
                console.log('   ⚠️ Instructor not found for this hackathon!');
            }

            const regs = await HackathonRegistration.find({ hackathonId: h._id }).populate('userId', 'email');
            console.log(`   Registrations count: ${regs.length}`);
            regs.forEach(r => {
                console.log(`   - User: ${r.userId?.email} | Instructor Assigned: ${r.instructor}`);
                if (r.instructor && r.instructor.toString() === h.createdBy?.toString()) {
                    console.log('     ✅ Correctly assigned to hackathon creator.');
                } else {
                    console.log('     ❌ NOT assigned to hackathon creator!');
                }
            });
        }

        console.log('--- DEBUG END ---');
    } catch (err) {
        console.error(err);
    } finally {
        process.exit();
    }
};

debug();
