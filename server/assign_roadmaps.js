const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const Admin = require('./src/models/Admin');
const Roadmap = require('./src/models/AdminRoadmap');

const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) throw new Error("MONGODB_URI is undefined");
        console.log('Connecting to Mongo URI:', uri.substring(0, 20) + '...');
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('Database connection failed:', err.message);
        process.exit(1);
    }
};

const updateRoadmaps = async () => {
    await connectDB();

    try {
        // Find a roadmap instructor first
        let instructor = await Admin.findOne({ role: 'roadmap_instructor' });

        // If no roadmap instructor, fallback to any admin
        if (!instructor) {
            console.log('No roadmap_instructor found, looking for any admin...');
            instructor = await Admin.findOne({ role: 'admin' });
        }

        if (!instructor) {
            console.error('No admin user found to assign roadmaps to.');
            process.exit(1);
        }

        console.log(`Found instructor: ${instructor.email} (${instructor._id})`);

        // Update all roadmaps ensuring they have a createdBy field
        // If createdBy is missing, update it. If it exists, we can optionally overwrite or leave it.
        // The request implies "roadmap instructor didnt added any roadmaps add all roadmaps", 
        // suggesting they are missing association or not showing up for them.
        // I will update ALL roadmaps without a createdBy field, or all roadmaps to this instructor if requested "add all".
        // To be safe and fulfill "add all roadmaps", I will update those missing createdBy first.

        const result = await Roadmap.updateMany(
            { $or: [{ createdBy: { $exists: false } }, { createdBy: null }] },
            { $set: { createdBy: instructor._id } }
        );

        console.log(`Updated ${result.modifiedCount} roadmaps to be owned by ${instructor.email}`);

        // Also listing all roadmaps to verify
        const allRoadmaps = await Roadmap.find({});
        console.log(`Total roadmaps in DB: ${allRoadmaps.length}`);
        allRoadmaps.forEach(r => {
            console.log(`- ${r.title} (${r._id}) -> Owner: ${r.createdBy}`);
        });

    } catch (error) {
        console.error('Error updating roadmaps:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected');
    }
};

updateRoadmaps();
