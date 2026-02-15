// testAchievementApi.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Achievement = require('./models/Achievement');
const jwt = require('jsonwebtoken');
const connectDB = require('./config/db');

// Connect to MongoDB
connectDB();

const testAPI = async () => {
  try {
    // Find a user to create a token for
    const user = await User.findOne({});
    
    if (!user) {
      console.log('No users found in the database');
      process.exit(1);
    }
    
    console.log(`Found user: ${user.name} (${user._id})`);
    
    // Generate a token for this user
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    
    console.log('\nGenerated token for API testing:');
    console.log(token);
    console.log('\nYou can use this token in your API requests, for example:');
    console.log(`curl -X GET http://localhost:5000/api/achievements -H "Authorization: Bearer ${token}"`);
    
    // Find achievements for this user
    const achievements = await Achievement.find({ user: user._id });
    console.log(`\nFound ${achievements.length} achievements for this user in the database:`);
    
    achievements.forEach((achievement, index) => {
      console.log(`\n${index + 1}. ${achievement.title}`);
      console.log(`   Type: ${achievement.type}`);
      console.log(`   Date: ${achievement.date}`);
      console.log(`   Description: ${achievement.description}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error testing API:', error);
    process.exit(1);
  }
};

testAPI();