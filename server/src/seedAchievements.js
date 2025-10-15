require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Achievement = require('./models/Achievement');
const connectDB = require('./config/db');

// Path debugging
console.log('Current directory:', __dirname);
console.log('Attempting to connect to MongoDB:', process.env.MONGODB_URI);

// Sample achievements data
const achievementData = [
  {
    title: 'First Course Completed',
    description: 'Successfully completed your first course on E-Shikshan!',
    type: 'achievement',
    date: new Date('2025-08-15')
  },
  {
    title: 'Perfect Quiz Score',
    description: 'Earned a perfect score on a quiz!',
    type: 'badge',
    date: new Date('2025-08-20')
  },
  {
    title: 'Web Development Certificate',
    description: 'Successfully completed the Web Development course',
    type: 'certificate',
    date: new Date('2025-09-01'),
    image: 'https://example.com/certificate.jpg',
    metadata: {
      courseId: 'web-dev-101',
      instructor: 'John Doe',
      grade: 'A+'
    }
  },
  {
    title: 'React.js Master',
    description: 'Completed advanced React.js course with distinction',
    type: 'certificate',
    date: new Date('2025-09-15'),
    metadata: {
      courseId: 'react-advanced',
      instructor: 'Jane Smith',
      grade: 'A'
    }
  }
];

// Connect to database
connectDB();

// Seed achievements
const seedAchievements = async () => {
  try {
    // Clear existing achievements
    await Achievement.deleteMany({});
    console.log('Existing achievements cleared');

    // Find all users
    const users = await User.find({});
    
    if (users.length === 0) {
      console.log('No users found. Please create users first.');
      process.exit(1);
    }

    // Create achievements for each user
    const achievements = [];
    
    for (const user of users) {
      console.log(`Creating achievements for user: ${user.name}`);
      
      for (const data of achievementData) {
        achievements.push({
          ...data,
          user: user._id
        });
      }
    }

    // Insert achievements
    await Achievement.insertMany(achievements);
    console.log(`${achievements.length} achievements created`);

    console.log('Achievement seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding achievements:', error);
    process.exit(1);
  }
};

seedAchievements();