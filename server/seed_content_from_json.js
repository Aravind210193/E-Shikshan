require('dotenv').config();
const mongoose = require('mongoose');
const AdminContent = require('./src/models/AdminContent');
const connectDB = require('./src/config/db');
const fs = require('fs');
const path = require('path');

// Read the JSON data
const rawData = fs.readFileSync(path.join(__dirname, '../client/src/data/complete_cse_data.json'), 'utf-8');
const cseData = JSON.parse(rawData);

const seedContent = async () => {
    try {
        await connectDB();
        console.log('\n🚀 Seeding AdminContent from JSON data...\n');

        // Clear existing generated content to avoid duplicates (optional, comment out if you want to keep)
        // await AdminContent.deleteMany({ type: 'subject' }); 

        let count = 0;
        const branchKey = 'computer-science--engineering';
        const branchData = cseData.branches[branchKey];

        if (!branchData) {
            console.error('❌ Branch data not found in JSON');
            process.exit(1);
        }

        console.log(`Processing Branch: ${branchData.name}`);

        // Iterate through semesters
        for (const [semKey, semData] of Object.entries(branchData.semesters)) {
            console.log(`  Processing ${semData.name}...`);

            // Iterate through subjects
            for (const subject of semData.subjects) {
                // Check if already exists to prevent duplicate seeding
                const exists = await AdminContent.findOne({
                    title: subject.name,
                    branch: branchKey,
                    semester: semKey
                });

                if (!exists) {
                    await AdminContent.create({
                        title: subject.name,
                        type: 'subject', // Main type
                        branch: branchKey,
                        subject: subject.code, // Storing code in subject field or create a new field
                        semester: semKey,
                        category: subject.type, // 'Core', 'Elective'
                        description: `Difficulty: ${subject.difficulty}. Credits: ${subject.credits}`,
                        tags: [subject.code, subject.type, subject.difficulty],
                        status: 'published',
                        // Store the detailed units structure in description or a separate field if schema allowed.
                        // Since schema is strict, we'll store a summary in description or rely on expanding the schema later.
                        // For now basic info.
                    });
                    count++;
                }
            }
        }

        console.log(`\n✅ Successfully seeded ${count} content items from JSON.`);
        process.exit(0);

    } catch (error) {
        console.error('❌ Seeding Error:', error);
        process.exit(1);
    }
};

seedContent();
