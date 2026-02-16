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
import { adminDoubtAPI, adminCourseAPI, adminUserAPI } from "../../services/adminApi";
import { toast } from "react-hot-toast";
import { Trash2, ShieldCheck, RotateCcw } from "lucide-react";
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
  const role = sessionStorage.getItem('adminRole')?.toLowerCase();
  const base = (role === 'course_manager' || role === 'instructor') ? '/instructor' : '/admin';
  const isManager = role === 'course_manager' || role === 'instructor';
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
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
  const [recentProjectSubmissions, setRecentProjectSubmissions] = useState([]);
  const [enrollmentTrend, setEnrollmentTrend] = useState([]);
  const [userTrend, setUserTrend] = useState([]);

  // Registered Students State
  const [courseFilter, setCourseFilter] = useState("");
  const [instructorCourses, setInstructorCourses] = useState([]);
  const [courseStudents, setCourseStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(false);

  // Instructor and Student data from backend
  const [recentInstructors, setRecentInstructors] = useState([]);
  const [allRegisteredStudents, setAllRegisteredStudents] = useState([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await adminAPI.getStats();
        const {
          stats: s,
          recentEnrollments: r,
          topCourses: tc,
          coursesByCategory: cc,
          recentRoadmaps: rm,
          recentContent: rc,
          recentDoubts: rd,
          recentProjectSubmissions: rps,
          enrollmentTrend: et,
          userMonthlyTrend: ut
        } = res.data || {};
        console.log('API Version Check:', s?.apiVersion);
        if (s) setStats(s);
        setRecentEnrollments(Array.isArray(r) ? r : []);
        setTopCourses(Array.isArray(tc) ? tc : []);
        setCoursesByCategory(Array.isArray(cc) ? cc : []);
        setRecentRoadmaps(Array.isArray(rm) ? rm : []);
        setRecentContent(Array.isArray(rc) ? rc : []);
        setRecentDoubts(Array.isArray(rd) ? rd : []);
        setRecentProjectSubmissions(Array.isArray(rps) ? rps : []);
        setEnrollmentTrend(Array.isArray(et) ? et.map(d => ({ name: d._id, enrollments: d.enrollments })) : []);
        setUserTrend(Array.isArray(ut) ? ut.map(d => ({ name: d._id, users: d.users })) : []);

        // Set instructors and students data from backend
        const { recentInstructors: ri, allRegisteredStudents: ars } = res.data || {};
        setRecentInstructors(Array.isArray(ri) ? ri : []);
        setAllRegisteredStudents(Array.isArray(ars) ? ars : []);
      } catch (err) {
        console.error('Dashboard load failed', err);
        setError(err?.response?.data?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    load();
    if (isManager) {
      fetchInstructorCourses();
    }
  }, [location.pathname, isManager]);

  const fetchInstructorCourses = async () => {
    try {
      const adminData = JSON.parse(sessionStorage.getItem('adminData') || '{}');
      const email = adminData.email?.toLowerCase();
      const params = { instructorEmail: email };
      const res = await adminCourseAPI.getAll(params);
      if (res.data.success) {
        setInstructorCourses(res.data.courses || []);
        if (res.data.courses?.length > 0 && !courseFilter) {
          // Don't auto-select to avoid heavy load, let user choose
        }
      }
    } catch (err) {
      console.error("Failed to fetch instructor courses", err);
    }
  };

  const fetchCourseStudents = async (courseId) => {
    if (!courseId) {
      setCourseStudents([]);
      return;
    }
    setStudentsLoading(true);
    try {
      const res = await adminCourseAPI.getEnrollments(courseId);
      if (res.data.success) {
        setCourseStudents(res.data.enrollments || []);
      }
    } catch (err) {
      console.error("Failed to fetch course students", err);
      const msg = err.response?.data?.message || "Failed to load students";
      toast.error(msg);
    } finally {
      setStudentsLoading(false);
    }
  };

  const handleEnrollmentAction = async (action, enrollmentId) => {
    try {
      if (action === 'revoke') {
        await adminAPI.revokeCourseAccess(enrollmentId);
        toast.success("Access revoked");
      } else if (action === 'restore') {
        await adminAPI.restoreCourseAccess(enrollmentId);
        toast.success("Access restored");
      } else if (action === 'delete') {
        if (!window.confirm("Are you sure you want to delete this enrollment?")) return;
        await adminAPI.deleteEnrollment(enrollmentId);
        toast.success("Enrollment deleted");
      }
      fetchCourseStudents(courseFilter);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Action failed");
    }
  };

  useEffect(() => {
    if (courseFilter) {
      fetchCourseStudents(courseFilter);
    } else {
      setCourseStudents([]);
    }
  }, [courseFilter]);

  // Chart data Preparation
  const chartEnrollmentTrend = enrollmentTrend.length > 0 ? enrollmentTrend : [
    { name: 'No Data', enrollments: 0 }
  ];

  const chartUserTrend = userTrend.length > 0 ? userTrend : [
    { name: 'No Data', users: 0 }
  ];

  const chartCoursesByCategory = useMemo(() => {
    if (!coursesByCategory || coursesByCategory.length === 0) {
      return [];
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
            {isManager ? (
              <span className="flex items-center gap-2 text-white text-xs font-semibold">
                <span className="w-2 h-2 bg-red-500 rounded-sm animate-pulse"></span> {stats.doubtsStats?.pending || 0} Pending Doubts
              </span>
            ) : (
              <span className="flex items-center gap-2 text-white text-xs font-semibold">
                <span className="w-2 h-2 bg-cyan-500 rounded-sm"></span> {stats.totalStudents || 0} Students
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-[#7a7f9a] text-xs font-bold">
            {!isManager && (
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
          { label: isManager ? "Total Enrollments" : "Total Students", value: isManager ? (stats.totalEnrollments || 0) : (stats.totalStudents || 0), icon: Users, color: "text-indigo-500", bg: "bg-indigo-500/10" },
          { label: isManager ? "Your Courses" : "Total Courses", value: stats.totalCourses || 0, icon: BookOpen, color: "text-pink-500", bg: "bg-pink-500/10" },
          { label: isManager ? "Pending Doubts" : "Enrollments", value: isManager ? (stats.doubtsStats?.pending || 0) : (stats.totalEnrollments || 0), icon: isManager ? MessageSquare : Briefcase, color: isManager ? "text-red-500" : "text-green-500", bg: isManager ? "bg-red-500/10" : "bg-green-500/10" },
          { label: isManager ? "Unique Students" : "Revenue", value: isManager ? (stats.totalStudents || 0) : `₹${stats.totalRevenue ? stats.totalRevenue.toLocaleString() : 0}`, icon: Activity, color: "text-cyan-500", bg: "bg-cyan-500/10" }
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

      {isManager && (
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

      {isManager && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1a1c2c] border border-[#2d2f45] rounded-xl p-6 shadow-xl"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[#7a7f9a] font-bold text-sm tracking-wide uppercase">New Project Submissions</h3>
            <span className="px-3 py-1 bg-green-500/10 text-green-500 text-[10px] font-extrabold rounded-full">
              {stats.projectStats?.pending || 0} PENDING REVIEW
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#2d2f45]">
                  <th className="pb-4 text-[10px] font-extrabold text-[#7a7f9a] uppercase tracking-wider">Student</th>
                  <th className="pb-4 text-[10px] font-extrabold text-[#7a7f9a] uppercase tracking-wider">Project</th>
                  <th className="pb-4 text-[10px] font-extrabold text-[#7a7f9a] uppercase tracking-wider">Submitted</th>
                  <th className="pb-4 text-[10px] font-extrabold text-[#7a7f9a] uppercase tracking-wider">Link</th>
                  <th className="pb-4 text-[10px] font-extrabold text-[#7a7f9a] uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2d2f45]">
                {recentProjectSubmissions.length > 0 ? recentProjectSubmissions.map((sub, idx) => (
                  <tr key={sub._id || idx} className="group hover:bg-[#10111a]/50 transition-all text-xs">
                    <td className="py-4">
                      <p className="text-white font-bold">{sub.student?.name || 'Student'}</p>
                      <p className="text-[#5a5f7a] text-[10px]">{sub.student?.email}</p>
                    </td>
                    <td className="py-4">
                      <p className="text-indigo-400 font-bold">{sub.title}</p>
                      <p className="text-[#5a5f7a] text-[10px]">{sub.course?.title}</p>
                    </td>
                    <td className="py-4 text-[#7a7f9a]">
                      {new Date(sub.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4">
                      <a
                        href={sub.submissionUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                      >
                        <LinkIcon className="w-3 h-3" /> View Work
                      </a>
                    </td>
                    <td className="py-4">
                      <button
                        onClick={() => navigate(`${base}/submissions`)}
                        className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded-lg transition-all shadow-lg shadow-emerald-500/20"
                      >
                        Grade
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-[#5a5f7a]">No new project submissions</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {!isManager && (
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
                  <BarChart data={chartEnrollmentTrend} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid vertical={false} stroke="#2d2f45" strokeDasharray="3 3" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#7a7f9a', fontSize: 10 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#7a7f9a', fontSize: 10 }} />
                    <Tooltip cursor={{ fill: '#2d2f45', opacity: 0.4 }} contentStyle={{ background: '#1a1c2c', border: '1px solid #2d2f45', borderRadius: '8px' }} />
                    <Bar dataKey="enrollments" fill="#00d1ff" radius={[2, 2, 0, 0]} barSize={12} />
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
                      <p className="text-2xl font-extrabold">{stats.totalStudents}</p>
                      <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">Total Students</p>
                    </div>
                    <div>
                      <p className="text-2xl font-extrabold text-[#7a7f9a]">{stats.totalUsers}</p>
                      <p className="text-[10px] text-[#7a7f9a] font-bold uppercase tracking-wider">Total Users</p>
                    </div>
                    <div>
                      <p className="text-2xl font-extrabold">{stats.totalCourses}</p>
                      <p className="text-[10px] text-[#7a7f9a] font-bold uppercase tracking-wider">Total Courses</p>
                    </div>
                    <div>
                      <p className="text-2xl font-extrabold text-[#7a7f9a]">₹{stats.totalRevenue ? stats.totalRevenue.toLocaleString() : 0}</p>
                      <p className="text-[10px] text-[#7a7f9a] font-bold uppercase tracking-wider">Revenue</p>
                    </div>
                  </div>
                </div>
                <span className="text-[#7a7f9a] text-[10px] font-bold">Overall</span>
              </div>
              <div className="h-[250px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartUserTrend} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid vertical={false} stroke="#2d2f45" strokeDasharray="3 3" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#7a7f9a', fontSize: 10 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#7a7f9a', fontSize: 10 }} />
                    <Tooltip contentStyle={{ background: '#1a1c2c', border: '1px solid #2d2f45', borderRadius: '8px' }} />
                    <Line type="monotone" dataKey="users" stroke="#ff5a9a" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
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
                  {chartCoursesByCategory.length > 0 ? chartCoursesByCategory.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }}></span>
                        <span className="text-[#7a7f9a] text-sm font-semibold">{item.name} ({item.value} units)</span>
                      </div>
                    </div>
                  )) : (
                    <div className="text-[#5a5f7a] text-sm text-center py-4">No categories data</div>
                  )}
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
        </>
      )}

      {/* Registered Students Section Moved Below */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="bg-[#1a1c2c] border border-[#2d2f45] rounded-xl p-8 shadow-2xl"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <h3 className="text-2xl font-black text-white tracking-tight">Registered Students</h3>
            <p className="text-[#7a7f9a] text-sm mt-1">Manage and monitor students enrolled in your courses.</p>
          </div>
          <div className="w-full md:w-auto min-w-[300px]">
            <label className="text-[10px] text-[#7a7f9a] font-black uppercase tracking-widest mb-2 block">Filter by Course</label>
            <div className="relative">
              <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400 w-5 h-5" />
              <select
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[#131522] border border-[#2d2f45] rounded-xl text-white appearance-none focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold text-sm cursor-pointer"
              >
                <option value="">Select a course to view students</option>
                {instructorCourses.map(course => (
                  <option key={course._id} value={course._id}>{course.title}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {courseFilter ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-[#2d2f45]">
                  <th className="pb-4 text-[#7a7f9a] font-bold text-[10px] uppercase tracking-wider pl-4">Student</th>
                  <th className="pb-4 text-[#7a7f9a] font-bold text-[10px] uppercase tracking-wider">Enrollment Date</th>
                  <th className="pb-4 text-[#7a7f9a] font-bold text-[10px] uppercase tracking-wider">Payment</th>
                  <th className="pb-4 text-[#7a7f9a] font-bold text-[10px] uppercase tracking-wider text-center">Status</th>
                  <th className="pb-4 text-[#7a7f9a] font-bold text-[10px] uppercase tracking-wider text-right pr-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2d2f45]">
                {studentsLoading ? (
                  <tr>
                    <td colSpan="5" className="py-12 text-center text-[#7a7f9a]">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="font-bold text-sm">Fetching student roster...</span>
                      </div>
                    </td>
                  </tr>
                ) : courseStudents.length > 0 ? (
                  courseStudents.map((enr) => (
                    <tr key={enr._id} className="group hover:bg-[#2d2f45]/20 transition-all duration-300">
                      <td className="py-5 pl-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-indigo-500/20">
                            {enr.userId?.name?.charAt(0).toUpperCase() || 'S'}
                          </div>
                          <div>
                            <p className="text-white font-bold text-sm">{enr.userId?.name || 'Unknown Student'}</p>
                            <p className="text-[#7a7f9a] text-[10px] font-medium">{enr.userId?.email || 'No email'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-5">
                        <span className="text-white text-sm font-bold opacity-80">
                          {enr.enrolledAt ? new Date(enr.enrolledAt).toLocaleDateString() : '-'}
                        </span>
                      </td>
                      <td className="py-5">
                        <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md tracking-tighter ${enr.paymentStatus === 'completed' || enr.paymentStatus === 'free' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                          }`}>
                          {enr.paymentStatus}
                        </span>
                      </td>
                      <td className="py-5 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${enr.status === 'active' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                          }`}>
                          {enr.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-5 pr-4">
                        <div className="flex items-center justify-end gap-2 text-[10px]">
                          {enr.status === 'active' ? (
                            <button
                              onClick={() => handleEnrollmentAction('revoke', enr._id)}
                              className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded-lg transition-all font-black uppercase tracking-tighter flex items-center gap-1.5"
                              title="Revoke Access"
                            >
                              <ShieldCheck className="w-3 h-3" /> Revoke
                            </button>
                          ) : (
                            <button
                              onClick={() => handleEnrollmentAction('restore', enr._id)}
                              className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg transition-all font-black uppercase tracking-tighter flex items-center gap-1.5"
                              title="Restore Access"
                            >
                              <RotateCcw className="w-3 h-3" /> Restore
                            </button>
                          )}
                          <button
                            onClick={() => handleEnrollmentAction('delete', enr._id)}
                            className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-all font-black uppercase tracking-tighter flex items-center gap-1.5"
                            title="Delete Enrollment"
                          >
                            <Trash2 className="w-3 h-3" /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-12 text-center text-[#7a7f9a]">
                      <div className="flex flex-col items-center gap-2">
                        <Users className="w-8 h-8 opacity-20" />
                        <p className="font-bold text-sm">No students registered for this course yet.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-[#131522] border border-[#2d2f45] border-dashed rounded-2xl py-20 text-center">
            <div className="max-w-xs mx-auto">
              <UserPlus className="w-12 h-12 text-indigo-500/30 mx-auto mb-4" />
              <h4 className="text-white font-bold mb-2">Select a Course</h4>
              <p className="text-[#7a7f9a] text-xs">Choose a course from the dropdown above to manage its registered students and enrollment status.</p>
            </div>
          </div>
        )}
      </motion.div>

    </div>
  );
};

export default AdminDashboard;
