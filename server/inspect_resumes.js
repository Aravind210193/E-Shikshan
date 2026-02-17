const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const AdminResume = require('./src/models/AdminResume');
const Admin = require('./src/models/Admin');

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        const resumes = await AdminResume.find({});
        console.log(`Resumes count: ${resumes.length}`);
        resumes.forEach(r => console.log(`resume: ${r.name}, createdBy: ${r.createdBy}`));

        const admins = await Admin.find({});
        console.log(`Admins count: ${admins.length}`);
        admins.forEach(a => console.log(`admin: ${a.name} (${a.email}), role: ${a.role}, id: ${a._id}`));

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
};

run();
