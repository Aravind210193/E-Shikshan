const mongoose = require('mongoose');
const SemesterData = require('../models/SemesterData');
const semesterData = require('../../client-data/semesterData.json');
require('dotenv').config();

const seedSemesterData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 MongoDB Connected for Semester Data seeding...');

    // Clear existing data
    await SemesterData.deleteMany({});
    console.log('🗑️  Cleared existing semester data');

    // Transform semester data structure into array format
    const semesterDataArray = [];
    
    for (const [programKey, programData] of Object.entries(semesterData)) {
      semesterDataArray.push({
        programKey,
        ...programData,
      });
    }

    // Insert new data
    const insertedData = await SemesterData.insertMany(semesterDataArray);
    console.log(`✅ Successfully seeded ${insertedData.length} programs`);

    console.log('📋 Seeded programs:');
    insertedData.forEach(program => {
      const semesterCount = program.semesters ? program.semesters.size : 0;
      console.log(`   - ${program.name} (${program.programKey}): ${semesterCount} semesters`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding semester data:', error);
    process.exit(1);
  }
};

seedSemesterData();
