
const fs = require('fs');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const AdminHackathon = require('./src/models/AdminHackathon');
const connectDB = require('./src/config/db');

async function run() {
    await connectDB();
    const hs = await AdminHackathon.find({});
    console.log('Listing all hackathons:');
    hs.forEach(h => {
        console.log(`- Title: "${h.title}" (ID: ${h._id}) | CreatedBy: ${h.createdBy}`);
    });
    process.exit();
}
run();
