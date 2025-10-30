import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  Users, BookOpen, Briefcase, Trophy, Map, FileText, 
  TrendingUp, Activity, DollarSign, UserPlus, Eye, Download 
} from "lucide-react";
import { adminAPI } from "../../services/api";
// Charts (Recharts). Ensure `npm i recharts` in client project.
import {
  ResponsiveContainer,
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  LineChart, Line, CartesianGrid
} from 'recharts';

const AdminDashboard = () => {
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

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await adminAPI.getStats();
        const { stats: s, recentEnrollments: r, topCourses: tc, coursesByCategory: cc } = res.data || {};
        if (s) setStats(s);
        setRecentEnrollments(Array.isArray(r) ? r : []);
        setTopCourses(Array.isArray(tc) ? tc : []);
        setCoursesByCategory(Array.isArray(cc) ? cc : []);
      } catch (err) {
        console.error('Dashboard load failed', err);
        setError(err?.response?.data?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const statCards = [
    { 
      title: "Total Users", 
      value: (stats.totalUsers || 0).toLocaleString(), 
      change: "All registered",
      icon: Users, 
      color: "blue",
      trend: ""
    },
    { 
      title: "Active Courses", 
      value: `${stats.activeCourses || 0}`, 
      change: `${stats.totalCourses || 0} total`,
      icon: BookOpen, 
      color: "green",
      trend: ""
    },
    { 
      title: "Job Listings", 
      value: (stats.activeJobs || 0).toString(), 
      change: `${stats.totalJobs || 0} total`,
      icon: Briefcase, 
      color: "purple",
      trend: ""
    },
    { 
      title: "Hackathons", 
      value: stats.activeHackathons || 0, 
      change: `${stats.totalHackathons || 0} total`,
      icon: Trophy, 
      color: "orange",
      trend: ""
    },
    { 
      title: "Platform Revenue", 
      value: `₹${(stats.totalRevenue || 0).toLocaleString()}`,
      change: "Completed payments",
      icon: DollarSign, 
      color: "yellow",
      trend: ""
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: "bg-blue-500/10 text-blue-400 border-blue-500/30",
      green: "bg-green-500/10 text-green-400 border-green-500/30",
      purple: "bg-purple-500/10 text-purple-400 border-purple-500/30",
      orange: "bg-orange-500/10 text-orange-400 border-orange-500/30",
      pink: "bg-pink-500/10 text-pink-400 border-pink-500/30",
      indigo: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
      cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
      yellow: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
    };
    return colors[color] || colors.blue;
  };

  // Derived chart data
  const enrollmentPie = useMemo(() => ([
    { name: 'Active', value: stats.activeEnrollments || 0 },
    { name: 'Suspended', value: stats.suspendedEnrollments || 0 },
    { name: 'Other', value: Math.max((stats.totalEnrollments || 0) - (stats.activeEnrollments || 0) - (stats.suspendedEnrollments || 0), 0) },
  ]), [stats]);

  const totalsBar = useMemo(() => ([
    { name: 'Users', total: stats.totalUsers || 0 },
    { name: 'Courses', total: stats.totalCourses || 0 },
    { name: 'Active', total: stats.activeCourses || 0 },
    { name: 'Enrollments', total: stats.totalEnrollments || 0 },
    { name: 'Jobs', total: stats.totalJobs || 0 },
    { name: 'Hackathons', total: stats.totalHackathons || 0 },
  ]), [stats]);

  const categoryPie = useMemo(() => 
    coursesByCategory.map(cat => ({ 
      name: cat._id, 
      value: cat.count,
      students: cat.students 
    }))
  , [coursesByCategory]);

  const recentLine = useMemo(() => {
    // group last 7 days by date
    const days = [...Array(7)].map((_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (6 - i)); d.setHours(0,0,0,0); return d;
    });
    const counts = days.map(d => ({ date: d, count: 0 }));
    recentEnrollments.forEach((enr) => {
      const t = new Date(enr.enrolledAt || enr.createdAt || Date.now());
      t.setHours(0,0,0,0);
      const idx = counts.findIndex(c => c.date.getTime() === t.getTime());
      if (idx >= 0) counts[idx].count += 1;
    });
    return counts.map(c => ({ name: c.date.toLocaleDateString(), count: c.count }));
  }, [recentEnrollments]);

  return (
    <div className="p-6 space-y-6">
      {error && (
        <div className="p-3 bg-red-900/30 border border-red-700 text-red-300 rounded-xl">{error}</div>
      )}
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
          <p className="text-gray-400">Welcome back! Here's what's happening with your platform today.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold flex items-center gap-2 shadow-lg"
        >
          <Download className="w-5 h-5" />
          Export Report
        </motion.button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl border ${getColorClasses(stat.color)}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="text-green-400 text-sm font-semibold flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                {stat.trend}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
            <p className="text-gray-400 text-sm mb-1">{stat.title}</p>
            <p className="text-xs text-gray-500">{stat.change}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Enrollment Status Pie */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4">Enrollment Status</h2>
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={enrollmentPie} dataKey="value" nameKey="name" outerRadius={80} label>
                  {enrollmentPie.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={["#22c55e", "#f59e0b", "#64748b"][index % 3]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip contentStyle={{ background: '#1f2937', border: '1px solid #374151', color: '#e5e7eb' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Totals Bar */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-800 rounded-2xl p-6 border border-gray-700 lg:col-span-2">
          <h2 className="text-xl font-bold text-white mb-4">Totals Overview</h2>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={totalsBar}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip contentStyle={{ background: '#1f2937', border: '1px solid #374151', color: '#e5e7eb' }} />
                <Bar dataKey="total" fill="#60a5fa" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Course Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Courses by Category */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-green-400" />
            Courses by Category
          </h2>
          {categoryPie.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={categoryPie} dataKey="value" nameKey="name" outerRadius={80} label>
                    {categoryPie.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6'][index % 6]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip 
                    contentStyle={{ background: '#1f2937', border: '1px solid #374151', color: '#e5e7eb' }}
                    formatter={(value, name, props) => [`${value} courses (${props.payload.students} students)`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400">
              No course data available
            </div>
          )}
        </motion.div>

        {/* Top Courses */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-400" />
            Top Courses by Enrollment
          </h2>
          <div className="space-y-3">
            {topCourses.length > 0 ? topCourses.map((course, idx) => (
              <div key={course._id} className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-xl hover:bg-gray-700 transition-all">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden bg-gray-600">
                  {course.thumbnail ? (
                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <BookOpen className="w-5 h-5" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm truncate">{course.title}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span>{course.category}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {course.students}
                    </span>
                    {course.rating > 0 && (
                      <>
                        <span>•</span>
                        <span>⭐ {course.rating.toFixed(1)}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold">
                  #{idx + 1}
                </div>
              </div>
            )) : (
              <div className="text-center py-8 text-gray-400">
                No course data available
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gray-800 rounded-2xl p-6 border border-gray-700"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <UserPlus className="w-6 h-6 text-blue-400" />
              Recent Enrollments (Last 7 days)
            </h2>
          </div>
          <div className="h-64">
            <ResponsiveContainer>
              <LineChart data={recentLine}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip contentStyle={{ background: '#1f2937', border: '1px solid #374151', color: '#e5e7eb' }} />
                <Line type="monotone" dataKey="count" stroke="#34d399" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gray-800 rounded-2xl p-6 border border-gray-700"
        >
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Activity className="w-6 h-6 text-green-400" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Add Course", icon: BookOpen, color: "blue" },
              { label: "Post Job", icon: Briefcase, color: "purple" },
              { label: "Create Event", icon: Trophy, color: "orange" },
              { label: "New Roadmap", icon: Map, color: "pink" },
              { label: "Add Content", icon: FileText, color: "indigo" },
              { label: "View Reports", icon: Eye, color: "cyan" }
            ].map((action, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="p-4 bg-gray-700 hover:bg-gray-600 rounded-xl border border-gray-600 hover:border-gray-500 transition-all text-left"
              >
                <action.icon className={`w-6 h-6 mb-2 ${
                  action.color === 'blue' ? 'text-blue-400' :
                  action.color === 'purple' ? 'text-purple-400' :
                  action.color === 'orange' ? 'text-orange-400' :
                  action.color === 'pink' ? 'text-pink-400' :
                  action.color === 'indigo' ? 'text-indigo-400' :
                  'text-cyan-400'
                }`} />
                <p className="text-white font-medium text-sm">{action.label}</p>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Platform Health */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 rounded-2xl p-6 border border-gray-700"
      >
        <h2 className="text-xl font-bold text-white mb-6">Platform Health</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Server Status", status: "Operational", color: "green" },
            { label: "API Response", status: "98ms avg", color: "blue" },
            { label: "Uptime", status: "99.9%", color: "green" }
          ].map((health, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-xl">
              <div>
                <p className="text-gray-400 text-sm mb-1">{health.label}</p>
                <p className="text-white font-semibold">{health.status}</p>
              </div>
              <div className={`w-3 h-3 rounded-full ${
                health.color === 'green' ? 'bg-green-500' : 'bg-blue-500'
              } animate-pulse`} />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
