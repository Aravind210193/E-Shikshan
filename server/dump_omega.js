
const fs = require('fs');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const AdminHackathon = require('./src/models/AdminHackathon');
const HackathonRegistration = require('./src/models/HackathonRegistration');
const Admin = require('./src/models/Admin');
const connectDB = require('./src/config/db');

async function run() {
    await connectDB();
    const data = {};
    data.admins = await Admin.find({ email: /omega/i });
    data.hackathons = await AdminHackathon.find({ title: /omega/i });
    if (data.hackathons.length > 0) {
        data.registrations = await HackathonRegistration.find({ hackathonId: data.hackathons[0]._id });
    }
    fs.writeFileSync('omega_dump.json', JSON.stringify(data, null, 2), 'utf8');
    process.exit();
}
run();
