
const mongoose = require('mongoose');
require('dotenv').config({ path: './server/.env' });
const AdminHackathon = require('./server/src/models/AdminHackathon');
const connectDB = require('./server/src/config/db');

connectDB().then(async () => {
    try {
        const hacks = await AdminHackathon.find({}).limit(5);
        console.log("Hackathons found:", hacks.length);
        hacks.forEach(h => {
            console.log(`Title: ${h.title}, CreatedBy: ${h.createdBy}`);
        });
    } catch (err) {
        console.error(err);
    } finally {
        process.exit();
    }
});
