import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trophy, Star, Flame, Award, TrendingUp, Clock, Target, Zap } from 'lucide-react';

const GamificationDashboard = () => {
  const [gamificationData, setGamificationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchGamificationData();
  }, []);

  const fetchGamificationData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/gamification/profile`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGamificationData(response.data.data);
    } catch (error) {
      console.error('Error fetching gamification data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!gamificationData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No gamification data available</p>
      </div>
    );
  }

  const progressPercentage = (gamificationData.levelPoints / gamificationData.nextLevelPoints) * 100;

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8 px-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Your Learning Journey</h1>
        <p className="text-sm sm:text-base text-gray-600">Track your progress, earn badges, and level up!</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8 px-2">
        {/* Level Card */}
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg p-5 sm:p-6 text-white">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <Trophy className="w-7 h-7 sm:w-8 sm:h-8" />
            <span className="text-2xl sm:text-3xl font-bold">Level {gamificationData.level}</span>
          </div>
          <div className="mb-2">
            <div className="flex justify-between text-xs sm:text-sm mb-1">
              <span>{gamificationData.levelPoints} XP</span>
              <span>{gamificationData.nextLevelPoints} XP</span>
            </div>
            <div className="w-full bg-white/30 rounded-full h-2">
              <div
                className="bg-white rounded-full h-2 transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
          <p className="text-xs sm:text-sm opacity-90">Keep learning to level up!</p>
        </div>

        {/* Total Points */}
        <div className="bg-white rounded-xl shadow-lg p-5 sm:p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <Star className="w-7 h-7 sm:w-8 sm:h-8 text-yellow-500" />
            <span className="text-2xl sm:text-3xl font-bold text-gray-900">{gamificationData.totalPoints}</span>
          </div>
          <p className="text-sm sm:text-base text-gray-600 font-medium">Total Points</p>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Keep earning to unlock rewards</p>
        </div>

        {/* Current Streak */}
        <div className="bg-white rounded-xl shadow-lg p-5 sm:p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <Flame className="w-7 h-7 sm:w-8 sm:h-8 text-orange-500" />
            <span className="text-2xl sm:text-3xl font-bold text-gray-900">{gamificationData.currentStreak}</span>
          </div>
          <p className="text-sm sm:text-base text-gray-600 font-medium">Day Streak</p>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Best: {gamificationData.longestStreak} days
          </p>
        </div>

        {/* Badges */}
        <div className="bg-white rounded-xl shadow-lg p-5 sm:p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <Award className="w-7 h-7 sm:w-8 sm:h-8 text-green-500" />
            <span className="text-2xl sm:text-3xl font-bold text-gray-900">{gamificationData.badges.length}</span>
          </div>
          <p className="text-sm sm:text-base text-gray-600 font-medium">Badges Earned</p>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Collect them all!</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-4 sm:mb-6 px-2">
        <div className="border-b border-gray-200 overflow-x-auto">
          <nav className="-mb-px flex space-x-4 sm:space-x-8 min-w-max sm:min-w-0">
            {['overview', 'achievements', 'daily'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap touch-manipulation ${
                  activeTab === tab
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 active:text-gray-800'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 px-2">
          {/* Points Breakdown */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-indigo-600" />
              Points Breakdown
            </h3>
            <div className="space-y-2 sm:space-y-3">
              {Object.entries(gamificationData.pointsBreakdown).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center text-sm sm:text-base">
                  <span className="text-gray-600 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className="font-semibold text-gray-900">{value} pts</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Badges */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center">
              <Award className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-indigo-600" />
              Recent Badges
            </h3>
            <div className="space-y-2 sm:space-y-3">
              {gamificationData.badges.slice(-5).reverse().map((badge, index) => (
                <div key={index} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-100 rounded-full flex items-center justify-center text-xl sm:text-2xl flex-shrink-0">
                      {badge.badgeId?.icon || '🏆'}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{badge.badgeId?.name || 'Badge'}</p>
                      <p className="text-xs sm:text-sm text-gray-500">
                        {new Date(badge.earnedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {gamificationData.badges.length === 0 && (
                <p className="text-gray-500 text-center py-4 text-sm">No badges earned yet. Keep learning!</p>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'achievements' && (
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200 mx-2">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Your Achievements</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {Object.entries(gamificationData.achievements).map(([key, value]) => (
              <div key={key} className="p-3 sm:p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm text-gray-600 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />
                </div>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'daily' && (
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200 mx-2">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
            <Target className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-indigo-600" />
            Daily Goal
          </h3>
          <div className="mb-4 sm:mb-6">
            <div className="flex justify-between text-xs sm:text-sm mb-2">
              <span className="text-gray-600">Progress Today</span>
              <span className="font-medium text-gray-900">
                {gamificationData.dailyProgress} / {gamificationData.dailyGoal} points
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 sm:h-3">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full h-2.5 sm:h-3 transition-all duration-500"
                style={{
                  width: `${Math.min((gamificationData.dailyProgress / gamificationData.dailyGoal) * 100, 100)}%`
                }}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-4 sm:mt-6">
            <div className="p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mb-2" />
              <p className="text-xs sm:text-sm text-gray-600">Last Activity</p>
              <p className="font-semibold text-gray-900 text-xs sm:text-sm mt-1">
                {gamificationData.lastActivityDate
                  ? new Date(gamificationData.lastActivityDate).toLocaleString()
                  : 'No activity yet'}
              </p>
            </div>
            
            <div className="p-3 sm:p-4 bg-orange-50 rounded-lg border border-orange-200">
              <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600 mb-2" />
              <p className="text-xs sm:text-sm text-gray-600">Current Streak</p>
              <p className="font-semibold text-gray-900 text-sm sm:text-base mt-1">{gamificationData.currentStreak} days</p>
            </div>
            
            <div className="p-3 sm:p-4 bg-green-50 rounded-lg border border-green-200">
              <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 mb-2" />
              <p className="text-xs sm:text-sm text-gray-600">Longest Streak</p>
              <p className="font-semibold text-gray-900 text-sm sm:text-base mt-1">{gamificationData.longestStreak} days</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GamificationDashboard;
