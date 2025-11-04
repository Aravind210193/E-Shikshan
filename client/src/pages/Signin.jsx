import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-hot-toast';

const Signin = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    university: "",
    department: "",
    semester: "",
    agree: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!formData.agree) {
      toast.error('Please agree to the terms and conditions');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          university: formData.university,
          department: formData.department,
          semester: formData.semester
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      localStorage.setItem('token', data.token);
      if (setIsLoggedIn) {
        setIsLoggedIn(true);
      }
      toast.success('Registration successful! Welcome to E-Shikshan');
      navigate('/profile');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2d2b42] to-[#1d1b29] p-4 md:p-6">
      <div className="flex flex-col md:flex-row w-full max-w-6xl mx-auto rounded-2xl shadow-2xl overflow-hidden bg-[#1d1b29] border border-purple-500/20">

        {/* Left Side - Image Panel */}
        <div className="w-full md:w-5/12 lg:w-1/2 relative">
          <img
            src="src/assets/login.jpeg"
            alt="E-Shikshan"
            className="w-full h-64 md:h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-between p-6 md:p-8">
            <div className="flex justify-between items-center">
              <h1 className="text-white text-2xl md:text-3xl font-bold tracking-wider">
                E-SHIKSHAN
              </h1>
              <button
                onClick={() => navigate("/")}
                className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-medium hover:bg-white/30 transition-all duration-300 flex items-center gap-1"
              >
                <span>Home</span> <span>→</span>
              </button>
            </div>
            <div className="mt-auto">
              <p className="text-white text-2xl md:text-4xl font-bold leading-tight mb-2">
                Start Your Learning Journey Today
              </p>
              <p className="text-gray-300 text-base md:text-lg">
                Join thousands of students enhancing their skills through our platform
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Form Panel */}
        <div className="w-full md:w-7/12 lg:w-1/2 p-6 md:p-10 bg-[#1d1b29] relative">
          {/* Decorative element */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-purple-600/20 to-transparent rounded-bl-full -z-10"></div>
          
          {/* Form Header */}
          <div className="mb-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Create an Account</h2>
            <p className="text-gray-400">Join our community and start your learning journey</p>
          </div>

          {/* Tabs */}
          <div className="flex items-center justify-center gap-8 mb-8">
            <Link to="/signup" className="text-lg font-bold text-white border-b-2 border-purple-500 pb-1 px-2">
              Register
            </Link>
            <Link to="/login" className="text-lg font-bold text-gray-400 hover:text-gray-200 transition-colors pb-1 px-2">
              Login
            </Link>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Personal Information Section */}
            <div className="mb-4">
              <h3 className="text-white text-sm font-medium mb-3 uppercase tracking-wider">Personal Information</h3>
              
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-1 relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">👤</span>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#2b273d] text-white placeholder-gray-400 outline-none border border-transparent focus:border-purple-500 transition-colors"
                  />
                </div>
                <div className="flex-1 relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">👤</span>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#2b273d] text-white placeholder-gray-400 outline-none border border-transparent focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>

              <div className="relative mb-4">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">✉️</span>
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#2b273d] text-white placeholder-gray-400 outline-none border border-transparent focus:border-purple-500 transition-colors"
                />
              </div>

              <div className="relative mb-4">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">📞</span>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#2b273d] text-white placeholder-gray-400 outline-none border border-transparent focus:border-purple-500 transition-colors"
                />
              </div>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔒</span>
                <input
                  type="password"
                  name="password"
                  placeholder="Create password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#2b273d] text-white placeholder-gray-400 outline-none border border-transparent focus:border-purple-500 transition-colors"
                />
              </div>
            </div>

            {/* Educational Information Section */}
            <div className="mb-4">
              <h3 className="text-white text-sm font-medium mb-3 uppercase tracking-wider">Educational Information</h3>
              
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-1 relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🏫</span>
                  <input
                    type="text"
                    name="university"
                    placeholder="University/College"
                    value={formData.university}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#2b273d] text-white placeholder-gray-400 outline-none border border-transparent focus:border-purple-500 transition-colors"
                  />
                </div>
                <div className="flex-1 relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">📚</span>
                  <input
                    type="text"
                    name="department"
                    placeholder="Department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#2b273d] text-white placeholder-gray-400 outline-none border border-transparent focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🎓</span>
                <input
                  type="text"
                  name="semester"
                  placeholder="Semester (e.g., 1st, 2nd, 3rd)"
                  value={formData.semester}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#2b273d] text-white placeholder-gray-400 outline-none border border-transparent focus:border-purple-500 transition-colors"
                />
              </div>
            </div>

            <label className="flex items-start md:items-center text-gray-300 text-sm">
              <input
                type="checkbox"
                name="agree"
                checked={formData.agree}
                onChange={handleChange}
                className="mr-3 mt-1 md:mt-0 h-4 w-4 accent-purple-500"
              />
              <span>
                I agree to the{" "}
                <a href="#" className="text-purple-400 hover:text-purple-300 hover:underline transition-colors">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-purple-400 hover:text-purple-300 hover:underline transition-colors">
                  Privacy Policy
                </a>
              </span>
            </label>

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold text-lg mt-6 transform transition-all duration-300 hover:scale-[1.01] active:scale-[0.98] shadow-lg"
            >
              Create Account
            </button>
          </form>

          <p className="text-gray-400 text-sm flex items-center justify-center mt-5 mb-4">
            Already have an account?{" "}
            <Link to="/login" className="text-purple-400 hover:underline ml-1">
              Log in
            </Link>
          </p>

          <div className="flex items-center gap-2 mb-4">
            <hr className="flex-1 border-gray-600" />
            <span className="text-gray-400 text-sm">Or register with</span>
            <hr className="flex-1 border-gray-600" />
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <button className="flex-1 border border-gray-600 p-2 rounded-md text-white hover:bg-gray-700">
              🌐 Google
            </button>
            <button className="flex-1 border border-gray-600 p-2 rounded-md text-white hover:bg-gray-700">
               Apple
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
