const mongoose = require('mongoose');
const Course = require('../models/Course');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Load courses data from JSON file
const coursesDataPath = path.join(__dirname, '../../data/courses.json');
const coursesData = JSON.parse(fs.readFileSync(coursesDataPath, 'utf8'));

const seedCourses = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/e-shikshan', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('MongoDB connected successfully');

    // Clear existing courses
    await Course.deleteMany({});
    console.log('Cleared existing courses');

    // Insert new courses
    const courses = await Course.insertMany(coursesData);
    console.log(`${courses.length} courses seeded successfully`);
    
    // Print the course IDs for reference
    console.log('\nCourse IDs:');
    courses.forEach((course, index) => {
      console.log(`${index + 1}. ${course.title}: ${course._id}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding courses:', error);
    process.exit(1);
  }
};

seedCourses();
