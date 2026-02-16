require('dotenv').config();
const mongoose = require('mongoose');
const Roadmap = require('./src/models/AdminRoadmap');
const roadmapsData = require('../client/src/Roadmap/skills.json');

const seedRoadmaps = async () => {
    try {
        // Connect to MongoDB
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/eshikshan';
        console.log('Connecting to MongoDB...');
        await mongoose.connect(mongoURI);
        console.log('✅ Connected to MongoDB');

        // Clear existing roadmaps
        console.log('Clearing existing roadmaps...');
        await Roadmap.deleteMany({});
        console.log('✅ Cleared existing roadmaps');

        // Insert roadmaps from JSON
        console.log(`Inserting ${roadmapsData.length} roadmaps...`);
        const result = await Roadmap.insertMany(roadmapsData);
        console.log(`✅ Successfully inserted ${result.length} roadmaps`);

        // Display summary
        console.log('\n📊 Seeding Summary:');
        console.log(`Total roadmaps: ${result.length}`);

        const categories = [...new Set(result.map(r => r.category))];
        console.log(`Categories: ${categories.join(', ')}`);

        console.log('\n✅ Roadmap seeding completed successfully!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding roadmaps:', error);
        process.exit(1);
    }
};

seedRoadmaps();
