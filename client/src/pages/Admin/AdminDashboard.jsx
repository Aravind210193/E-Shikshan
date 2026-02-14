import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users, BookOpen, Briefcase, Trophy, Map, FileText,
  TrendingUp, Activity, DollarSign, UserPlus, Eye, Download, MessageSquare, LogOut,
  Star, Clock, ChevronRight, ArrowUpRight,
  File, Play, Link as LinkIcon
} from "lucide-react";
import { adminAPI } from "../../services/api";
import { adminDoubtAPI } from "../../services/adminApi";
// Charts (Recharts). Ensure `npm i recharts` in client project.
import {
  ResponsiveContainer,
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  LineChart, Line, CartesianGrid
} from 'recharts';

const AdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const role = sessionStorage.getItem('adminRole');
  const base = role === 'course_manager' ? '/instructor' : '/admin';
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    activeCourses: 0,
    draftCourses: 0,
    archivedCourses: 0,
    totalEnrollments: 0,
    activeEnrollments: 0,
    suspendedEnrollments: 0,
    totalRevenue: 0,
    totalHackathons: 0,
    activeHackathons: 0,
    totalJobs: 0,
    activeJobs: 0,
  });
  const [recentEnrollments, setRecentEnrollments] = useState([]);
  const [topCourses, setTopCourses] = useState([]);
  const [coursesByCategory, setCoursesByCategory] = useState([]);
  const [recentRoadmaps, setRecentRoadmaps] = useState([]);
  const [recentContent, setRecentContent] = useState([]);
  const [recentDoubts, setRecentDoubts] = useState([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await adminAPI.getStats();
        const { stats: s, recentEnrollments: r, topCourses: tc, coursesByCategory: cc, recentRoadmaps: rm, recentContent: rc, recentDoubts: rd } = res.data || {};
        if (s) setStats(s);
        setRecentEnrollments(Array.isArray(r) ? r : []);
        setTopCourses(Array.isArray(tc) ? tc : []);
        setCoursesByCategory(Array.isArray(cc) ? cc : []);
        setRecentRoadmaps(Array.isArray(rm) ? rm : []);
        setRecentContent(Array.isArray(rc) ? rc : []);
        setRecentDoubts(Array.isArray(rd) ? rd : []);
      } catch (err) {
        console.error('Dashboard load failed', err);
        setError(err?.response?.data?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [location.pathname]);

  // Chart data Preparation
  const barChartData = [
    { name: '6am', enrollments: 400, avg: 240 },
    { name: '7am', enrollments: 700, avg: 300 },
    { name: '8am', enrollments: 900, avg: 400 },
    { name: '9am', enrollments: 1200, avg: 500 },
    { name: '1pm', enrollments: 1500, avg: 600 },
    { name: '2pm', enrollments: 1800, avg: 900 },
    { name: '3pm', enrollments: 1400, avg: 800 },
    { name: '4pm', enrollments: 1600, avg: 700 },
    { name: '5pm', enrollments: 1100, avg: 600 },
    { name: '6pm', enrollments: 1300, avg: 500 },
    { name: '7pm', enrollments: 1000, avg: 400 },
  ];

  const lineChartData = [
    { name: '5am', visitors: 100000, visits: 80000 },
    { name: '6am', visitors: 110000, visits: 90000 },
    { name: '7am', visitors: 130000, visits: 100000 },
    { name: '8am', visitors: 150000, visits: 120000 },
    { name: '9am', visitors: 180000, visits: 140000 },
    { name: '10am', visitors: 220000, visits: 180000 },
    { name: '11am', visitors: 250000, visits: 200000 },
    { name: '12nn', visitors: 230000, visits: 240000 },
    { name: '1pm', visitors: 250000, visits: 220000 },
    { name: '2pm', visitors: 210000, visits: 180000 },
    { name: '3pm', visitors: 150000, visits: 140000 },
    { name: '4pm', visitors: 120000, visits: 100000 },
  ];

  const chartCoursesByCategory = useMemo(() => {
    if (!coursesByCategory || coursesByCategory.length === 0) {
      return [
        { name: 'Development', value: 45, color: '#6366f1' },
        { name: 'Business', value: 25, color: '#3b82f6' },
        { name: 'Design', value: 20, color: '#06b6d4' },
        { name: 'Marketing', value: 10, color: '#7a7f9a' },
      ];
    }
    const colors = ['#6366f1', '#3b82f6', '#06b6d4', '#ec4899', '#10b981', '#f59e0b'];
    return coursesByCategory.map((item, index) => ({
      name: item._id || 'Other',
      value: item.count,
      color: colors[index % colors.length]
    }));
  }, [coursesByCategory]);

  return (
    <div className="p-8 space-y-8 bg-[#10111a] min-h-full">
      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4 border-b border-[#2d2f45] pb-6">
        <div className="flex items-center gap-6">
          <span className="text-[#7a7f9a] font-bold text-sm">Status :</span>
          <div className="flex gap-6">
            <span className="flex items-center gap-2 text-white text-xs font-semibold">
              <span className="w-2 h-2 bg-pink-500 rounded-sm"></span> {stats.totalCourses} Courses
            </span>
            <span className="flex items-center gap-2 text-white text-xs font-semibold">
              <span className="w-2 h-2 bg-green-500 rounded-sm"></span> {stats.totalEnrollments} Enrollments
            </span>
            {role === 'course_manager' ? (
              <span className="flex items-center gap-2 text-white text-xs font-semibold">
                <span className="w-2 h-2 bg-red-500 rounded-sm animate-pulse"></span> {stats.doubtsStats?.pending || 0} Pending Doubts
              </span>
            ) : (
              <span className="flex items-center gap-2 text-white text-xs font-semibold">
                <span className="w-2 h-2 bg-cyan-500 rounded-sm"></span> {stats.totalUsers} Students
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-[#7a7f9a] text-xs font-bold">
            {role !== 'course_manager' && (
              <button onClick={() => navigate(`${base}/users`)} className="flex items-center gap-1 hover:text-white transition-colors">
                <Users className="w-4 h-4 text-indigo-500" /> Users
              </button>
            )}
            <button onClick={() => navigate(`${base}/courses`)} className="flex items-center gap-1 hover:text-white transition-colors">
              <BookOpen className="w-4 h-4 text-pink-500" /> Courses
            </button>
            <button className="flex items-center gap-1 hover:text-white transition-colors">
              <FileText className="w-4 h-4 text-green-500" /> Reports
            </button>
            <button className="flex items-center gap-1 hover:text-white transition-colors" onClick={() => {
              sessionStorage.removeItem('adminToken');
              sessionStorage.removeItem('adminRole');
              sessionStorage.removeItem('adminData');
              window.location.href = '/admin';
            }}><LogOut className="w-4 h-4 text-cyan-500" /> Logout</button>
          </div>
          <div className="flex gap-2">
            <button className="p-2 bg-[#1a1c2c] border border-[#2d2f45] rounded hover:border-indigo-500 transition-all text-[#7a7f9a]"><TrendingUp className="w-4 h-4" /></button>
            <button className="p-2 bg-[#1a1c2c] border border-[#2d2f45] rounded hover:border-indigo-500 transition-all text-[#7a7f9a]"><Activity className="w-4 h-4" /></button>
            <button className="p-2 bg-[#1a1c2c] border border-[#2d2f45] rounded hover:border-indigo-500 transition-all text-[#7a7f9a]"><TrendingUp className="w-4 h-4 rotate-90" /></button>
          </div>
        </div>
      </div>

      {/* Row 0: Quick Metrics Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: role === 'course_manager' ? "Your Students" : "Total Students", value: stats.totalUsers, icon: Users, color: "text-indigo-500", bg: "bg-indigo-500/10" },
          { label: role === 'course_manager' ? "Your Courses" : "Total Courses", value: stats.totalCourses, icon: BookOpen, color: "text-pink-500", bg: "bg-pink-500/10" },
          { label: role === 'course_manager' ? "Pending Doubts" : "Enrollments", value: role === 'course_manager' ? (stats.doubtsStats?.pending || 0) : stats.totalEnrollments, icon: role === 'course_manager' ? MessageSquare : Briefcase, color: role === 'course_manager' ? "text-red-500" : "text-green-500", bg: role === 'course_manager' ? "bg-red-500/10" : "bg-green-500/10" },
          { label: role === 'course_manager' ? "Resolved" : "Revenue", value: role === 'course_manager' ? (stats.doubtsStats?.resolved || 0) : `₹${stats.totalRevenue}`, icon: Activity, color: "text-cyan-500", bg: "bg-cyan-500/10" }
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`bg-[#1a1c2c] border border-[#2d2f45] rounded-xl p-5 shadow-lg flex items-center gap-4 group hover:border-indigo-500/50 transition-all cursor-default`}
          >
            <div className={`p-3 ${item.bg} rounded-lg group-hover:scale-110 transition-transform`}>
              <item.icon className={`w-6 h-6 ${item.color}`} />
            </div>
            <div>
              <p className="text-[#7a7f9a] text-[10px] font-bold uppercase tracking-wider">{item.label}</p>
              <h3 className="text-white text-xl font-extrabold mt-0.5">{item.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {role === 'course_manager' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1a1c2c] border border-[#2d2f45] rounded-xl p-6 shadow-xl"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[#7a7f9a] font-bold text-sm tracking-wide uppercase">Student Doubts & Clarifications</h3>
            <span className="px-3 py-1 bg-red-500/10 text-red-500 text-[10px] font-extrabold rounded-full animate-pulse">
              ACTION REQUIRED
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#2d2f45]">
                  <th className="pb-4 text-[10px] font-extrabold text-[#7a7f9a] uppercase tracking-wider">Student</th>
                  <th className="pb-4 text-[10px] font-extrabold text-[#7a7f9a] uppercase tracking-wider">Course</th>
                  <th className="pb-4 text-[10px] font-extrabold text-[#7a7f9a] uppercase tracking-wider">Question Preview</th>
                  <th className="pb-4 text-[10px] font-extrabold text-[#7a7f9a] uppercase tracking-wider">Type</th>
                  <th className="pb-4 text-[10px] font-extrabold text-[#7a7f9a] uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2d2f45]">
                {recentDoubts.length > 0 ? recentDoubts.map((doubt, idx) => (
                  <tr key={doubt._id || idx} className="group hover:bg-[#10111a]/50 transition-all text-xs">
                    <td className="py-4">
                      <p className="text-white font-bold">{doubt.student?.name || 'Student'}</p>
                      <p className="text-[#5a5f7a] text-[10px]">{doubt.student?.email}</p>
                    </td>
                    <td className="py-4 text-indigo-400 font-bold">{doubt.course?.title || 'Unknown Course'}</td>
                    <td className="py-4 text-white/80 max-w-xs truncate">{doubt.question}</td>
                    <td className="py-4">
                      <span className="px-2 py-1 bg-[#2d2f45] text-[#7a7f9a] text-[9px] font-bold rounded uppercase">
                        {doubt.itemType}
                      </span>
                    </td>
                    <td className="py-4">
                      <button
                        onClick={() => navigate(`${base}/doubts`)}
                        className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold rounded-lg transition-all shadow-lg shadow-indigo-500/20"
                      >
                        Respond
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-[#5a5f7a]">No pending doubts to clarify</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {role !== 'course_manager' && (
        <>
          {/* Row 1: Key Metrics Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Enrollment Overview Card */}
            <div className="bg-[#1a1c2c] border border-[#2d2f45] rounded-xl p-6 shadow-xl">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-[#7a7f9a] font-bold text-sm tracking-wide">Enrollment Overview</h3>
                  <div className="flex gap-8 mt-2 text-white">
                    <div>
                      <p className="text-2xl font-extrabold">{stats.totalEnrollments}</p>
                      <p className="text-[10px] text-[#7a7f9a] font-bold uppercase tracking-wider">Total Enrollments</p>
                    </div>
                    <div>
                      <p className="text-2xl font-extrabold text-[#7a7f9a]">{stats.activeEnrollments}</p>
                      <p className="text-[10px] font-bold uppercase tracking-wider">Active Enrollments</p>
                    </div>
                  </div>
                </div>
                <span className="text-[#7a7f9a] text-[10px] font-bold">This Month</span>
              </div>
              <div className="h-[250px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid vertical={false} stroke="#2d2f45" strokeDasharray="3 3" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#7a7f9a', fontSize: 10 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#7a7f9a', fontSize: 10 }} />
                    <Tooltip cursor={{ fill: '#2d2f45', opacity: 0.4 }} contentStyle={{ background: '#1a1c2c', border: '1px solid #2d2f45', borderRadius: '8px' }} />
                    <Bar dataKey="enrollments" fill="#00d1ff" radius={[2, 2, 0, 0]} barSize={12} />
                    <Bar dataKey="avg" fill="#2d2f45" radius={[2, 2, 0, 0]} barSize={12} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Platform Metrics Card */}
            <div className="bg-[#1a1c2c] border border-[#2d2f45] rounded-xl p-6 shadow-xl">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-[#7a7f9a] font-bold text-sm tracking-wide">Platform Metrics</h3>
                  <div className="flex gap-8 mt-4 text-white">
                    <div>
                      <p className="text-2xl font-extrabold">{stats.totalUsers}</p>
                      <p className="text-[10px] text-[#7a7f9a] font-bold uppercase tracking-wider">Total Users</p>
                    </div>
                    <div>
                      <p className="text-2xl font-extrabold">{stats.totalCourses}</p>
                      <p className="text-[10px] text-[#7a7f9a] font-bold uppercase tracking-wider">Total Courses</p>
                    </div>
                    <div>
                      <p className="text-2xl font-extrabold text-[#7a7f9a]">₹{stats.totalRevenue}</p>
                      <p className="text-[10px] text-[#7a7f9a] font-bold uppercase tracking-wider">Revenue</p>
                    </div>
                  </div>
                </div>
                <span className="text-[#7a7f9a] text-[10px] font-bold">Overall</span>
              </div>
              <div className="h-[250px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={lineChartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid vertical={false} stroke="#2d2f45" strokeDasharray="3 3" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#7a7f9a', fontSize: 10 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#7a7f9a', fontSize: 10 }} />
                    <Tooltip contentStyle={{ background: '#1a1c2c', border: '1px solid #2d2f45', borderRadius: '8px' }} />
                    <Line type="monotone" dataKey="visitors" stroke="#ff5a9a" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="visits" stroke="#ffffff" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Categories and Promo Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-[#1a1c2c] border border-[#2d2f45] rounded-xl p-6 shadow-xl">
              <h3 className="text-[#7a7f9a] font-bold text-sm tracking-wide mb-2 uppercase">Courses By Category</h3>
              <p className="text-[#5a5f7a] text-xs mb-8">Distribution of courses across different categories on the E-Shikshan platform.</p>

              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="h-[250px] w-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartCoursesByCategory}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                        stroke="none"
                      >
                        {chartCoursesByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-4 flex-1">
                  {chartCoursesByCategory.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }}></span>
                        <span className="text-[#7a7f9a] text-sm font-semibold">{item.name} ({item.value} units)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Promo Card */}
            <div className="bg-gradient-to-br from-indigo-700 to-indigo-900 rounded-xl overflow-hidden relative shadow-2xl flex flex-col justify-between p-8">
              <div className="z-10 relative">
                <h2 className="text-white text-3xl font-extrabold leading-tight mb-4">Empowering <br /> Education <br /> with E-Shikshan</h2>
                <button
                  onClick={() => navigate(`${base}/courses`)}
                  className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-lg font-bold text-sm transition-all shadow-lg shadow-pink-500/30"
                >
                  Manage Courses
                </button>
              </div>
              <div className="z-10 relative mt-12">
                <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest mb-2">Advanced Admin Controls</p>
                <p className="text-white text-sm opacity-80 leading-relaxed max-w-[200px]">Manage students, faculty, and content effortlessly.</p>
              </div>
              <div className="absolute right-[-20px] bottom-10 w-[200px] h-[200px] bg-white/5 rounded-full blur-3xl"></div>
              <div className="absolute right-0 bottom-0 pointer-events-none opacity-40">
                <Users className="w-48 h-48 text-white/10 rotate-12" />
              </div>
            </div>
          </div>

          {/* Row Roadmaps: Interactive Learning Paths */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-[#7a7f9a] font-bold text-sm tracking-wide uppercase">Learning Roadmaps</h3>
              <button
                onClick={() => navigate(`${base}/roadmaps`)}
                className="text-xs text-indigo-400 font-bold flex items-center gap-1 hover:text-indigo-300 transition-colors"
              >
                Configure All <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentRoadmaps.length > 0 ? recentRoadmaps.map((roadmap, idx) => (
                <motion.div
                  key={roadmap._id || idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="bg-[#1a1c2c] border border-[#2d2f45] rounded-xl overflow-hidden shadow-xl hover:border-indigo-500/50 transition-all group cursor-pointer"
                >
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={roadmap.thumbnail || `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop`}
                      alt={roadmap.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#10111a] to-transparent opacity-60"></div>
                    <div className="absolute top-4 left-4">
                      <span className={`px-2 py-1 rounded-md text-[9px] font-extrabold uppercase shadow-lg ${roadmap.level === 'Beginner' ? 'bg-green-500 text-white' :
                        roadmap.level === 'Intermediate' ? 'bg-indigo-500 text-white' : 'bg-pink-500 text-white'
                        }`}>
                        {roadmap.level}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h4 className="text-white font-bold text-lg mb-1 group-hover:text-indigo-400 transition-colors">{roadmap.title}</h4>
                    <p className="text-[#7a7f9a] text-xs mb-4">{roadmap.category || 'Career Path'}</p>
                    <div className="flex items-center justify-between text-[#5a5f7a] border-t border-[#2d2f45] pt-4">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-indigo-500" />
                        <span className="text-[10px] font-bold uppercase">{roadmap.steps?.length || 0} Modules</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500" />
                        <span className="text-[10px] font-bold">4.9</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )) : (
                [1, 2, 3].map((i) => (
                  <div key={i} className="bg-[#1a1c2c] border border-[#2d2f45] rounded-xl h-64 animate-pulse flex items-center justify-center">
                    <Map className="w-8 h-8 text-[#2d2f45]" />
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Activity and Performance Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Performing Courses */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[#1a1c2c] border border-[#2d2f45] rounded-xl p-6 shadow-xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-[#7a7f9a] font-bold text-sm tracking-wide uppercase">Top Performing Courses</h3>
                <button
                  onClick={() => navigate(`${base}/courses`)}
                  className="text-xs text-indigo-400 font-bold flex items-center gap-1 hover:text-indigo-300 transition-colors"
                >
                  View All <ChevronRight className="w-3 h-3" />
                </button>
              </div>
              <div className="space-y-4">
                {topCourses.length > 0 ? topCourses.map((course, idx) => (
                  <div key={course._id || idx} className="flex items-center justify-between p-3 bg-[#10111a] rounded-lg border border-[#2d2f45] hover:border-indigo-500/50 transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#1a1c2c] rounded-md overflow-hidden flex items-center justify-center border border-[#2d2f45]">
                        {course.thumbnail ? (
                          <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                        ) : (
                          <BookOpen className="w-6 h-6 text-indigo-500" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-white text-sm font-bold truncate max-w-[180px]">{course.title}</h4>
                        <p className="text-[#5a5f7a] text-[10px] font-bold flex items-center gap-1 mt-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" /> {course.rating || '4.8'} • {course.students || 0} Students
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-white text-sm font-extrabold">₹{course.price || '0'}</p>
                        <p className="text-green-500 text-[10px] font-bold flex items-center justify-end gap-1">
                          <ArrowUpRight className="w-3 h-3" /> +12.5%
                        </p>
                      </div>
                      <button className="p-2 text-[#7a7f9a] hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8">
                    <p className="text-[#5a5f7a] text-sm">No courses found</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Recent Enrollments Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[#1a1c2c] border border-[#2d2f45] rounded-xl p-6 shadow-xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-[#7a7f9a] font-bold text-sm tracking-wide uppercase">Recent Enrollments</h3>
                <button className="text-xs text-[#7a7f9a] hover:text-white transition-colors font-bold uppercase tracking-widest">
                  Live Feed
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-[#2d2f45]">
                      <th className="pb-4 text-[10px] font-extrabold text-[#7a7f9a] uppercase tracking-wider">Student</th>
                      <th className="pb-4 text-[10px] font-extrabold text-[#7a7f9a] uppercase tracking-wider">Course</th>
                      <th className="pb-4 text-[10px] font-extrabold text-[#7a7f9a] uppercase tracking-wider">Date</th>
                      <th className="pb-4 text-[10px] font-extrabold text-[#7a7f9a] uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2d2f45]">
                    {recentEnrollments.length > 0 ? recentEnrollments.map((enr, idx) => (
                      <tr key={enr._id || idx} className="group hover:bg-[#10111a]/50 transition-all">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-[10px] font-bold">
                              {enr.userId?.name?.charAt(0) || 'U'}
                            </div>
                            <div>
                              <p className="text-white text-xs font-bold">{enr.userId?.name || 'Unknown'}</p>
                              <p className="text-[#5a5f7a] text-[10px]">{enr.userId?.email || 'N/A'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <p className="text-indigo-400 text-xs font-bold truncate max-w-[120px]">{enr.courseId?.title || 'N/A'}</p>
                        </td>
                        <td className="py-4 text-[#7a7f9a] text-[10px] font-medium">
                          {enr.enrolledAt ? new Date(enr.enrolledAt).toLocaleDateString() : 'Today'}
                        </td>
                        <td className="py-4">
                          <span className={`px-2 py-1 rounded-full text-[9px] font-extrabold uppercase ${enr.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                            {enr.status || 'Active'}
                          </span>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="4" className="text-center py-8 text-[#5a5f7a] text-sm">No recent enrollments</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>

          {/* Row: Recent Educational Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#1a1c2c] border border-[#2d2f45] rounded-xl p-6 shadow-xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[#7a7f9a] font-bold text-sm tracking-wide uppercase">Recent Educational Content</h3>
              <button
                onClick={() => navigate(`${base}/content`)}
                className="text-xs text-[#7a7f9a] hover:text-white transition-colors font-bold uppercase tracking-widest"
              >
                Manage All Content
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#2d2f45]">
                    <th className="pb-4 text-[10px] font-extrabold text-[#7a7f9a] uppercase tracking-wider">Content Title</th>
                    <th className="pb-4 text-[10px] font-extrabold text-[#7a7f9a] uppercase tracking-wider">Type</th>
                    <th className="pb-4 text-[10px] font-extrabold text-[#7a7f9a] uppercase tracking-wider">Branch/Subject</th>
                    <th className="pb-4 text-[10px] font-extrabold text-[#7a7f9a] uppercase tracking-wider">Status</th>
                    <th className="pb-4 text-[10px] font-extrabold text-[#7a7f9a] uppercase tracking-wider">Added On</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2d2f45]">
                  {recentContent.length > 0 ? recentContent.map((item, idx) => (
                    <tr key={item._id || idx} className="group hover:bg-[#10111a]/50 transition-all text-xs">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-[#10111a] border border-[#2d2f45] rounded text-indigo-400 group-hover:border-indigo-500/50 transition-all">
                            {item.type === 'pdf' ? <File className="w-4 h-4" /> :
                              item.type === 'video' ? <Play className="w-4 h-4" /> :
                                item.type === 'link' ? <LinkIcon className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                          </div>
                          <span className="text-white font-bold">{item.title}</span>
                        </div>
                      </td>
                      <td className="py-4 text-[#7a7f9a] font-bold uppercase text-[9px]">
                        {item.type}
                      </td>
                      <td className="py-4">
                        <p className="text-indigo-400 font-bold">{item.branch || 'Common'}</p>
                        <p className="text-[#5a5f7a] text-[10px]">{item.subject || 'Platform-wide'}</p>
                      </td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded-md text-[9px] font-extrabold uppercase ${item.status === 'published' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'
                          }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-4 text-[#7a7f9a] font-medium">
                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recent'}
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="5" className="text-center py-8 text-[#5a5f7a]">No recent content items found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
