require('dotenv').config();
const mongoose = require('mongoose');
const Course = require('./src/models/Course');
const AdminCourse = require('./src/models/AdminCourse');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/eshikshan');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const checkId = async () => {
    await connectDB();

    // The ID from the error message
    const id = '68ff7ec3fd05ea6f687441a3';

    console.log(`Checking ID: ${id}`);

    try {
        const c = await Course.findById(id);
        console.log('Course result:', c ? 'FOUND' : 'NOT FOUND');
        if (c) console.log('Course:', c.title);

        const ac = await AdminCourse.findById(id);
        console.log('AdminCourse result:', ac ? 'FOUND' : 'NOT FOUND');
        if (ac) console.log('AdminCourse:', ac.title);

        // Also list all courses to see what IDs exist
        const allCourses = await Course.find({}).limit(5);
        console.log('First 5 Courses:', allCourses.map(x => ({ id: x._id.toString(), title: x.title })));

        const allAdminCourses = await AdminCourse.find({}).limit(5);
        console.log('First 5 AdminCourses:', allAdminCourses.map(x => ({ id: x._id.toString(), title: x.title })));

    } catch (e) {
        console.error('Error:', e);
    }

    process.exit();
};

checkId();
