const express = require('express');
const router = express.Router();
const { Badge, UserGamification, ActivityLog } = require('../models/Gamification');
const {
  getUserGamification,
  getLeaderboard,
  getUserActivity,
  trackDailyLogin,
  trackVideoWatched,
  trackQuizCompleted,
  trackAssignmentSubmitted,
  trackCourseProgress,
  POINTS_CONFIG
} = require('../utils/gamification');
const { protect } = require('../middlewares/authMiddleware');

// Get user's gamification data
router.get('/profile', protect, async (req, res) => {
  try {
    const gamification = await getUserGamification(req.user._id);
    
    res.json({
      success: true,
      data: gamification
    });
  } catch (error) {
    console.error('Error fetching gamification profile:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch gamification data' 
    });
  }
});

// Get user's activity log
router.get('/activity', protect, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const activities = await getUserActivity(req.user._id, limit);
    
    res.json({
      success: true,
      data: activities
    });
  } catch (error) {
    console.error('Error fetching activity log:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch activity log' 
    });
  }
});

// Get leaderboard
router.get('/leaderboard', protect, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const category = req.query.category || 'overall';
    
    const leaderboard = await getLeaderboard({ limit, category });
    
    // Find user's position
    const userGamification = await getUserGamification(req.user._id);
    const userRank = await UserGamification.countDocuments({
      totalPoints: { $gt: userGamification.totalPoints }
    }) + 1;
    
    res.json({
      success: true,
      data: {
        leaderboard,
        userRank,
        userPoints: userGamification.totalPoints
      }
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch leaderboard' 
    });
  }
});

// Get all badges
router.get('/badges', protect, async (req, res) => {
  try {
    const allBadges = await Badge.find({ isActive: true }).sort({ rarity: 1, points: 1 });
    const userGamification = await getUserGamification(req.user._id);
    
    const badgesWithStatus = allBadges.map(badge => {
      const earned = userGamification.badges.some(
        b => b.badgeId?.toString() === badge._id.toString()
      );
      
      return {
        ...badge.toObject(),
        earned,
        earnedAt: earned 
          ? userGamification.badges.find(
              b => b.badgeId?.toString() === badge._id.toString()
            )?.earnedAt 
          : null
      };
    });
    
    res.json({
      success: true,
      data: badgesWithStatus
    });
  } catch (error) {
    console.error('Error fetching badges:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch badges' 
    });
  }
});

// Track video watched
router.post('/track/video', protect, async (req, res) => {
  try {
    const { courseId, moduleId, videoId, title, duration, completed } = req.body;
    
    const result = await trackVideoWatched(req.user._id, {
      courseId,
      moduleId,
      videoId,
      title,
      duration,
      completed
    });
    
    res.json({
      success: true,
      message: 'Video tracked successfully',
      data: result
    });
  } catch (error) {
    console.error('Error tracking video:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to track video' 
    });
  }
});

// Track quiz completion
router.post('/track/quiz', protect, async (req, res) => {
  try {
    const { courseId, quizId, score, passingScore, firstAttempt } = req.body;
    
    const result = await trackQuizCompleted(req.user._id, {
      courseId,
      quizId,
      score,
      passingScore,
      firstAttempt
    });
    
    res.json({
      success: true,
      message: 'Quiz tracked successfully',
      data: result
    });
  } catch (error) {
    console.error('Error tracking quiz:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to track quiz' 
    });
  }
});

// Track assignment submission
router.post('/track/assignment', protect, async (req, res) => {
  try {
    const { courseId, assignmentId, title, onTime, completed } = req.body;
    
    const result = await trackAssignmentSubmitted(req.user._id, {
      courseId,
      assignmentId,
      title,
      onTime,
      completed
    });
    
    res.json({
      success: true,
      message: 'Assignment tracked successfully',
      data: result
    });
  } catch (error) {
    console.error('Error tracking assignment:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to track assignment' 
    });
  }
});

// Track course progress
router.post('/track/course', protect, async (req, res) => {
  try {
    const { courseId, title, started, completed } = req.body;
    
    const result = await trackCourseProgress(req.user._id, {
      courseId,
      title,
      started,
      completed
    });
    
    res.json({
      success: true,
      message: 'Course progress tracked successfully',
      data: result
    });
  } catch (error) {
    console.error('Error tracking course:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to track course progress' 
    });
  }
});

// Track daily login
router.post('/track/login', protect, async (req, res) => {
  try {
    const result = await trackDailyLogin(req.user._id);
    
    res.json({
      success: true,
      message: 'Daily login tracked successfully',
      data: result
    });
  } catch (error) {
    console.error('Error tracking login:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to track login' 
    });
  }
});

// Get points configuration
router.get('/config', protect, async (req, res) => {
  try {
    res.json({
      success: true,
      data: POINTS_CONFIG
    });
  } catch (error) {
    console.error('Error fetching config:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch configuration' 
    });
  }
});

// Admin: Create badge
router.post('/admin/badges', protect, async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user.isAdmin) {
      return res.status(403).json({ 
        success: false, 
        message: 'Admin access required' 
      });
    }
    
    const badge = new Badge(req.body);
    await badge.save();
    
    res.json({
      success: true,
      message: 'Badge created successfully',
      data: badge
    });
  } catch (error) {
    console.error('Error creating badge:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create badge' 
    });
  }
});

// Admin: Get all users gamification stats
router.get('/admin/stats', protect, async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user.isAdmin) {
      return res.status(403).json({ 
        success: false, 
        message: 'Admin access required' 
      });
    }
    
    const totalUsers = await UserGamification.countDocuments();
    const avgPoints = await UserGamification.aggregate([
      { $group: { _id: null, avgPoints: { $avg: '$totalPoints' } } }
    ]);
    const totalActivities = await ActivityLog.countDocuments();
    const totalBadges = await Badge.countDocuments();
    
    res.json({
      success: true,
      data: {
        totalUsers,
        averagePoints: avgPoints[0]?.avgPoints || 0,
        totalActivities,
        totalBadges
      }
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch statistics' 
    });
  }
});

module.exports = router;
