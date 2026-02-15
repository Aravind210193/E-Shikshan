import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trophy, Medal, Crown, Star } from 'lucide-react';

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
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/gamification/leaderboard`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
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
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-700" />;
      default:
        return <span className="text-gray-600 font-bold">{rank}</span>;
    }
  };

  const getRankBadgeColor = (rank) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
      case 3:
        return 'bg-gradient-to-r from-amber-600 to-amber-800 text-white';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <Trophy className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Leaderboard</h1>
        <p className="text-gray-600">See how you rank against other learners</p>
      </div>

      {/* User's Rank Card */}
      {userRank && (
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 mb-1">Your Rank</p>
              <p className="text-4xl font-bold">#{userRank}</p>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-90 mb-1">Total Points</p>
              <p className="text-4xl font-bold">{userPoints}</p>
            </div>
          </div>
        </div>
      )}

      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {leaderboard.slice(0, 3).map((entry, index) => (
          <div
            key={entry.userId._id}
            className={`text-center ${index === 0 ? 'order-2' : index === 1 ? 'order-1' : 'order-3'}`}
          >
            <div
              className={`${getRankBadgeColor(entry.rank)} rounded-xl shadow-lg p-6 mb-4 ${
                index === 0 ? 'transform -translate-y-4' : ''
              }`}
            >
              <div className="flex justify-center mb-3">{getRankIcon(entry.rank)}</div>
              <div className="w-16 h-16 rounded-full bg-white mx-auto mb-3 flex items-center justify-center overflow-hidden">
                {entry.userId.profilePicture ? (
                  <img
                    src={entry.userId.profilePicture}
                    alt={entry.userId.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-bold text-indigo-600">
                    {entry.userId.name.charAt(0)}
                  </span>
                )}
              </div>
              <p className="font-bold text-lg truncate mb-1">{entry.userId.name}</p>
              <p className="text-sm opacity-90">Level {entry.level}</p>
              <p className="text-2xl font-bold mt-2">{entry.totalPoints}</p>
              <p className="text-xs opacity-75">points</p>
            </div>
          </div>
        ))}
      </div>

      {/* Rest of Leaderboard */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Points
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Badges
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Streak
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leaderboard.slice(3).map((entry) => (
                <tr key={entry.userId._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-gray-900 font-semibold">#{entry.rank}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden mr-3">
                        {entry.userId.profilePicture ? (
                          <img
                            src={entry.userId.profilePicture}
                            alt={entry.userId.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-sm font-bold text-indigo-600">
                            {entry.userId.name.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{entry.userId.name}</p>
                        <p className="text-sm text-gray-500">{entry.userId.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                      Level {entry.level}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      <span className="text-gray-900 font-semibold">{entry.totalPoints}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-gray-900">{entry.badges}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-orange-500 mr-1">🔥</span>
                      <span className="text-gray-900">{entry.currentStreak}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {leaderboard.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No leaderboard data available yet</p>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
