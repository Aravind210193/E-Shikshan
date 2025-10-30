const mongoose = require('mongoose');
const Subject = require('../models/Subject');
const subjectsData = require('../../client-data/subjects.json');
require('dotenv').config();

const seedSubjects = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 MongoDB Connected for Subjects seeding...');

    // Clear existing data
    await Subject.deleteMany({});
    console.log('🗑️  Cleared existing subjects');

    // Transform subjects.json structure into array format
    const subjectsArray = [];
    
    for (const [branch, semesters] of Object.entries(subjectsData)) {
      for (const [semester, subjects] of Object.entries(semesters)) {
        subjectsArray.push({
          branch,
          semester,
          subjects,
        });
      }
    }

    // Insert new data
    const insertedSubjects = await Subject.insertMany(subjectsArray);
    console.log(`✅ Successfully seeded ${insertedSubjects.length} subject groups`);

    console.log('📋 Seeded subjects by branch:');
    insertedSubjects.forEach(subjectGroup => {
      console.log(`   - ${subjectGroup.branch} / ${subjectGroup.semester}: ${subjectGroup.subjects.length} subjects`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding subjects:', error);
    process.exit(1);
  }
};

seedSubjects();
