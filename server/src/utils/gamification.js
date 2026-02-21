const { UserGamification, Badge, ActivityLog } = require('../models/Gamification');

// Points configuration
const POINTS_CONFIG = {
  VIDEO_WATCHED: 20,
  VIDEO_COMPLETED: 20,
  QUIZ_ATTEMPTED: 20,
  QUIZ_PASSED: 30,
  QUIZ_PERFECT: 50,
  ASSIGNMENT_SUBMITTED: 10,
  ASSIGNMENT_COMPLETED: 20,
  COURSE_STARTED: 50,
  COURSE_COMPLETED: 200,
  DAILY_LOGIN: 5,
  STREAK_BONUS: 10, // per day
  BADGE_EARNED: 100,
  CERTIFICATE_EARNED: 150,
  FIRST_TRY_SUCCESS: 25,
  DOUBT_RESOLVED: 20,
  SUBMISSION_GRADED: 50,
  PROJECT_SUBMITTED: 30,
  HACKATHON_JOINED: 25,
  HACKATHON_SELECTED: 100,
  HACKATHON_ROUND_CLEARED: 50,
  HACKATHON_WINNER: 500
};

// Level calculation
const calculateLevel = (totalPoints) => {
  // Level formula: level = floor(sqrt(totalPoints / 100)) + 1
  const level = Math.floor(Math.sqrt(totalPoints / 100)) + 1;
  const currentLevelBase = Math.pow(level - 1, 2) * 100;
  const nextLevelBase = Math.pow(level, 2) * 100;
  const levelPoints = totalPoints - currentLevelBase;
  const nextLevelPoints = nextLevelBase - currentLevelBase;

  return {
    level,
    levelPoints,
    nextLevelPoints
  };
};

// Award points to user
const awardPoints = async (userId, pointsToAdd, activityType, metadata = {}) => {
  try {
    let gamification = await UserGamification.findOne({ userId });

    if (!gamification) {
      gamification = new UserGamification({ userId });
    }

    // Add points
    const oldLevel = gamification.level;
    gamification.totalPoints += pointsToAdd;

    // Update points breakdown
    const breakdownKey = {
      'video_watched': 'videosWatched',
      'video_completed': 'videosWatched',
      'quiz_completed': 'quizzesCompleted',
      'quiz_passed': 'quizzesCompleted',
      'quiz_perfect': 'quizzesCompleted',
      'assignment_submitted': 'assignmentsSubmitted',
      'assignment_completed': 'assignmentsSubmitted',
      'course_completed': 'coursesCompleted',
      'login': 'loginStreak',
      'badge_earned': 'badges'
    }[activityType];

    if (breakdownKey && gamification.pointsBreakdown[breakdownKey] !== undefined) {
      gamification.pointsBreakdown[breakdownKey] += pointsToAdd;
    }

    // Recalculate level
    const levelData = calculateLevel(gamification.totalPoints);
    gamification.level = levelData.level;
    gamification.levelPoints = levelData.levelPoints;
    gamification.nextLevelPoints = levelData.nextLevelPoints;

    // Check for level up
    const leveledUp = gamification.level > oldLevel;

    // Update last activity
    gamification.lastActivityDate = new Date();
    gamification.updatedAt = new Date();

    await gamification.save();

    // Also update points in Enrollment if courseId is present
    if (metadata.courseId) {
      try {
        const Enrollment = require('../models/Enrollment');
        await Enrollment.findOneAndUpdate(
          { userId, courseId: metadata.courseId },
          { $inc: { 'progress.points': pointsToAdd } }
        );
      } catch (enrollErr) {
        console.error('Error updating enrollment points:', enrollErr);
      }
    }

    // Log activity
    await ActivityLog.create({
      userId,
      activityType,
      pointsEarned: pointsToAdd,
      description: metadata.description || `Earned ${pointsToAdd} points`,
      metadata
    });

    // Check if level up occurred
    if (leveledUp) {
      await ActivityLog.create({
        userId,
        activityType: 'level_up',
        pointsEarned: 0,
        description: `Leveled up to Level ${gamification.level}!`,
        metadata: { level: gamification.level }
      });
    }

    return { gamification, leveledUp, pointsAwarded: pointsToAdd };
  } catch (error) {
    console.error('Error awarding points:', error);
    throw error;
  }
};

