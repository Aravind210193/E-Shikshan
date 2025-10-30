const mongoose = require('mongoose');
const Folder = require('../models/Folder');
const foldersData = require('../../client-data/folders.json');
require('dotenv').config();

const seedFolders = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 MongoDB Connected for Folders seeding...');

    // Clear existing data
    await Folder.deleteMany({});
    console.log('🗑️  Cleared existing folders');

    // Transform folders.json structure into array format
    const foldersArray = [];
    
    for (const [branch, subjects] of Object.entries(foldersData)) {
      for (const [subject, units] of Object.entries(subjects)) {
        foldersArray.push({
          branch,
          subject,
          units,
        });
      }
    }

    // Insert new data
    const insertedFolders = await Folder.insertMany(foldersArray);
    console.log(`✅ Successfully seeded ${insertedFolders.length} folders`);

    console.log('📋 Seeded folders by branch:');
    insertedFolders.forEach(folder => {
      console.log(`   - ${folder.branch} / ${folder.subject}: ${folder.units.length} units`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding folders:', error);
    process.exit(1);
  }
};

seedFolders();
