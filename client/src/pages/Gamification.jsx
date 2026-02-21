import React, { useState } from 'react';
import GamificationDashboard from '../components/GamificationDashboard';
import Leaderboard from '../components/Leaderboard';
import { Trophy, Users, BarChart3 } from 'lucide-react';

const Gamification = () => {
    const [activeView, setActiveView] = useState('stats');

    return (
        <div className="min-h-screen bg-[#0f111a] py-8 lg:py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header with View Toggle */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-indigo-600/20">
                            <Trophy size={32} />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-white tracking-tighter">Gamification Arena</h1>
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Your path to mastery through learning & competition</p>
                        </div>
                    </div>

                    <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5 w-fit">
                        <button
                            onClick={() => setActiveView('stats')}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeView === 'stats'
                                    ? 'bg-indigo-600 text-white shadow-lg'
                                    : 'text-gray-500 hover:text-gray-300'
                                }`}
                        >
                            <BarChart3 size={14} />
                            My Progress
                        </button>
                        <button
                            onClick={() => setActiveView('leaderboard')}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeView === 'leaderboard'
                                    ? 'bg-indigo-600 text-white shadow-lg'
                                    : 'text-gray-500 hover:text-gray-300'
                                }`}
                        >
                            <Users size={14} />
                            Global Leaderboard
                        </button>
                    </div>
                </div>

                {/* Dynamic Content Area */}
                <div className="relative">
                    {activeView === 'stats' ? (
                        <GamificationDashboard />
                    ) : (
                        <Leaderboard />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Gamification;

