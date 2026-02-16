import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    Layout,
    MessageSquare,
    BookOpen,
    Award,
    Settings,
    LogOut,
    User,
    Trophy,
    Home,
    Briefcase
} from 'lucide-react';

const StudentSidebar = () => {
    const menuItems = [
        { path: '/', icon: Home, label: 'Main Website' },
        { path: '/dashboard', icon: Layout, label: 'Overview', exact: true },

        { path: '/dashboard/doubts', icon: MessageSquare, label: 'Doubts' },
        { path: '/dashboard/job-applications', icon: Briefcase, label: 'Job Applications' },
        { path: '/dashboard/achievements', icon: Trophy, label: 'Achievements' },
        { path: '/profile', icon: User, label: 'Profile' },
        { path: '/settings', icon: Settings, label: 'Settings' },
    ];

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    return (
        <div className="w-64 bg-[#1a1c2e] border-r border-gray-800 flex flex-col h-screen sticky top-0">
            <div className="p-6">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl">
                        E
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-white leading-tight">Student</h1>
                        <p className="text-[10px] uppercase font-black text-indigo-400 tracking-wider">Portal</p>
                    </div>
                </div>

                <nav className="space-y-1">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.exact}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <item.icon size={20} className={isActive ? 'text-white' : 'text-gray-400 group-hover:text-indigo-400 transition-colors'} />
                                    <span className="font-bold text-sm">{item.label}</span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>
            </div>

            <div className="mt-auto p-6 border-t border-gray-800">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-500 transition-all duration-200"
                >
                    <LogOut size={20} />
                    <span className="font-bold text-sm">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default StudentSidebar;
