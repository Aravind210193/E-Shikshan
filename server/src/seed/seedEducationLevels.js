const mongoose = require('mongoose');
const EducationLevel = require('../models/EducationLevel');
const educationLevelsData = require('../../client-data/educationLevels.json');
require('dotenv').config();

const seedEducationLevels = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 MongoDB Connected for Education Levels seeding...');

    // Clear existing data
    await EducationLevel.deleteMany({});
    console.log('🗑️  Cleared existing education levels');

    // Insert new data
    const levels = await EducationLevel.insertMany(educationLevelsData);
    console.log(`✅ Successfully seeded ${levels.length} education levels`);

    console.log('📋 Seeded education levels:');
    levels.forEach(level => {
      console.log(`   - ${level.level} with ${level.branches.length} branches`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding education levels:', error);
    process.exit(1);
  }
};

seedEducationLevels();
