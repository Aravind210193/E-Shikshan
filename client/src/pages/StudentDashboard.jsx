import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen,
    Zap,
    Award,
    Code,
    ChevronRight,
    Activity,
    Clock,
    Star,
    TrendingUp,
    FileText,
    Map,
    Briefcase,
    Layout,
    Trophy,
    Home,
    Bell
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { authAPI, enrollmentAPI, hackathonRegistrationAPI } from '../services/api';
import toast from 'react-hot-toast';

const StudentDashboard = () => {
    const [user, setUser] = useState(null);
    const [courses, setCourses] = useState([]);
    const [hackathons, setHackathons] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [gamification, setGamification] = useState(null);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDetail, setSelectedDetail] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const [profileRes, enrollmentsRes, hackathonsRes, jobsRes, notifyRes, gamiRes, activityRes] = await Promise.all([
                authAPI.getProfile(),
                enrollmentAPI.getMyCourses(),
                hackathonRegistrationAPI.getMyRegistrations(),
                axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/job-applications/my-applications`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/notifications`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/gamification/profile`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/gamification/activity`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);

            setUser(profileRes.data.user);
            setCourses(enrollmentsRes.data);
            setHackathons(hackathonsRes.data.registrations || []);
            setJobs(jobsRes.data.applications || []);
            setNotifications(notifyRes.data || []);
            setGamification(gamiRes.data.data);
            setActivities(activityRes.data.data || []);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0f111a] flex items-center justify-center">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 bg-indigo-500/10 blur-xl rounded-full"></div>
                </div>
            </div>
        );
    }

    const stats = [
        { id: 'courses', label: 'Active Courses', value: courses.length, icon: BookOpen, color: 'indigo' },
        { id: 'jobs', label: 'Applied Jobs', value: jobs.length, icon: Briefcase, color: 'blue' },
        { id: 'hackathons', label: 'Hackathons', value: hackathons.length, icon: Code, color: 'purple' },
        { id: 'xp', label: 'XP Points', value: gamification?.totalPoints || 0, icon: Zap, color: 'amber' }
    ];

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

    const renderDetailView = () => {
        switch (selectedDetail) {
            case 'courses':
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <BookOpen className="text-indigo-500" />
                                My Enrolled Courses
                            </h2>
                            <button onClick={() => setSelectedDetail(null)} className="text-sm text-gray-400 hover:text-white underline">Back to Overview</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {courses.map((enrollment, idx) => (
                                <div key={idx} className="bg-[#1a1c2e] border border-white/5 rounded-2xl p-6 hover:bg-[#20223a] transition-all group relative overflow-hidden">
                                    <div className="relative z-10 flex flex-col h-full">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400">
                                                <BookOpen size={20} />
                                            </div>
                                            <div className="px-2 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase rounded">Active</div>
                                        </div>
                                        <h4 className="font-bold text-lg mb-2 group-hover:text-indigo-400 transition-colors line-clamp-1">{enrollment.courseId?.title}</h4>
                                        <p className="text-xs text-gray-500 mb-4 font-medium">{enrollment.courseId?.category || 'Development'}</p>

                                        <div className="mt-auto space-y-4">
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
                                                    <span>Progress</span>
                                                    <span className="text-indigo-400">{enrollment.progress?.overallProgress || 0}%</span>
                                                </div>
                                                <div className="h-1.5 bg-gray-900 rounded-full overflow-hidden">
                                                    <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500" style={{ width: `${enrollment.progress?.overallProgress || 0}%` }} />
                                                </div>
                                            </div>
                                            <button onClick={() => navigate(`/courses/${enrollment.courseId?._id}`)} className="w-full py-3 bg-indigo-600 rounded-xl font-bold text-xs hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20">Continue Journey</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                );
            case 'jobs':
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <Briefcase className="text-blue-500" />
                                Job Applications
                            </h2>
                            <button onClick={() => setSelectedDetail(null)} className="text-sm text-gray-400 hover:text-white underline">Back to Overview</button>
                        </div>
                        <div className="space-y-4">
                            {jobs.map((app, idx) => (
                                <div key={idx} className="bg-[#1a1c2e] border border-white/5 rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-[#20223a] transition-all group overflow-hidden relative">
                                    <div className="flex items-center gap-6 relative z-10">
                                        <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500">
                                            <Briefcase size={30} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-black mb-1 group-hover:text-blue-400 transition-colors">{app.job?.title}</h3>
                                            <p className="text-sm text-gray-500 font-bold mb-2">{app.job?.company || 'E-Shikshan Partner'}</p>
                                            <div className="flex items-center gap-4">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${app.status === 'accepted' ? 'bg-green-500/10 text-green-400' :
                                                        app.status === 'rejected' ? 'bg-red-500/10 text-red-400' :
                                                            'bg-blue-500/10 text-blue-400'
                                                    }`}>
                                                    {app.status.replace('_', ' ')}
                                                </span>
                                                <div className="flex items-center gap-1.5 text-gray-500 text-[10px] font-bold">
                                                    <Clock size={12} />
                                                    Applied {new Date(app.appliedAt || app.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 relative z-10">
                                        <button className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all">View Details</button>
                                    </div>
                                </div>
                            ))}
                            {jobs.length === 0 && (
                                <div className="py-20 text-center bg-[#1a1c2e] rounded-3xl border border-dashed border-gray-800">
                                    <Briefcase size={48} className="mx-auto text-gray-600 mb-4 opacity-20" />
                                    <p className="text-gray-500 font-bold mb-6">No applications found.</p>
                                    <button onClick={() => navigate('/jobs')} className="px-8 py-3 bg-blue-600 rounded-2xl text-xs font-black uppercase tracking-widest">Explore Jobs</button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                );
            case 'certificates':
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <Award className="text-emerald-500" />
                                My Achievements
                            </h2>
                            <button onClick={() => setSelectedDetail(null)} className="text-sm text-gray-400 hover:text-white underline">Back to Overview</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {user?.certificatesAndBadges?.map((cert, idx) => (
                                <div key={idx} className="bg-[#1a1c2e] border border-white/5 rounded-2xl p-6 relative group border-emerald-500/20">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-500">
                                            <Award size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm">{cert.title}</h4>
                                            <p className="text-[10px] text-gray-500 uppercase font-black">{cert.type}</p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-400 mb-6 line-clamp-2">{cert.description || 'Achievement earned on E-Shikshan'}</p>
                                    <button className="w-full py-2.5 bg-gray-800 hover:bg-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">View Credential</button>
                                </div>
                            ))}
                            {(!user?.certificatesAndBadges || user.certificatesAndBadges.length === 0) && (
                                <div className="col-span-full py-20 text-center bg-[#1a1c2e] rounded-3xl border border-dashed border-gray-800">
                                    <Award size={48} className="mx-auto text-gray-600 mb-4 opacity-20" />
                                    <p className="text-gray-500 font-bold">No certificates earned yet. Keep learning!</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                );
            case 'xp':
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <Zap className="text-amber-500" fill="currentColor" />
                                Experience Points
                            </h2>
                            <button onClick={() => setSelectedDetail(null)} className="text-sm text-gray-400 hover:text-white underline">Back to Overview</button>
                        </div>
                        <div className="bg-[#1a1c2e] border border-white/5 rounded-3xl p-10 text-center relative overflow-hidden backdrop-blur-xl">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-500/10 blur-[100px] rounded-full" />
                            <div className="relative z-10">
                                <h3 className="text-7xl font-black text-white tracking-tighter mb-2">{gamification?.totalPoints || 0}</h3>
                                <p className="text-amber-400 uppercase tracking-widest text-[10px] font-black">Total Lifetime XP</p>

                                <div className="mt-12 max-w-md mx-auto bg-gray-900/50 p-6 rounded-2xl border border-white/5">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Level {gamification?.level} Milestone</span>
                                        <span className="text-xs font-bold text-amber-500">{gamification?.levelPoints} / {gamification?.nextLevelPoints} XP</span>
                                    </div>
                                    <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                                        <motion.div initial={{ width: 0 }} animate={{ width: `${(gamification?.levelPoints / (gamification?.nextLevelPoints || 1)) * 100}%` }} className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 shadow-[0_0_20px_rgba(245,158,11,0.3)]" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="font-black uppercase tracking-widest text-[10px] text-gray-500">Recent Activity Activity</h4>
                            {activities.map((act, i) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    key={i}
                                    className="flex items-center justify-between p-4 bg-[#1a1c2e] border border-white/5 rounded-2xl hover:bg-[#20223a] transition-all"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500">
                                            <Zap size={18} fill="currentColor" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm">{act.description}</p>
                                            <p className="text-[10px] text-gray-500 font-bold">{new Date(act.createdAt).toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <span className="text-amber-400 font-black tracking-tight">+{act.pointsEarned} XP</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                );
            case 'hackathons':
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <Code className="text-purple-500" />
                                Hackathon Arena
                            </h2>
                            <button onClick={() => setSelectedDetail(null)} className="text-sm text-gray-400 hover:text-white underline">Back to Overview</button>
                        </div>
                        <div className="space-y-4">
                            {hackathons.map((reg, idx) => (
                                <div key={idx} className="bg-[#1a1c2e] border border-white/5 rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-[#20223a] transition-all group overflow-hidden relative">
                                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <Trophy size={80} className="text-purple-500" />
                                    </div>
                                    <div className="flex items-center gap-6 relative z-10">
                                        <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-purple-600/20 group-hover:scale-105 transition-transform">
                                            <Trophy size={40} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black mb-1 group-hover:text-purple-400 transition-colors">{reg.hackathonId?.title}</h3>
                                            <p className="text-sm text-gray-400 max-w-md line-clamp-1 mb-3 font-medium">{reg.hackathonId?.description}</p>
                                            <div className="flex items-center gap-4">
                                                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">Registered</span>
                                                <div className="flex items-center gap-1.5 text-gray-500 text-[10px] font-bold">
                                                    <Clock size={12} />
                                                    {new Date(reg.registrationDate).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={() => navigate(`/hackathon/${reg.hackathonId?._id}`)} className="px-8 py-3 bg-purple-600 shadow-lg shadow-purple-600/30 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-purple-700 transition-all relative z-10">Manage Entry</button>
                                </div>
                            ))}
                            {hackathons.length === 0 && (
                                <div className="py-20 text-center bg-[#1a1c2e] rounded-3xl border border-dashed border-gray-800">
                                    <Trophy size={48} className="mx-auto text-gray-600 mb-4 opacity-20" />
                                    <p className="text-gray-500 font-bold mb-6">No hackathon registrations found.</p>
                                    <button onClick={() => navigate('/hackathons')} className="px-8 py-3 bg-indigo-600 rounded-2xl text-xs font-black uppercase tracking-widest">Explore Hackathons</button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-[#0f111a] text-white p-4 lg:p-8 pb-20 selection:bg-indigo-500/30">
            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 max-w-7xl mx-auto"
            >
                <div className="space-y-2">
                    <div className="flex items-center gap-4 mb-2">
                        <button
                            onClick={() => navigate('/')}
                            className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold text-gray-400 hover:text-white transition-all border border-white/5"
                        >
                            <Home size={14} />
                            Back to Home
                        </button>
                    </div>
                    <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-white via-white to-gray-500 bg-clip-text text-transparent">
                        Welcome back, {user?.name?.split(' ')[0] || 'Scholar'}! 👋
                    </h1>
                    <p className="text-gray-400 font-medium flex items-center gap-2">
                        <Activity size={16} className="text-indigo-400" />
                        You've gained <span className="text-indigo-300 font-bold">{activities.length}</span> activity points this session.
                    </p>
                </div>

                <div className="flex items-center gap-4 bg-[#1a1c2e]/50 p-2 pr-6 rounded-2xl border border-white/5 backdrop-blur-xl">
                    <div className="relative">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-black text-xl shadow-lg shadow-indigo-500/20">
                            {gamification?.level || 1}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-4 border-[#0f111a] flex items-center justify-center">
                            <Zap size={10} className="text-white fill-white" />
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-black uppercase tracking-widest text-indigo-400">Level {gamification?.level || 1}</span>
                            <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-bold">
                                {Math.round((gamification?.levelPoints / (gamification?.nextLevelPoints || 1)) * 100 || 0)}%
                            </span>
                        </div>
                        <div className="w-40 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(gamification?.levelPoints / (gamification?.nextLevelPoints || 1)) * 100 || 0}%` }}
                                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                            />
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto">
                <AnimatePresence mode="wait">
                    {!selectedDetail ? (
                        <motion.div
                            key="overview"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit={{ opacity: 0, y: 20 }}
                            className="space-y-12"
                        >
                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {stats.map((stat, i) => (
                                    <motion.div
                                        key={i}
                                        variants={itemVariants}
                                        onClick={() => setSelectedDetail(stat.id)}
                                        className="group relative cursor-pointer active:scale-95 transition-all"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="relative bg-[#1a1c2e] border border-white/5 rounded-3xl p-6 hover:border-indigo-500/50 hover:bg-[#20223a]/80 backdrop-blur-sm overflow-hidden">
                                            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full -mr-8 -mt-8 group-hover:bg-indigo-500/10 transition-colors" />
                                            <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-500/10 flex items-center justify-center text-${stat.color}-400 mb-4 group-hover:scale-110 transition-transform`}>
                                                <stat.icon size={24} />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
                                                <div className="flex items-baseline gap-2">
                                                    <h3 className="text-3xl font-black">{stat.value}</h3>
                                                    <ChevronRight size={16} className="text-gray-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Dashboard Sections */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="flex items-center justify-between px-2">
                                        <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                                            <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
                                            Recent Progress
                                        </h3>
                                        <button onClick={() => setSelectedDetail('courses')} className="text-xs font-black text-indigo-400 hover:text-indigo-300 uppercase tracking-widest">View All</button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {courses.slice(0, 4).map((en, idx) => (
                                            <div key={idx} onClick={() => navigate(`/courses/${en.courseId?._id}`)} className="bg-[#1a1c2e] border border-white/5 rounded-2xl p-6 hover:bg-[#20223a] transition-all group cursor-pointer relative overflow-hidden">
                                                <div className="flex justify-between items-start mb-4">
                                                    <h4 className="font-bold text-sm group-hover:text-indigo-400 transition-colors line-clamp-1">{en.courseId?.title}</h4>
                                                    <Zap size={14} className="text-amber-500" fill="currentColor" />
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between text-[10px] font-bold text-gray-500">
                                                        <span>Progress</span>
                                                        <span className="text-indigo-400">{en.progress?.overallProgress || 0}%</span>
                                                    </div>
                                                    <div className="h-1.5 bg-gray-900 rounded-full overflow-hidden">
                                                        <motion.div initial={{ width: 0 }} animate={{ width: `${en.progress?.overallProgress || 0}%` }} className="h-full bg-gradient-to-r from-indigo-500 to-purple-500" />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3 px-2">
                                        <div className="w-1.5 h-6 bg-purple-500 rounded-full" />
                                        Activity Feed
                                    </h3>
                                    <div className="bg-[#1a1c2e]/30 border border-white/5 rounded-3xl p-6 space-y-6">
                                        {notifications.length > 0 ? (
                                            notifications.slice(0, 5).map((note, idx) => (
                                                <div key={idx} className="group relative pr-4">
                                                    <div className="flex gap-4">
                                                        <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center font-bold text-sm ${!note.isRead ? 'bg-indigo-500/20 text-indigo-400' : 'bg-gray-800 text-gray-500'}`}>
                                                            <Bell size={16} fill={!note.isRead ? 'currentColor' : 'none'} />
                                                        </div>
                                                        <div className="py-1 flex-1">
                                                            <div className="flex justify-between items-start mb-1">
                                                                <p className={`text-xs font-bold leading-tight ${!note.isRead ? 'text-white' : 'text-gray-400'}`}>{note.title}</p>
                                                                {!note.isRead && <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />}
                                                            </div>
                                                            <p className="text-[10px] text-gray-500 line-clamp-2 leading-relaxed">{note.message}</p>
                                                            <p className="text-[9px] text-gray-600 mt-2 font-bold uppercase tracking-widest">{new Date(note.createdAt).toLocaleDateString()}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-10 opacity-30">
                                                <Bell size={32} className="mx-auto mb-3" />
                                                <p className="text-[10px] font-black uppercase tracking-widest">No new notifications</p>
                                            </div>
                                        )}
                                        <button onClick={() => navigate('/notifications')} className="w-full py-3 bg-indigo-600/10 hover:bg-indigo-600/20 text-[10px] font-black uppercase tracking-widest text-indigo-400 transition-all rounded-2xl border border-indigo-500/20">View All Notifications</button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="detail"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {renderDetailView()}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default StudentDashboard;
