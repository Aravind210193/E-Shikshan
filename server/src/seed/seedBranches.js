const mongoose = require('mongoose');
const Branch = require('../models/Branch');
const branchesData = require('../../client-data/branches.json');
require('dotenv').config();

const seedBranches = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 MongoDB Connected for Branches seeding...');

    // Clear existing data
    await Branch.deleteMany({});
    console.log('🗑️  Cleared existing branches');

    // Insert new data
    const branches = await Branch.insertMany(branchesData);
    console.log(`✅ Successfully seeded ${branches.length} branches`);

    console.log('📋 Seeded branches:');
    branches.forEach(branch => {
      console.log(`   - ${branch.title} (${branch.link})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding branches:', error);
    process.exit(1);
  }
};

seedBranches();
