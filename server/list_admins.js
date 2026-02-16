
const mongoose = require('mongoose');
require('dotenv').config({ path: './server/.env' });
const Admin = require('./server/src/models/Admin');
const connectDB = require('./server/src/config/db');

connectDB().then(async () => {
    try {
        const admins = await Admin.find({}).select('email role');
        console.log("Admins:", JSON.stringify(admins, null, 2));
    } catch (err) {
        console.error(err);
    } finally {
        process.exit();
    }
});
