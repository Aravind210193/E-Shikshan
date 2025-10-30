import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, GraduationCap, BookOpen, Trophy } from "lucide-react";
import { authAPI } from '../services/api';
import { toast } from 'react-hot-toast';

const Login = ({setIsLoggedIn}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await authAPI.login(formData);
      // Store token
      localStorage.setItem('token', response.data.token);
      // Update login state
      setIsLoggedIn(true);
      // Show success message
      toast.success('Login successful!');
      // Redirect to profile
      navigate('/profile');
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
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
          className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
            opacity: [0.03, 0.05, 0.03]
          }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"
        />
      </div>

      {/* Top Bar with Logo + Back */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl flex justify-between items-center mb-8 px-2 relative z-10"
      >
        <motion.img
          whileHover={{ scale: 1.05 }}
          src="/logo1.png"
          alt="logo"
          className="h-16 w-auto object-contain drop-shadow-lg"
        />
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
              <Sparkles className="w-12 h-12 text-blue-400" />
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-3 drop-shadow-lg">E-SHIKSHAN</h1>
            <h2 className="text-xl md:text-2xl font-semibold mb-6 text-gray-300">
              Learn. Practice. Achieve.
            </h2>
            <p className="text-white/90 text-base md:text-lg leading-relaxed mb-6">
              Your journey to mastering AI, Data Science, and Career Roadmaps starts here.
            </p>
            
            {/* Feature Pills */}
            <div className="space-y-3 mt-8">
              {[
                { icon: BookOpen, text: "Access Premium Courses" },
                { icon: Trophy, text: "Join Hackathons & Challenges" },
                { icon: GraduationCap, text: "Explore Career Roadmaps" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20"
                >
                  <item.icon className="w-5 h-5 text-blue-400" />
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
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative group">
                <label className="text-white text-sm font-medium mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-400" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3.5 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Password */}
              <div className="relative group">
                <label className="text-white text-sm font-medium mb-2 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-blue-400" />
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
                    className="w-full px-4 py-3.5 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <motion.a
                  whileHover={{ x: 5 }}
                  href="#"
                  className="text-xs text-blue-400 hover:text-blue-300 mt-2 block text-right transition-colors"
                >
                  Forgot password? →
                </motion.a>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                    Login
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <hr className="flex-1 border-gray-700" />
              <span className="text-gray-400 text-sm">or continue with</span>
              <hr className="flex-1 border-gray-700" />
            </div>

            {/* Google Login */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-3 border border-gray-700 bg-gray-800/50 py-3.5 rounded-xl text-white hover:bg-gray-800 hover:border-gray-600 transition-all"
            >
              <img
                src="https://www.svgrepo.com/show/355037/google.svg"
                alt="Google"
                className="w-5 h-5"
              />
              Sign in with Google
            </motion.button>

            {/* Signup Link */}
            <p className="text-center text-sm text-gray-400 mt-8">
              New to E-Shikshan?{" "}
              <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                Create an Account →
              </Link>
            </p>
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
        © 2025 E-Shikshan. Empowering learners worldwide.
      </motion.p>
    </div>
  );
};

export default Login;