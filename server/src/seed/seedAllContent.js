const mongoose = require('mongoose');
const Branch = require('../models/Branch');
const EducationLevel = require('../models/EducationLevel');
const Subject = require('../models/Subject');
const SemesterData = require('../models/SemesterData');
const Folder = require('../models/Folder');

const branchesData = require('../../client-data/branches.json');
const educationLevelsData = require('../../client-data/educationLevels.json');
const subjectsData = require('../../client-data/subjects.json');
const semesterData = require('../../client-data/semesterData.json');
const foldersData = require('../../client-data/folders.json');

require('dotenv').config();

const seedAllContent = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 MongoDB Connected for Content seeding...\n');

    // 1. Seed Branches
    console.log('🔹 Seeding Branches...');
    await Branch.deleteMany({});
    const branches = await Branch.insertMany(branchesData);
    console.log(`✅ Seeded ${branches.length} branches\n`);

    // 2. Seed Education Levels
    console.log('🔹 Seeding Education Levels...');
    await EducationLevel.deleteMany({});
    const levels = await EducationLevel.insertMany(educationLevelsData);
    console.log(`✅ Seeded ${levels.length} education levels\n`);

    // 3. Seed Subjects
    console.log('🔹 Seeding Subjects...');
    await Subject.deleteMany({});
    const subjectsArray = [];
    for (const [branch, semesters] of Object.entries(subjectsData)) {
      for (const [semester, subjects] of Object.entries(semesters)) {
        subjectsArray.push({ branch, semester, subjects });
      }
    }
    const insertedSubjects = await Subject.insertMany(subjectsArray);
    console.log(`✅ Seeded ${insertedSubjects.length} subject groups\n`);

    // 4. Seed Semester Data
    console.log('🔹 Seeding Semester Data...');
    await SemesterData.deleteMany({});
    const semesterDataArray = [];
    for (const [programKey, programData] of Object.entries(semesterData)) {
      // Check if programData has a name property
      if (programData && programData.name) {
        semesterDataArray.push({ 
          programKey, 
          name: programData.name,
          shortName: programData.shortName || programKey,
          totalSemesters: programData.totalSemesters || 0,
          color: programData.color || 'blue',
          description: programData.description || '',
          semesters: programData.semesters || {},
        });
      }
    }
    const insertedSemesterData = await SemesterData.insertMany(semesterDataArray);
    console.log(`✅ Seeded ${insertedSemesterData.length} programs\n`);

    // 5. Seed Folders
    console.log('🔹 Seeding Folders...');
    await Folder.deleteMany({});
    const foldersArray = [];
    for (const [branch, subjects] of Object.entries(foldersData)) {
      for (const [subject, units] of Object.entries(subjects)) {
        foldersArray.push({ branch, subject, units });
      }
    }
    const insertedFolders = await Folder.insertMany(foldersArray);
    console.log(`✅ Seeded ${insertedFolders.length} folders\n`);

    console.log('🎉 All content seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Branches: ${branches.length}`);
    console.log(`   - Education Levels: ${levels.length}`);
    console.log(`   - Subject Groups: ${insertedSubjects.length}`);
    console.log(`   - Programs: ${insertedSemesterData.length}`);
    console.log(`   - Folders: ${insertedFolders.length}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding content:', error);
    process.exit(1);
  }
};

seedAllContent();
