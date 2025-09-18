import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authAPI } from '../services/api';
import { toast } from 'react-hot-toast';

const Login = ({setIsLoggedIn}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

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
    <div className="min-h-screen w-full bg-gray-900 flex flex-col items-center justify-center px-4 py-6">
      {/* Top Bar with Logo + Back */}
      <div className="w-full max-w-6xl flex justify-between items-center mb-6 px-2">
        <img src="/logo1.png" alt="logo" className="h-14 w-auto object-contain" />
        <button
          onClick={() => navigate("/")}
          className="bg-white/20 px-4 py-2 rounded-full text-white text-sm hover:bg-white/30 transition"
        >
          Back to website →
        </button>
      </div>

      {/* Main Card Container */}
      <div className="flex flex-col md:flex-row w-full max-w-6xl min-h-[500px] rounded-2xl shadow-2xl overflow-hidden backdrop-blur-lg bg-[#1d1b29]">
        
        {/* Left Side - Branding */}
        <div className="w-full md:w-1/2 bg-gray-800 text-white p-8 flex flex-col justify-center min-h-[250px]">
          <h1 className="text-3xl md:text-4xl font-bold">E-SHIKSHAN</h1>
          <h2 className="text-lg md:text-xl font-semibold mt-2">
            Learn. Practice. Achieve.
          </h2>
          <p className="mt-4 text-gray-200 text-base md:text-lg leading-relaxed">
            Your journey to mastering AI, Data Science, and Roadmaps starts here.
          </p>
          <p className="text-gray-300 text-sm md:text-base mt-3">
            Unlock videos, roadmaps, job details and challenges – all in one place.
          </p>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-10 bg-gray-900">
          <div className="w-full max-w-md">
            <h2 className="text-2xl font-bold text-white mb-6 text-center md:text-left">
              Welcome Back 👋
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-white text-sm mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-md bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-white text-sm mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-md bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-blue-400"
                />
                <a
                  href="#"
                  className="text-xs text-blue-300 hover:underline mt-1 block text-right"
                >
                  Forgot password?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-semibold shadow-md transition disabled:bg-blue-400"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-2 my-6">
              <hr className="flex-1 border-gray-600" />
              <span className="text-white text-sm">or</span>
              <hr className="flex-1 border-gray-600" />
            </div>

            {/* Google Login */}
            <button className="w-full flex items-center justify-center gap-2 border border-gray-600 py-3 rounded-md text-white hover:bg-white/10 transition">
              <img
                src="https://www.svgrepo.com/show/355037/google.svg"
                alt="Google"
                className="w-5 h-5"
              />
              Sign in with Google
            </button>

            {/* Signup Link */}
            <p className="text-center text-sm text-gray-300 mt-6">
              New here?{" "}
              <Link to="/signup" className="text-blue-300 hover:underline">
                Create an Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;