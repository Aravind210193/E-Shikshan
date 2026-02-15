require('dotenv').config();
const connectDB = require('./src/config/db');
const mongoose = require('mongoose');
const Course = require('./src/models/Course');
const AdminCourse = require('./src/models/AdminCourse');

const inspect = async () => {
    console.log('Connecting to DB...');
    await connectDB();

    try {
        console.log('Listing Normal Courses:');
        const normal = await Course.find({}, '_id title').limit(5).lean();
        console.log(JSON.stringify(normal, null, 2));

        console.log('Listing Admin Courses:');
        const admin = await AdminCourse.find({}, '_id title').limit(5).lean();
        console.log(JSON.stringify(admin, null, 2));

        const targetId = '68ff7ec3fd05ea6f687441a3';
        console.log(`Checking specifically for ID: ${targetId}`);

        // Try direct MongoDB query bypassing Mongoose
        if (mongoose.Types.ObjectId.isValid(targetId)) {
            const rawNormal = await mongoose.connection.db.collection('courses').findOne({ _id: new mongoose.Types.ObjectId(targetId) });
            console.log('Raw DB Course lookup:', rawNormal ? 'FOUND' : 'NOT FOUND');

            const rawAdmin = await mongoose.connection.db.collection('admincourses').findOne({ _id: new mongoose.Types.ObjectId(targetId) });
            console.log('Raw DB AdminCourse lookup:', rawAdmin ? 'FOUND' : 'NOT FOUND');
        } else {
            console.log('Invalid ObjectId format');
        }

    } catch (e) {
        console.error('Error in script:', e);
    }

    console.log('Exiting...');
    process.exit();
};

inspect();
