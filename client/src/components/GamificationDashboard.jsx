import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gamificationAPI } from '../services/api';
import { Trophy, Star, Flame, Award, TrendingUp, Clock, Target, Zap, ChevronRight } from 'lucide-react';

const GamificationDashboard = () => {
  const [gamificationData, setGamificationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchGamificationData();
  }, []);

  const fetchGamificationData = async () => {
    try {
      const response = await gamificationAPI.getProfile();
      setGamificationData(response.data.data);
    } catch (error) {
      console.error('Error fetching gamification data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
          <div className="absolute inset-0 bg-indigo-500/20 blur-xl animate-pulse rounded-full" />
        </div>
      </div>
    );
  }

  if (!gamificationData) {
    return (
      <div className="text-center py-20 bg-[#1a1c2e] border border-white/5 rounded-3xl">
        <Trophy size={48} className="mx-auto text-gray-700 mb-4 opacity-20" />
        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No gamification data available</p>
      </div>
    );
  }

  const progressPercentage = (gamificationData.levelPoints / (gamificationData.nextLevelPoints || 1)) * 100;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Main Stats Row */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {/* Level Card - Premium Gradient */}
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-gradient-to-br from-[#1a1c2e] to-[#0f111a] border border-white/10 rounded-3xl p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[80px] -mr-32 -mt-32 group-hover:bg-indigo-600/20 transition-all duration-700" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400 border border-indigo-500/30">
                  <Trophy size={32} />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-white tracking-tighter">Level {gamificationData.level}</h3>
                  <p className="text-indigo-400 text-[10px] uppercase font-black tracking-[0.2em]">Rank: Novice Apprentice</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-white">{Math.floor(progressPercentage)}%</span>
                <p className="text-gray-500 text-[10px] uppercase font-black">To Next Level</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{gamificationData.levelPoints} XP Earned</span>
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{gamificationData.nextLevelPoints} XP Required</span>
              </div>
              <div className="h-4 bg-white/5 rounded-full p-1 border border-white/5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Total Points */}
        <motion.div variants={itemVariants} className="bg-[#1a1c2e] border border-white/5 rounded-3xl p-8 flex flex-col justify-between hover:border-amber-500/30 transition-all">
          <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 mb-6">
            <Star size={24} fill="currentColor" />
          </div>
          <div>
            <h4 className="text-4xl font-black text-white tracking-tight mb-1">{gamificationData.totalPoints}</h4>
            <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest">Lifetime XP</p>
          </div>
        </motion.div>

        {/* Day Streak */}
        <motion.div variants={itemVariants} className="bg-[#1a1c2e] border border-white/5 rounded-3xl p-8 flex flex-col justify-between hover:border-orange-500/30 transition-all">
          <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-500 mb-6 font-black text-xl">
            <Flame size={24} fill="currentColor" />
          </div>
          <div>
            <div className="flex items-end gap-2 mb-1">
              <h4 className="text-4xl font-black text-white tracking-tight">{gamificationData.currentStreak}</h4>
              <span className="text-orange-500 text-xs font-black mb-1">DAYS</span>
            </div>
            <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest">Active Streak</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 p-1 bg-white/5 border border-white/5 rounded-2xl w-fit">
        {['overview', 'achievements', 'daily'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                : 'text-gray-500 hover:text-gray-300'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Points Source Breakdown */}
              <div className="bg-[#1a1c2e] border border-white/5 rounded-3xl p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400">
                    <TrendingUp size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-white">XP Sources</h3>
                </div>
                <div className="space-y-6">
                  {Object.entries(gamificationData.pointsBreakdown).map(([key, value]) => (
                    <div key={key} className="group">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <span className="text-xs font-black text-white">+{value} XP</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min((value / (gamificationData.totalPoints || 1)) * 300, 100)}%` }}
                          className="h-full bg-indigo-500/40 group-hover:bg-indigo-500 transition-colors"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Trophies */}
              <div className="bg-[#1a1c2e] border border-white/5 rounded-3xl p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400">
                    <Award size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-white">Recent Trophies</h3>
                </div>
                <div className="space-y-4">
                  {gamificationData.badges.slice(-4).reverse().map((badge, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="text-3xl filter drop-shadow-[0_0_8px_rgba(255,255,255,0.2)] group-hover:scale-110 transition-transform">
                          {badge.badgeId?.icon || '🏆'}
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">{badge.badgeId?.name || 'Badge'}</p>
                          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                            Unlocked {new Date(badge.earnedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${badge.badgeId?.rarity === 'legendary' ? 'bg-red-500/10 text-red-400' :
                          badge.badgeId?.rarity === 'epic' ? 'bg-amber-500/10 text-amber-400' :
                            'bg-indigo-500/10 text-indigo-400'
                        }`}>
                        {badge.badgeId?.rarity || 'Common'}
                      </div>
                    </div>
                  ))}
                  {gamificationData.badges.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-600 font-bold uppercase tracking-widest text-[10px]">Your trophy case is empty</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="bg-[#1a1c2e] border border-white/5 rounded-3xl p-8">
              <h3 className="text-xl font-bold text-white mb-8">Detailed Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {Object.entries(gamificationData.achievements).map(([key, value]) => (
                  <div key={key} className="p-6 bg-white/5 border border-white/5 rounded-2xl text-center group hover:border-indigo-500/30 transition-all">
                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-3 line-clamp-1">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                    <p className="text-3xl font-black text-white group-hover:text-indigo-400 transition-colors">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'daily' && (
            <div className="bg-[#1a1c2e] border border-white/5 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-10">
                <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500">
                  <Target size={20} />
                </div>
                <h3 className="text-xl font-bold text-white">Daily Focus</h3>
              </div>

              <div className="max-w-2xl mx-auto text-center mb-12">
                <div className="mb-4 flex justify-between items-end px-2">
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Today's XP Goal</span>
                  <span className="text-xs font-black text-white">{gamificationData.dailyProgress} / {gamificationData.dailyGoal} XP</span>
                </div>
                <div className="h-6 bg-white/5 rounded-full p-1.5 border border-white/5 relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((gamificationData.dailyProgress / (gamificationData.dailyGoal || 1)) * 100, 100)}%` }}
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-600 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.3)]"
                  />
                </div>
                <p className="mt-4 text-xs text-gray-500 font-bold uppercase tracking-widest">
                  {gamificationData.dailyProgress >= gamificationData.dailyGoal ? "Goal Smashed! 🚀" : "Keep pushing to hit your daily goal!"}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { icon: Clock, label: 'Last Activity', value: gamificationData.lastActivityDate ? new Date(gamificationData.lastActivityDate).toLocaleTimeString() : 'N/A', color: 'text-blue-400' },
                  { icon: Flame, label: 'Current Streak', value: `${gamificationData.currentStreak} Days`, color: 'text-orange-400' },
                  { icon: Trophy, label: 'Best Streak', value: `${gamificationData.longestStreak} Days`, color: 'text-emerald-400' }
                ].map((stat, i) => (
                  <div key={i} className="flex items-center gap-4 p-6 bg-white/5 border border-white/5 rounded-2xl">
                    <div className={`w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center ${stat.color}`}>
                      <stat.icon size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{stat.label}</p>
                      <p className="text-lg font-bold text-white">{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default GamificationDashboard;

