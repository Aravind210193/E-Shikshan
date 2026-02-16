const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const Admin = require('./src/models/Admin');
const Roadmap = require('./src/models/AdminRoadmap');

const checkInfo = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) throw new Error("MONGODB_URI is undefined");
        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

        const instructor = await Admin.findOne({ role: 'roadmap_instructor' });
        if (instructor) {
            console.log(`Instructor: ${instructor.name} (${instructor.email})`);
        } else {
            console.log('No roadmap_instructor found');
        }

        const roadmaps = await Roadmap.find().populate('createdBy', 'name email');
        console.log(`Checking ${roadmaps.length} roadmaps:`);
        roadmaps.slice(0, 5).forEach(r => {
            console.log(`- ${r.title}: Created By ${r.createdBy ? r.createdBy.name : 'NULL'}`);
        });

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
};

checkInfo();