// Update streak
const updateStreak = async (userId) => {
  try {
    let gamification = await UserGamification.findOne({ userId });

    if (!gamification) {
      gamification = new UserGamification({ userId });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastActivity = gamification.lastActivityDate
      ? new Date(gamification.lastActivityDate)
      : null;

    if (lastActivity) {
      lastActivity.setHours(0, 0, 0, 0);
      const daysDiff = Math.floor((today - lastActivity) / (1000 * 60 * 60 * 24));

      if (daysDiff === 0) {
        // Same day, no change
        return { streakMaintained: true, currentStreak: gamification.currentStreak };
      } else if (daysDiff === 1) {
        // Consecutive day
        gamification.currentStreak += 1;
        gamification.streakHistory.push({ date: today, maintained: true });

        // Award streak bonus
        const streakBonus = POINTS_CONFIG.STREAK_BONUS * gamification.currentStreak;
        await awardPoints(userId, streakBonus, 'streak_maintained', {
          description: `${gamification.currentStreak}-day streak maintained!`
        });

        // Update longest streak
        if (gamification.currentStreak > gamification.longestStreak) {
          gamification.longestStreak = gamification.currentStreak;
        }
      } else {
        // Streak broken
        gamification.streakHistory.push({ date: today, maintained: false });
        gamification.currentStreak = 1;
      }
    } else {
      // First activity
      gamification.currentStreak = 1;
      gamification.longestStreak = 1;
      gamification.streakHistory.push({ date: today, maintained: true });
    }

    gamification.lastActivityDate = new Date();
    await gamification.save();

    return {
      streakMaintained: true,
      currentStreak: gamification.currentStreak,
      longestStreak: gamification.longestStreak
    };
  } catch (error) {
    console.error('Error updating streak:', error);
    throw error;
  }
};

// Track video completion
const trackVideoWatched = async (userId, videoData) => {
  try {
    const gamification = await UserGamification.findOne({ userId });

    if (gamification) {
      gamification.achievements.videosWatched += 1;
      gamification.achievements.totalWatchTime += videoData.duration || 0;
      await gamification.save();
    }

    const points = videoData.completed
      ? POINTS_CONFIG.VIDEO_COMPLETED
      : POINTS_CONFIG.VIDEO_WATCHED;

    await awardPoints(userId, points, 'video_watched', {
      courseId: videoData.courseId,
      moduleId: videoData.moduleId,
      duration: videoData.duration,
      description: `Watched video: ${videoData.title}`
    });

    await updateStreak(userId);
    await checkAndAwardBadges(userId);

    return { success: true, pointsEarned: points };
  } catch (error) {
    console.error('Error tracking video:', error);
    throw error;
  }
};

// Track quiz completion
const trackQuizCompleted = async (userId, quizData) => {
  try {
    const gamification = await UserGamification.findOne({ userId });
    const score = quizData.score || 0;
    const passed = score >= (quizData.passingScore || 60);
    const perfect = score === 100;

    if (gamification) {
      gamification.achievements.quizzesCompleted += 1;
      if (passed) gamification.achievements.quizzesPassed += 1;
      if (perfect) gamification.achievements.perfectQuizzes += 1;
      if (quizData.firstAttempt && passed) {
        gamification.achievements.firstTrySuccess += 1;
      }

      // Recalculate average score
      const totalQuizzes = gamification.achievements.quizzesCompleted;
      const oldAvg = gamification.achievements.averageQuizScore || 0;
      gamification.achievements.averageQuizScore =
        ((oldAvg * (totalQuizzes - 1)) + score) / totalQuizzes;

      await gamification.save();
    }

    let points = POINTS_CONFIG.QUIZ_ATTEMPTED;
    if (perfect) {
      points = POINTS_CONFIG.QUIZ_PERFECT;
    } else if (passed) {
      points = POINTS_CONFIG.QUIZ_PASSED;
    }

    if (quizData.firstAttempt && passed) {
      points += POINTS_CONFIG.FIRST_TRY_SUCCESS;
    }

    await awardPoints(userId, points, perfect ? 'quiz_perfect' : (passed ? 'quiz_passed' : 'quiz_completed'), {
      courseId: quizData.courseId,
      quizId: quizData.quizId,
      score: score,
      description: `Completed quiz with ${score}% score`
    });

    await updateStreak(userId);
    await checkAndAwardBadges(userId);

    return { success: true, pointsEarned: points, passed, perfect };
  } catch (error) {
    console.error('Error tracking quiz:', error);
    throw error;
  }
};

// Track assignment submission
const trackAssignmentSubmitted = async (userId, assignmentData) => {
  try {
    const gamification = await UserGamification.findOne({ userId });

    if (gamification) {
      gamification.achievements.assignmentsSubmitted += 1;
      if (assignmentData.onTime) {
        gamification.achievements.assignmentsOnTime += 1;
      }
      await gamification.save();
    }

    const points = assignmentData.completed
      ? POINTS_CONFIG.ASSIGNMENT_COMPLETED
      : POINTS_CONFIG.ASSIGNMENT_SUBMITTED;

    await awardPoints(userId, points, 'assignment_submitted', {
      courseId: assignmentData.courseId,
      description: `Submitted assignment: ${assignmentData.title}`
    });

    await updateStreak(userId);
    await checkAndAwardBadges(userId);

    return { success: true, pointsEarned: points };
  } catch (error) {
    console.error('Error tracking assignment:', error);
    throw error;
  }
};

// Track project submission
const trackProjectSubmitted = async (userId, projectData) => {
  try {
    const gamification = await UserGamification.findOne({ userId });

    await awardPoints(userId, POINTS_CONFIG.PROJECT_SUBMITTED, 'project_submitted', {
      courseId: projectData.courseId,
      roadmapId: projectData.roadmapId,
      description: `Submitted project: ${projectData.title}`
    });

    await updateStreak(userId);
    await checkAndAwardBadges(userId);

    return { success: true, pointsEarned: POINTS_CONFIG.PROJECT_SUBMITTED };
  } catch (error) {
    console.error('Error tracking project submission:', error);
    throw error;
  }
};

// Track course progress
const trackCourseProgress = async (userId, courseData) => {
  try {
    const gamification = await UserGamification.findOne({ userId });

    if (courseData.started && gamification) {
      gamification.achievements.coursesStarted += 1;
      await gamification.save();

      await awardPoints(userId, POINTS_CONFIG.COURSE_STARTED, 'course_started', {
        courseId: courseData.courseId,
        description: `Started course: ${courseData.title}`
      });
    }

    if (courseData.completed && gamification) {
      gamification.achievements.coursesCompleted += 1;
      await gamification.save();

      await awardPoints(userId, POINTS_CONFIG.COURSE_COMPLETED, 'course_completed', {
        courseId: courseData.courseId,
        description: `Completed course: ${courseData.title}`
      });
    }

    await updateStreak(userId);
    await checkAndAwardBadges(userId);

    return { success: true };
  } catch (error) {
    console.error('Error tracking course:', error);
    throw error;
  }
};

// Track hackathon activity
const trackHackathonActivity = async (userId, activity, hackathonData = {}) => {
  try {
    const gamification = await UserGamification.findOne({ userId });

    let points = 0;
    let activityType = '';
    let description = '';

    switch (activity) {
      case 'joined':
        points = POINTS_CONFIG.HACKATHON_JOINED;
        activityType = 'hackathon_joined';
        description = `Joined hackathon: ${hackathonData.title}`;
        if (gamification) gamification.achievements.hackathonsJoined += 1;
        break;
      case 'selected':
        points = POINTS_CONFIG.HACKATHON_SELECTED;
        activityType = 'hackathon_selected';
        description = `Selected for hackathon: ${hackathonData.title}`;
        if (gamification) gamification.achievements.hackathonsSelected += 1;
        break;
      case 'round_cleared':
        points = POINTS_CONFIG.HACKATHON_ROUND_CLEARED;
        activityType = 'hackathon_round_cleared';
        description = `Cleared round in: ${hackathonData.title}`;
        if (gamification) gamification.achievements.hackathonRoundsCleared += 1;
        break;
      case 'winner':
        points = POINTS_CONFIG.HACKATHON_WINNER;
        activityType = 'hackathon_winner';
        description = `Won/Podium in hackathon: ${hackathonData.title}`;
        if (gamification) gamification.achievements.hackathonPodiums += 1;
        break;
    }

    if (gamification) await gamification.save();

    await awardPoints(userId, points, activityType, {
      hackathonId: hackathonData.hackathonId,
      description
    });

    await updateStreak(userId);
    await checkAndAwardBadges(userId);

    return { success: true, pointsEarned: points };
  } catch (error) {
    console.error('Error tracking hackathon activity:', error);
    throw error;
  }
};

// Check and award badges
const checkAndAwardBadges = async (userId) => {
  try {
    const gamification = await UserGamification.findOne({ userId }).populate('badges.badgeId');
    if (!gamification) return;

    const allBadges = await Badge.find({ isActive: true });
    const earnedBadgeIds = gamification.badges.map(b => b.badgeId?._id?.toString());

    for (const badge of allBadges) {
      if (earnedBadgeIds.includes(badge._id.toString())) continue;

      let shouldAward = false;

      switch (badge.criteria.criteriaType) {
        case 'points':
          shouldAward = gamification.totalPoints >= badge.criteria.value;
          break;
        case 'streak':
          shouldAward = gamification.currentStreak >= badge.criteria.value;
          break;
        case 'courses':
          shouldAward = gamification.achievements.coursesCompleted >= badge.criteria.value;
          break;
        case 'quizzes':
          shouldAward = gamification.achievements.quizzesCompleted >= badge.criteria.value;
          break;
        case 'videos':
          shouldAward = gamification.achievements.videosWatched >= badge.criteria.value;
          break;
        case 'assignments':
          shouldAward = gamification.achievements.assignmentsSubmitted >= badge.criteria.value;
          break;
        case 'hackathons':
          shouldAward = gamification.achievements.hackathonsJoined >= badge.criteria.value;
          break;
        case 'hackathon_round':
          shouldAward = gamification.achievements.hackathonRoundsCleared >= badge.criteria.value;
          break;
      }

      if (shouldAward) {
        gamification.badges.push({
          badgeId: badge._id,
          earnedAt: new Date()
        });

        await awardPoints(userId, badge.points || POINTS_CONFIG.BADGE_EARNED, 'badge_earned', {
          description: `Earned badge: ${badge.name}`
        });

        await ActivityLog.create({
          userId,
          activityType: 'badge_earned',
          pointsEarned: badge.points || POINTS_CONFIG.BADGE_EARNED,
          description: `Earned badge: ${badge.name}`,
          metadata: { badgeId: badge._id }
        });
      }
    }

    await gamification.save();
  } catch (error) {
    console.error('Error checking badges:', error);
  }
};

// Get user gamification data
const getUserGamification = async (userId) => {
  try {
    let gamification = await UserGamification.findOne({ userId })
      .populate('badges.badgeId');

    if (!gamification) {
      gamification = new UserGamification({ userId });
      await gamification.save();
    }

    return gamification;
  } catch (error) {
    console.error('Error getting gamification data:', error);
    throw error;
  }
};

// Get leaderboard
const getLeaderboard = async (filters = {}) => {
  try {
    const { limit = 100, category = 'overall' } = filters;

    const leaderboard = await UserGamification.find()
      .populate('userId', 'name email profilePicture university department')
      .sort({ totalPoints: -1 })
      .limit(limit)
      .lean();

    return leaderboard.map((entry, index) => ({
      rank: index + 1,
      userId: entry.userId,
      totalPoints: entry.totalPoints,
      level: entry.level,
      badges: entry.badges.length,
      currentStreak: entry.currentStreak
    }));
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    throw error;
  }
};

// Get user activity log
const getUserActivity = async (userId, limit = 50) => {
  try {
    const activities = await ActivityLog.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return activities;
  } catch (error) {
    console.error('Error getting user activity:', error);
    throw error;
  }
};

// Daily login reward
const trackDailyLogin = async (userId) => {
  try {
    const gamification = await UserGamification.findOne({ userId });

    if (gamification && gamification.lastActivityDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const lastActivity = new Date(gamification.lastActivityDate);
      lastActivity.setHours(0, 0, 0, 0);

      if (today.getTime() === lastActivity.getTime()) {
        // Already logged in today
        return { success: true, alreadyRewarded: true };
      }
    }

    await awardPoints(userId, POINTS_CONFIG.DAILY_LOGIN, 'login', {
      description: 'Daily login reward'
    });

    await updateStreak(userId);

    return { success: true, pointsEarned: POINTS_CONFIG.DAILY_LOGIN };
  } catch (error) {
    console.error('Error tracking daily login:', error);
    throw error;
  }
};

const trackSubmissionGraded = async (userId, submissionData) => {
  try {
    await awardPoints(userId, POINTS_CONFIG.SUBMISSION_GRADED, 'submission_graded', {
      courseId: submissionData.courseId,
      submissionId: submissionData.submissionId,
      description: `Submission graded: ${submissionData.title}`
    });
    return { success: true, pointsEarned: POINTS_CONFIG.SUBMISSION_GRADED };
  } catch (error) {
    console.error('Error tracking submission graded:', error);
    throw error;
  }
};

// Track doubt resolution
const trackDoubtResolved = async (userId, doubtData) => {
  try {
    await awardPoints(userId, POINTS_CONFIG.DOUBT_RESOLVED, 'doubt_resolved', {
      courseId: doubtData.courseId,
      doubtId: doubtData.doubtId,
      description: `Doubt resolved: ${doubtData.question.substring(0, 30)}...`
    });
    return { success: true, pointsEarned: POINTS_CONFIG.DOUBT_RESOLVED };
  } catch (error) {
    console.error('Error tracking doubt resolution:', error);
    throw error;
  }
};

module.exports = {
  POINTS_CONFIG,
  calculateLevel,
  awardPoints,
  updateStreak,
  trackVideoWatched,
  trackQuizCompleted,
  trackAssignmentSubmitted,
  trackProjectSubmitted,
  trackCourseProgress,
  trackHackathonActivity,
  checkAndAwardBadges,
  getUserGamification,
  getLeaderboard,
  getUserActivity,
  trackDailyLogin,
  trackSubmissionGraded,
  trackDoubtResolved
};
