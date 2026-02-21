const mongoose = require('mongoose');

// Badge Schema
const badgeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  icon: { type: String, required: true }, // URL or emoji
  category: {
    type: String,
    enum: ['achievement', 'streak', 'milestone', 'special', 'course', 'social', 'hackathon'],
    required: true
  },
  criteria: {
    criteriaType: {
      type: String,
      enum: ['points', 'streak', 'courses', 'quizzes', 'videos', 'assignments', 'login', 'hackathons', 'hackathon_round', 'custom'],
      required: true
    },
    value: { type: Number, required: true },
    description: { type: String }
  },
  rarity: {
    type: String,
    enum: ['common', 'rare', 'epic', 'legendary'],
    default: 'common'
  },
  points: { type: Number, default: 0 },
  color: { type: String, default: '#6366f1' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

// User Gamification Schema
const userGamificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },

  // Points System
  totalPoints: { type: Number, default: 0 },
  levelPoints: { type: Number, default: 0 }, // Points in current level
  level: { type: Number, default: 1 },
  nextLevelPoints: { type: Number, default: 100 },

  // Experience breakdown
  pointsBreakdown: {
    videosWatched: { type: Number, default: 0 },
    quizzesCompleted: { type: Number, default: 0 },
    assignmentsSubmitted: { type: Number, default: 0 },
    coursesCompleted: { type: Number, default: 0 },
    loginStreak: { type: Number, default: 0 },
    badges: { type: Number, default: 0 },
    special: { type: Number, default: 0 }
  },

  // Streak System
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  lastActivityDate: { type: Date },
  streakHistory: [{
    date: { type: Date },
    maintained: { type: Boolean }
  }],

  // Badges
  badges: [{
    badgeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Badge'
    },
    earnedAt: { type: Date, default: Date.now },
    notified: { type: Boolean, default: false }
  }],

  // Achievements
  achievements: {
    videosWatched: { type: Number, default: 0 },
    totalWatchTime: { type: Number, default: 0 }, // in minutes
    quizzesCompleted: { type: Number, default: 0 },
    quizzesPassed: { type: Number, default: 0 },
    averageQuizScore: { type: Number, default: 0 },
    assignmentsSubmitted: { type: Number, default: 0 },
    assignmentsOnTime: { type: Number, default: 0 },
    coursesStarted: { type: Number, default: 0 },
    coursesCompleted: { type: Number, default: 0 },
    certificatesEarned: { type: Number, default: 0 },
    perfectQuizzes: { type: Number, default: 0 }, // 100% scores
    firstTrySuccess: { type: Number, default: 0 },

    // Hackathon Stats
    hackathonsJoined: { type: Number, default: 0 },
    hackathonsSelected: { type: Number, default: 0 },
    hackathonRoundsCleared: { type: Number, default: 0 },
    hackathonPodiums: { type: Number, default: 0 }
  },

  // Leaderboard stats
  rank: { type: Number },
  rankCategory: { type: String }, // overall, course, university, department
  lastRankUpdate: { type: Date },

  // Activity tracking
  dailyGoal: { type: Number, default: 50 }, // points per day
  dailyProgress: { type: Number, default: 0 },
  lastDailyReset: { type: Date, default: Date.now },

  // Rewards
  rewardsEarned: [{
    type: {
      type: String,
      enum: ['badge', 'points', 'certificate', 'unlock', 'special']
    },
    description: { type: String },
    value: { type: Number },
    earnedAt: { type: Date, default: Date.now }
  }],

  // Challenges
  activeChallenges: [{
    challengeId: { type: String },
    name: { type: String },
    description: { type: String },
    progress: { type: Number, default: 0 },
    target: { type: Number },
    reward: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    completed: { type: Boolean, default: false }
  }],

  // Social features
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Index for leaderboard queries
userGamificationSchema.index({ totalPoints: -1 });
userGamificationSchema.index({ level: -1 });
userGamificationSchema.index({ currentStreak: -1 });

// Activity Log Schema
const activityLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  activityType: {
    type: String,
    enum: [
      'video_watched', 'quiz_completed', 'quiz_passed', 'quiz_perfect',
      'assignment_submitted', 'assignment_completed', 'project_submitted', 'project_graded',
      'course_started', 'course_completed', 'badge_earned', 'level_up', 'streak_maintained',
      'login', 'certificate_earned', 'achievement_unlocked',

      // Hackathon activities
      'hackathon_joined', 'hackathon_selected', 'hackathon_round_cleared', 'hackathon_winner'
    ],
    required: true
  },
  pointsEarned: { type: Number, default: 0 },
  description: { type: String },
  metadata: {
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'CourseModule' },
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
    score: { type: Number },
    duration: { type: Number },
    contentType: { type: String }
  },
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Index for activity queries
activityLogSchema.index({ userId: 1, createdAt: -1 });
activityLogSchema.index({ activityType: 1 });

const Badge = mongoose.model('Badge', badgeSchema);
const UserGamification = mongoose.model('UserGamification', userGamificationSchema);
const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

module.exports = { Badge, UserGamification, ActivityLog };
