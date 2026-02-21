const mongoose = require('mongoose');
const { Badge } = require('./src/models/Gamification');
require('dotenv').config();

const badges = [
  // Achievement Badges
  {
    name: 'First Steps',
    description: 'Complete your first video',
    icon: '🎯',
    category: 'achievement',
    criteria: { criteriaType: 'videos', value: 1 },
    rarity: 'common',
    points: 50,
    color: '#10b981'
  },
  {
    name: 'Video Enthusiast',
    description: 'Watch 10 videos',
    icon: '📺',
    category: 'achievement',
    criteria: { criteriaType: 'videos', value: 10 },
    rarity: 'common',
    points: 100,
    color: '#3b82f6'
  },
  {
    name: 'Binge Watcher',
    description: 'Watch 50 videos',
    icon: '🎬',
    category: 'achievement',
    criteria: { criteriaType: 'videos', value: 50 },
    rarity: 'rare',
    points: 200,
    color: '#8b5cf6'
  },
  {
    name: 'Video Master',
    description: 'Watch 100 videos',
    icon: '🏆',
    category: 'achievement',
    criteria: { criteriaType: 'videos', value: 100 },
    rarity: 'epic',
    points: 500,
    color: '#f59e0b'
  },

  // Quiz Badges
  {
    name: 'Quiz Beginner',
    description: 'Complete your first quiz',
    icon: '📝',
    category: 'achievement',
    criteria: { criteriaType: 'quizzes', value: 1 },
    rarity: 'common',
    points: 75,
    color: '#10b981'
  },
  {
    name: 'Quiz Expert',
    description: 'Complete 10 quizzes',
    icon: '🎓',
    category: 'achievement',
    criteria: { criteriaType: 'quizzes', value: 10 },
    rarity: 'common',
    points: 150,
    color: '#3b82f6'
  },
  {
    name: 'Quiz Champion',
    description: 'Complete 25 quizzes',
    icon: '🏅',
    category: 'achievement',
    criteria: { criteriaType: 'quizzes', value: 25 },
    rarity: 'rare',
    points: 300,
    color: '#8b5cf6'
  },
  {
    name: 'Quiz Legend',
    description: 'Complete 50 quizzes',
    icon: '👑',
    category: 'achievement',
    criteria: { criteriaType: 'quizzes', value: 50 },
    rarity: 'epic',
    points: 600,
    color: '#f59e0b'
  },

  // Course Completion Badges
  {
    name: 'Course Starter',
    description: 'Complete your first course',
    icon: '🎯',
    category: 'achievement',
    criteria: { criteriaType: 'courses', value: 1 },
    rarity: 'common',
    points: 200,
    color: '#10b981'
  },
  {
    name: 'Course Collector',
    description: 'Complete 3 courses',
    icon: '📚',
    category: 'achievement',
    criteria: { criteriaType: 'courses', value: 3 },
    rarity: 'rare',
    points: 400,
    color: '#3b82f6'
  },
  {
    name: 'Course Master',
    description: 'Complete 5 courses',
    icon: '🎖️',
    category: 'achievement',
    criteria: { criteriaType: 'courses', value: 5 },
    rarity: 'epic',
    points: 800,
    color: '#8b5cf6'
  },
  {
    name: 'Learning Legend',
    description: 'Complete 10 courses',
    icon: '🌟',
    category: 'achievement',
    criteria: { criteriaType: 'courses', value: 10 },
    rarity: 'legendary',
    points: 1500,
    color: '#ef4444'
  },

  // Streak Badges
  {
    name: 'Day Streak',
    description: 'Maintain a 3-day learning streak',
    icon: '🔥',
    category: 'streak',
    criteria: { criteriaType: 'streak', value: 3 },
    rarity: 'common',
    points: 100,
    color: '#f97316'
  },
  {
    name: 'Week Warrior',
    description: 'Maintain a 7-day learning streak',
    icon: '⚡',
    category: 'streak',
    criteria: { criteriaType: 'streak', value: 7 },
    rarity: 'rare',
    points: 250,
    color: '#f59e0b'
  },
  {
    name: 'Dedication Master',
    description: 'Maintain a 14-day learning streak',
    icon: '💪',
    category: 'streak',
    criteria: { criteriaType: 'streak', value: 14 },
    rarity: 'epic',
    points: 500,
    color: '#8b5cf6'
  },
  {
    name: 'Unstoppable Force',
    description: 'Maintain a 30-day learning streak',
    icon: '🚀',
    category: 'streak',
    criteria: { criteriaType: 'streak', value: 30 },
    rarity: 'legendary',
    points: 1000,
    color: '#ef4444'
  },

  // Milestone Badges
  {
    name: 'Points Pioneer',
    description: 'Earn 100 total points',
    icon: '💎',
    category: 'milestone',
    criteria: { criteriaType: 'points', value: 100 },
    rarity: 'common',
    points: 50,
    color: '#10b981'
  },
  {
    name: 'Points Collector',
    description: 'Earn 500 total points',
    icon: '💰',
    category: 'milestone',
    criteria: { criteriaType: 'points', value: 500 },
    rarity: 'common',
    points: 100,
    color: '#3b82f6'
  },
  {
    name: 'Points Expert',
    description: 'Earn 1000 total points',
    icon: '💵',
    category: 'milestone',
    criteria: { criteriaType: 'points', value: 1000 },
    rarity: 'rare',
    points: 200,
    color: '#8b5cf6'
  },
  {
    name: 'Points Master',
    description: 'Earn 2500 total points',
    icon: '🏆',
    category: 'milestone',
    criteria: { criteriaType: 'points', value: 2500 },
    rarity: 'epic',
    points: 500,
    color: '#f59e0b'
  },
  {
    name: 'Points Legend',
    description: 'Earn 5000 total points',
    icon: '👑',
    category: 'milestone',
    criteria: { criteriaType: 'points', value: 5000 },
    rarity: 'legendary',
    points: 1000,
    color: '#ef4444'
  },

  // Assignment Badges
  {
    name: 'Assignment Starter',
    description: 'Submit your first assignment',
    icon: '📄',
    category: 'achievement',
    criteria: { criteriaType: 'assignments', value: 1 },
    rarity: 'common',
    points: 50,
    color: '#10b981'
  },
  {
    name: 'Assignment Pro',
    description: 'Submit 10 assignments',
    icon: '📋',
    category: 'achievement',
    criteria: { criteriaType: 'assignments', value: 10 },
    rarity: 'rare',
    points: 250,
    color: '#3b82f6'
  },
  {
    name: 'Assignment Expert',
    description: 'Submit 25 assignments',
    icon: '📊',
    category: 'achievement',
    criteria: { criteriaType: 'assignments', value: 25 },
    rarity: 'epic',
    points: 500,
    color: '#8b5cf6'
  },

  // Special Badges
  {
    name: 'Early Bird',
    description: 'Login before 8 AM',
    icon: '🌅',
    category: 'special',
    criteria: { criteriaType: 'custom', value: 1 },
    rarity: 'rare',
    points: 150,
    color: '#f59e0b'
  },
  {
    name: 'Night Owl',
    description: 'Study after 10 PM',
    icon: '🦉',
    category: 'special',
    criteria: { criteriaType: 'custom', value: 1 },
    rarity: 'rare',
    points: 150,
    color: '#8b5cf6'
  },
  {
    name: 'Perfect Score',
    description: 'Get 100% on any quiz',
    icon: '💯',
    category: 'special',
    criteria: { criteriaType: 'custom', value: 1 },
    rarity: 'epic',
    points: 300,
    color: '#10b981'
  },
  {
    name: 'Speed Demon',
    description: 'Complete a quiz in record time',
    icon: '⚡',
    category: 'special',
    criteria: { criteriaType: 'custom', value: 1 },
    rarity: 'rare',
    points: 200,
    color: '#f59e0b'
  },

  // Hackathon Badges
  {
    name: 'Hackathon Rookie',
    description: 'Join your first hackathon',
    icon: '💻',
    category: 'hackathon',
    criteria: { criteriaType: 'hackathons', value: 1 },
    rarity: 'common',
    points: 150,
    color: '#ec4899' // Pinkish
  },
  {
    name: 'Sprint Runner',
    description: 'Join 5 hackathons',
    icon: '🏃',
    category: 'hackathon',
    criteria: { criteriaType: 'hackathons', value: 5 },
    rarity: 'rare',
    points: 500,
    color: '#db2777'
  },
  {
    name: 'Selection Star',
    description: 'Get selected for a hackathon',
    icon: '⭐',
    category: 'hackathon',
    criteria: { criteriaType: 'custom', value: 1 }, // Handled via points/trigger
    rarity: 'rare',
    points: 300,
    color: '#fbbf24'
  },
  {
    name: 'Round Advancer',
    description: 'Clear a further round in any hackathon',
    icon: '🎯',
    category: 'hackathon',
    criteria: { criteriaType: 'hackathon_round', value: 1 },
    rarity: 'rare',
    points: 400,
    color: '#8b5cf6'
  },
  {
    name: 'Elite Hacker',
    description: 'Clear 5 rounds across hackathons',
    icon: '🎖️',
    category: 'hackathon',
    criteria: { criteriaType: 'hackathon_round', value: 5 },
    rarity: 'epic',
    points: 1000,
    color: '#f59e0b'
  }
];

const seedBadges = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log('Connected to MongoDB');

    // Clear existing badges
    await Badge.deleteMany({});
    console.log('Cleared existing badges');

    // Insert new badges
    await Badge.insertMany(badges);
    console.log(`✅ Successfully seeded ${badges.length} badges!`);

    // Display summary
    const summary = badges.reduce((acc, badge) => {
      acc[badge.category] = (acc[badge.category] || 0) + 1;
      return acc;
    }, {});

    console.log('\n📊 Badges by Category:');
    Object.entries(summary).forEach(([category, count]) => {
      console.log(`  ${category}: ${count} badges`);
    });

    const raritySummary = badges.reduce((acc, badge) => {
      acc[badge.rarity] = (acc[badge.rarity] || 0) + 1;
      return acc;
    }, {});

    console.log('\n🎯 Badges by Rarity:');
    Object.entries(raritySummary).forEach(([rarity, count]) => {
      console.log(`  ${rarity}: ${count} badges`);
    });

    mongoose.connection.close();
    console.log('\n✅ Badge seeding complete!');
  } catch (error) {
    console.error('❌ Error seeding badges:', error);
    process.exit(1);
  }
};

seedBadges();

