import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Shield, GraduationCap, Users, BookOpen, ArrowRight, BarChart, Briefcase, Trophy, Map } from "lucide-react";
import { toast } from 'react-hot-toast';
import { adminAuthAPI } from '../../services/adminApi';

const AdminLogin = ({ setIsAdminLoggedIn }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('adminToken');
    const role = sessionStorage.getItem('adminRole');
    if (token && role) {
      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else if (role === 'course_manager') {
        navigate('/instructor/dashboard');
      } else if (role === 'job_instructor') {
        navigate('/job-instructor/dashboard');
      } else if (role === 'hackathon_instructor') {
        navigate('/hackathon-instructor/dashboard');
      } else if (role === 'roadmap_instructor') {
        navigate('/roadmap-instructor/dashboard');
      } else if (role === 'resume_instructor') {
        navigate('/resume-instructor/dashboard');
      }
    }
  }, [navigate]);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginRole, setLoginRole] = useState("admin"); // 'admin' or 'instructor'
  const instructorRoles = ['course_manager', 'job_instructor', 'hackathon_instructor', 'roadmap_instructor', 'resume_instructor'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await adminAuthAPI.login(formData.email, formData.password);

      if (response.data.success) {
        const { token, admin } = response.data;

        // Check if role matches selected login role
        if (loginRole === 'instructor' && admin.role === 'admin') {
          toast.error('You are logging in as Instructor but have Admin privileges. Redirecting to Admin Dashboard.');
        } else if (loginRole === 'admin' && instructorRoles.includes(admin.role)) {
          toast.error(`You are logging in as Admin but only have ${admin.role.replace('_', ' ').toUpperCase()} privileges.`);
        }

        // Store token and role
        sessionStorage.setItem('adminToken', token);
        sessionStorage.setItem('adminRole', admin.role);
        sessionStorage.setItem('adminData', JSON.stringify(admin));

        setIsAdminLoggedIn(true);
        toast.success(`${admin.role === 'admin' ? 'Admin' : 'Instructor'} login successful!`);

        // Redirect based on role
        if (admin.role === 'admin') {
          navigate('/admin/dashboard');
        } else if (admin.role === 'course_manager') {
          navigate('/instructor/dashboard');
        } else if (admin.role === 'job_instructor') {
          navigate('/job-instructor/dashboard');
        } else if (admin.role === 'hackathon_instructor') {
          navigate('/hackathon-instructor/dashboard');
        } else if (admin.role === 'roadmap_instructor') {
          navigate('/roadmap-instructor/dashboard');
        } else if (admin.role === 'resume_instructor') {
          navigate('/resume-instructor/dashboard');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-900 flex flex-col items-center justify-center px-4 py-6 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.03, 0.05, 0.03]
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-slate-600/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
            opacity: [0.03, 0.05, 0.03]
          }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-slate-600/10 rounded-full blur-3xl"
        />
      </div>

      {/* Top Bar with Logo + Back */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl flex justify-between items-center mb-8 px-2 relative z-10"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="cursor-pointer"
          onClick={() => navigate("/")}
        >
          <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg">
            E-Shikshan
          </span>
        </motion.div>
        <motion.button
          whileHover={{ scale: 1.05, x: 5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/")}
          className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-2.5 rounded-full text-white text-sm hover:bg-white/20 transition-all flex items-center gap-2 shadow-lg"
        >
          Back to website
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </motion.div>

      {/* Main Card Container */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col md:flex-row w-full max-w-6xl min-h-[600px] rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl bg-gray-800/40 border border-gray-700/50 relative z-10"
      >

        {/* Left Side - Branding */}
        <div className="w-full md:w-1/2 bg-gray-800 text-white p-12 flex flex-col justify-center min-h-[300px] relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 -translate-x-32 blur-3xl" />

          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative z-10"
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="inline-block mb-4"
            >
              {loginRole === 'admin' ? (
                <Shield className="w-12 h-12 text-slate-400" />
              ) : (
                <GraduationCap className="w-12 h-12 text-blue-400" />
              )}
            </motion.div>

            <h1 className="text-4xl md:text-5xl font-bold mb-3 drop-shadow-lg">
              {loginRole === 'admin' ? 'ADMIN PORTAL' : 'INSTRUCTOR PORTAL'}
            </h1>
            <h2 className="text-xl md:text-2xl font-semibold mb-6 text-gray-300">
              Manage. Monitor. Excel.
            </h2>
            <p className="text-white/90 text-base md:text-lg leading-relaxed mb-6">
              {loginRole === 'admin'
                ? 'Access the complete management dashboard to oversee all platform operations.'
                : 'Manage your courses, track student progress, and engage with learners.'}
            </p>

            {/* Feature Pills */}
            <div className="space-y-3 mt-8">
              {(loginRole === 'admin' ? [
                { icon: Users, text: "Manage Users & Instructors" },
                { icon: BookOpen, text: "Oversee All Courses" },
                { icon: BarChart, text: "View Analytics & Reports" }
              ] : [
                { icon: BookOpen, text: "Manage Courses & Content" },
                { icon: Briefcase, text: "Post Jobs & Track Applicants" },
                { icon: Trophy, text: "Organize Hackathons" },
                { icon: Map, text: "Build Learning Roadmaps" }
              ]).map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20"
                >
                  <item.icon className={`w-5 h-5 ${loginRole === 'admin' ? 'text-slate-400' : 'text-blue-400'}`} />
                  <span className="text-sm font-medium">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-12 bg-gray-900/50 backdrop-blur-sm">
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="w-full max-w-md"
          >
            <div className="text-center md:text-left mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">
                Welcome Back! 👋
              </h2>
              <p className="text-gray-400">Enter your credentials to continue</p>
            </div>

            {/* Role Toggle */}
            <div className="flex bg-gray-800/50 rounded-xl p-1 mb-6 gap-2">
              <button
                type="button"
                onClick={() => setLoginRole('admin')}
                className={`flex-1 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${loginRole === 'admin'
                  ? 'bg-slate-700 text-white shadow-xl scale-[1.02]'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                <Shield className="w-5 h-5" />
                Admin
              </button>
              <button
                type="button"
                onClick={() => setLoginRole('instructor')}
                className={`flex-1 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${loginRole === 'instructor'
                  ? 'bg-blue-600 text-white shadow-xl scale-[1.02]'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                <GraduationCap className="w-5 h-5" />
                Instructor
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div className="relative group">
                <label className="text-white text-sm font-medium mb-2 flex items-center gap-2">
                  <Mail className={`w-4 h-4 ${loginRole === 'admin' ? 'text-slate-400' : 'text-blue-400'}`} />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder={loginRole === 'admin' ? 'admin@eshikshan.com' : 'instructor@eshikshan.com'}
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3.5 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 outline-none focus:ring-2 ${loginRole === 'admin' ? 'focus:ring-slate-500' : 'focus:ring-blue-500'
                    } focus:border-transparent transition-all`}
                />
              </div>

              {/* Password */}
              <div className="relative group">
                <label className="text-white text-sm font-medium mb-2 flex items-center gap-2">
                  <Lock className={`w-4 h-4 ${loginRole === 'admin' ? 'text-slate-400' : 'text-blue-400'}`} />
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3.5 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 outline-none focus:ring-2 ${loginRole === 'admin' ? 'focus:ring-slate-500' : 'focus:ring-blue-500'
                      } focus:border-transparent transition-all pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className={`w-full py-4 ${loginRole === 'admin'
                  ? 'bg-slate-700 hover:bg-slate-800 shadow-slate-500/20'
                  : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'
                  } text-white rounded-xl font-semibold shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
              >
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    Logging in...
                  </>
                ) : (
                  <>
                    {loginRole === 'admin' ? 'Admin Login' : 'Instructor Login'}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Security Notice */}
            <div className={`mt-6 p-3 ${loginRole === 'admin' ? 'bg-slate-500/10 border-slate-500/30' : 'bg-blue-500/10 border-blue-500/30'
              } border rounded-lg`}>
              <p className={`text-xs ${loginRole === 'admin' ? 'text-slate-300' : 'text-blue-300'
                } text-center`}>
                🔒 This is a secure {loginRole === 'admin' ? 'admin' : 'instructor'} area. All access is logged and monitored.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Footer Text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-gray-500 text-sm mt-8 text-center relative z-10"
      >
        © 2026 E-Shikshan. Empowering educators worldwide.
      </motion.p>
    </div>
  );
};

export default AdminLogin;
