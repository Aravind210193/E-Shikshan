import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Award, Lock, CheckCircle, Star } from 'lucide-react';

const BadgesGallery = () => {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchBadges();
  }, []);

  const fetchBadges = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/gamification/badges`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBadges(response.data.data);
    } catch (error) {
      console.error('Error fetching badges:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBadges = filter === 'all'
    ? badges
    : filter === 'earned'
    ? badges.filter(b => b.earned)
    : badges.filter(b => !b.earned);

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common':
        return 'border-gray-300 bg-gray-50';
      case 'rare':
        return 'border-blue-400 bg-blue-50';
      case 'epic':
        return 'border-purple-400 bg-purple-50';
      case 'legendary':
        return 'border-yellow-400 bg-yellow-50';
      default:
        return 'border-gray-300 bg-gray-50';
    }
  };

  const getRarityBadge = (rarity) => {
    const colors = {
      common: 'bg-gray-500',
      rare: 'bg-blue-500',
      epic: 'bg-purple-500',
      legendary: 'bg-yellow-500'
    };
    return (
      <span className={`px-2 py-1 text-xs font-semibold text-white rounded ${colors[rarity] || colors.common}`}>
        {rarity.toUpperCase()}
      </span>
    );
  };

  const earnedCount = badges.filter(b => b.earned).length;
  const totalCount = badges.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Badge Collection</h1>
        <p className="text-gray-600">
          Collect badges by completing challenges and milestones
        </p>
        <div className="mt-4 flex items-center space-x-4">
          <div className="flex items-center">
            <Award className="w-5 h-5 text-indigo-600 mr-2" />
            <span className="text-gray-900 font-semibold">
              {earnedCount} / {totalCount} Badges Earned
            </span>
          </div>
          <div className="flex-1">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-indigo-600 rounded-full h-2 transition-all duration-500"
                style={{ width: `${(earnedCount / totalCount) * 100}%` }}
              />
            </div>
          </div>
          <span className="text-gray-600 font-medium">
            {Math.round((earnedCount / totalCount) * 100)}%
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6">
        <div className="flex space-x-4">
          {['all', 'earned', 'locked'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === tab
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === 'earned' && ` (${earnedCount})`}
              {tab === 'locked' && ` (${totalCount - earnedCount})`}
            </button>
          ))}
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBadges.map((badge) => (
          <div
            key={badge._id}
            className={`relative border-2 rounded-xl p-6 transition-all duration-300 ${
              badge.earned
                ? `${getRarityColor(badge.rarity)} shadow-lg hover:shadow-xl transform hover:-translate-y-1`
                : 'border-gray-200 bg-gray-50 opacity-60'
            }`}
          >
            {/* Earned Indicator */}
            {badge.earned && (
              <div className="absolute top-3 right-3">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
            )}

            {/* Locked Indicator */}
            {!badge.earned && (
              <div className="absolute top-3 right-3">
                <Lock className="w-6 h-6 text-gray-400" />
              </div>
            )}

            {/* Badge Icon */}
            <div className="flex justify-center mb-4">
              <div
                className={`w-24 h-24 rounded-full flex items-center justify-center text-5xl ${
                  badge.earned ? 'bg-white shadow-md' : 'bg-gray-200'
                }`}
                style={{ backgroundColor: badge.earned ? badge.color + '20' : undefined }}
              >
                {badge.icon}
              </div>
            </div>

            {/* Badge Info */}
            <div className="text-center">
              <h3 className="font-bold text-lg text-gray-900 mb-2">{badge.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{badge.description}</p>

              {/* Rarity */}
              <div className="flex justify-center mb-3">
                {getRarityBadge(badge.rarity)}
              </div>

              {/* Points */}
              <div className="flex items-center justify-center space-x-1 mb-3">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-semibold text-gray-900">{badge.points} pts</span>
              </div>

              {/* Criteria */}
              <div className="bg-white rounded-lg p-2 text-xs text-gray-600">
                <p className="font-medium mb-1">Requirement:</p>
                <p>{badge.criteria.description || badge.criteria.value}</p>
              </div>

              {/* Earned Date */}
              {badge.earned && badge.earnedAt && (
                <div className="mt-3 text-xs text-gray-500">
                  Earned on {new Date(badge.earnedAt).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredBadges.length === 0 && (
        <div className="text-center py-12">
          <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">
            {filter === 'earned' 
              ? 'No badges earned yet. Start learning to collect badges!'
              : 'No locked badges to display'}
          </p>
        </div>
      )}
    </div>
  );
};

export default BadgesGallery;
