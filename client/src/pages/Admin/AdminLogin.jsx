import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Shield } from "lucide-react";
import { toast } from 'react-hot-toast';
import { adminAuthAPI } from '../../services/adminApi';

const AdminLogin = ({ setIsAdminLoggedIn }) => {
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
      const response = await adminAuthAPI.login(formData.email, formData.password);
      
      if (response.data.success) {
        const { token, admin } = response.data;
        
        // Store token and role
        localStorage.setItem('adminToken', token);
        localStorage.setItem('adminRole', admin.role);
        localStorage.setItem('adminData', JSON.stringify(admin));
        
        setIsAdminLoggedIn(true);
        toast.success(`${admin.role === 'admin' ? 'Admin' : 'Course Manager'} login successful!`);
        
        // Redirect based on role
        if (admin.role === 'admin') {
          navigate('/admin/dashboard');
        } else if (admin.role === 'course_manager') {
          navigate('/admin/courses');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-900 flex items-center justify-center px-4 py-6 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.03, 0.05, 0.03] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/10 rounded-full blur-3xl"
        />
      </div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-gray-800 rounded-3xl shadow-2xl p-8 border border-gray-700">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-full mb-4"
            >
              <Shield className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
            <p className="text-gray-400">E-Shikshan Management System</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="relative group">
              <label className="text-white text-sm font-medium mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4 text-red-400" />
                Admin Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="admin@eshikshan.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3.5 rounded-xl bg-gray-700 border border-gray-600 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Password */}
            <div className="relative group">
              <label className="text-white text-sm font-medium mb-2 flex items-center gap-2">
                <Lock className="w-4 h-4 text-red-400" />
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
                  className="w-full px-4 py-3.5 rounded-xl bg-gray-700 border border-gray-600 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all pr-12"
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
              className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold shadow-lg shadow-red-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  Authenticating...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  Admin Login
                </>
              )}
            </motion.button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-red-900/20 border border-red-500/30 rounded-xl">
            <p className="text-xs text-red-300 text-center">
              🔒 This is a secure admin area. All access is logged and monitored.
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <motion.button
          whileHover={{ x: -5 }}
          onClick={() => navigate('/')}
          className="mt-4 text-gray-400 hover:text-white text-sm flex items-center gap-2 mx-auto"
        >
          ← Back to Homepage
        </motion.button>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
