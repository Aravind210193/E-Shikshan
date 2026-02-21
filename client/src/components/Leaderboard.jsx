import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gamificationAPI } from '../services/api';
import { Trophy, Medal, Crown, Star, Flame, Award, Zap } from 'lucide-react';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [userPoints, setUserPoints] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await gamificationAPI.getLeaderboard();
      setLeaderboard(response.data.data.leaderboard);
      setUserRank(response.data.data.userRank);
      setUserPoints(response.data.data.userPoints);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <Crown className="w-8 h-8 text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]" />;
      case 2: return <Medal className="w-7 h-7 text-gray-400 drop-shadow-[0_0_10px_rgba(156,163,175,0.5)]" />;
      case 3: return <Medal className="w-6 h-6 text-amber-600 drop-shadow-[0_0_10px_rgba(180,83,9,0.5)]" />;
      default: return <span className="text-gray-500 font-black">#{rank}</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  const topThree = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  return (
    <div className="space-y-12">
      {/* User Personal Rank Section */}
      {userRank && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-3xl p-1 shadow-2xl shadow-indigo-500/20"
        >
          <div className="bg-[#0f111a] rounded-[22px] p-6 flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                <Trophy size={28} />
              </div>
              <div>
                <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest">Your Current Rank</h3>
                <p className="text-3xl font-black text-white">Position #{userRank}</p>
              </div>
            </div>
            <div className="flex items-center gap-12">
              <div className="text-right">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Total XP</p>
                <p className="text-2xl font-black text-amber-500">{userPoints}</p>
              </div>
              <div className="h-10 w-[1px] bg-white/10" />
              <div className="text-right">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Global Status</p>
                <p className="text-sm font-black text-indigo-400">ELITE LEARNER</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Podium Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 items-end gap-6 max-w-5xl mx-auto pt-10">
        {/* 2nd Place */}
        {topThree[1] && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="order-2 md:order-1 flex flex-col items-center"
          >
            <div className="relative group mb-6">
              <div className="w-24 h-24 rounded-3xl bg-[#1a1c2e] border-2 border-gray-400/30 flex items-center justify-center overflow-hidden">
                {topThree[1].userId.profilePicture ?
                  <img src={topThree[1].userId.profilePicture} className="w-full h-full object-cover" /> :
                  <span className="text-2xl font-black text-gray-400">{topThree[1].userId.name.charAt(0)}</span>
                }
              </div>
              <div className="absolute -bottom-3 -right-3 bg-[#1a1c2e] border border-gray-400/30 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg">
                {getRankIcon(2)}
              </div>
            </div>
            <div className="text-center">
              <h4 className="font-black text-white text-lg line-clamp-1">{topThree[1].userId.name}</h4>
              <p className="text-amber-500 font-bold text-sm">{topThree[1].totalPoints} XP</p>
              <div className="mt-4 w-32 h-24 bg-gradient-to-t from-gray-400/10 to-transparent border-t-2 border-gray-400/20 rounded-t-3xl flex items-center justify-center">
                <span className="text- gray-400 font-black text-3xl opacity-20">2nd</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* 1st Place */}
        {topThree[0] && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="order-1 md:order-2 flex flex-col items-center z-10"
          >
            <div className="relative group mb-8">
              <div className="absolute -inset-4 bg-yellow-500/20 blur-2xl rounded-full animate-pulse" />
              <div className="w-32 h-32 rounded-[2rem] bg-[#1a1c2e] border-4 border-yellow-500/50 flex items-center justify-center overflow-hidden relative">
                {topThree[0].userId.profilePicture ?
                  <img src={topThree[0].userId.profilePicture} className="w-full h-full object-cover" /> :
                  <span className="text-4xl font-black text-yellow-500">{topThree[0].userId.name.charAt(0)}</span>
                }
              </div>
              <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                <Crown size={40} className="text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.8)]" />
              </div>
              <div className="absolute -bottom-3 -right-3 bg-[#1a1c2e] border border-yellow-500/50 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-yellow-500 font-black text-xl">1</span>
              </div>
            </div>
            <div className="text-center">
              <h4 className="font-black text-white text-2xl mb-1">{topThree[0].userId.name}</h4>
              <div className="flex items-center justify-center gap-2 mb-6">
                <Star size={14} className="text-yellow-500" fill="currentColor" />
                <span className="text-yellow-500 font-black text-lg">{topThree[0].totalPoints} XP</span>
              </div>
              <div className="w-40 h-32 bg-gradient-to-t from-yellow-500/10 to-transparent border-t-4 border-yellow-500/30 rounded-t-[2.5rem] flex items-center justify-center">
                <span className="text-yellow-500 font-black text-4xl opacity-20">1st</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* 3rd Place */}
        {topThree[2] && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="order-3 flex flex-col items-center"
          >
            <div className="relative group mb-6">
              <div className="w-20 h-20 rounded-3xl bg-[#1a1c2e] border-2 border-amber-800/30 flex items-center justify-center overflow-hidden">
                {topThree[2].userId.profilePicture ?
                  <img src={topThree[2].userId.profilePicture} className="w-full h-full object-cover" /> :
                  <span className="text-xl font-black text-amber-800">{topThree[2].userId.name.charAt(0)}</span>
                }
              </div>
              <div className="absolute -bottom-2 -right-2 bg-[#1a1c2e] border border-amber-800/30 w-8 h-8 rounded-lg flex items-center justify-center shadow-lg">
                {getRankIcon(3)}
              </div>
            </div>
            <div className="text-center">
              <h4 className="font-black text-white text-md line-clamp-1">{topThree[2].userId.name}</h4>
              <p className="text-amber-500 font-bold text-xs">{topThree[2].totalPoints} XP</p>
              <div className="mt-4 w-28 h-20 bg-gradient-to-t from-amber-800/10 to-transparent border-t-2 border-amber-800/20 rounded-t-2xl flex items-center justify-center">
                <span className="text-amber-800 font-black text-2xl opacity-20">3rd</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* List View for Rank 4+ */}
      <div className="bg-[#1a1c2e] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/5">
                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">Rank</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">Learner</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest text-center">Level</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Activity</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {rest.map((entry, i) => (
                <motion.tr
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  key={entry.userId._id}
                  className="hover:bg-white/[0.02] transition-colors group"
                >
                  <td className="px-8 py-5">
                    <span className="font-black text-gray-500 text-sm group-hover:text-indigo-400 transition-colors">#{entry.rank}</span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center overflow-hidden">
                        {entry.userId.profilePicture ?
                          <img src={entry.userId.profilePicture} className="w-full h-full object-cover" /> :
                          <span className="font-bold text-gray-400">{entry.userId.name.charAt(0)}</span>
                        }
                      </div>
                      <div>
                        <p className="font-bold text-white text-sm">{entry.userId.name}</p>
                        <p className="text-[10px] text-gray-600 font-bold">{entry.userId.university || 'E-Shikshan Scholar'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-lg text-[10px] font-black uppercase tracking-widest border border-indigo-500/10">
                      Lvl {entry.level}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-3 text-gray-500 font-bold text-xs uppercase tracking-tighter">
                      <span className="flex items-center gap-1"><Flame size={12} className="text-orange-500" /> {entry.currentStreak}d</span>
                      <span className="flex items-center gap-1"><Award size={12} className="text-emerald-500" /> {entry.badges || 0}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-sm font-black text-white">{entry.totalPoints}</span>
                      <Zap size={14} className="text-amber-500" fill="currentColor" />
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {leaderboard.length === 0 && (
          <div className="text-center py-20">
            <Trophy size={40} className="mx-auto text-gray-700 opacity-20 mb-4" />
            <p className="text-gray-500 font-black uppercase tracking-widest text-[10px]">The arena is currently empty</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
