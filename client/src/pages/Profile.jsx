import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI, coursesAPI, achievementsAPI } from '../services/api';
import {
  Book,
  Award,
  Trophy,
  Bookmark,
  Star,
  BarChart2,
  FileText,
  User,
  Mail,
  Phone,
  Calendar,
  GraduationCap,
  Building,
  Code,
  Brain,
  Target,
  Loader
} from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Get the token from localStorage
        const token = localStorage.getItem('token');
        
        if (!token) {
          navigate('/login');
          return;
        }

        // First, try to fetch just the user profile
        const profileResponse = await authAPI.getProfile();
        
        // Initialize user data with profile response
        const userData = {
          ...profileResponse.data,
          achievements: [],
          enrolledCourses: [],
          completedCourses: 0,
          ongoingCourses: 0,
          certificates: 0
        };
        
        setUser(userData);
        
        // Then try to fetch additional data
        try {
          const coursesResponse = await coursesAPI.getEnrolled();
          userData.enrolledCourses = coursesResponse.data;
          userData.completedCourses = coursesResponse.data.filter(course => course.progress === 100).length;
          userData.ongoingCourses = coursesResponse.data.filter(course => course.progress < 100).length;
          setUser({...userData});
        } catch (courseErr) {
          console.warn('Could not fetch courses:', courseErr);
        }
        
        try {
          const achievementsResponse = await achievementsAPI.getAll();
          userData.achievements = achievementsResponse.data;
          userData.certificates = achievementsResponse.data.filter(ach => ach.type === 'certificate').length;
          setUser({...userData});
        } catch (achievementErr) {
          console.warn('Could not fetch achievements:', achievementErr);
        }
        
      } catch (err) {
        setError(err.message);
        console.error('Error fetching profile:', err);
        // If unauthorized, redirect to login
        if (err.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const [activeTab, setActiveTab] = useState('overview');

  const ProgressBar = ({ value }) => (
    <div className="w-full bg-gray-700 rounded-full h-2">
      <div
        className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full"
        style={{ width: `${value}%` }}
      />
    </div>
  );

  const StatCard = ({ icon: Icon, label, value }) => (
    <div className="bg-gray-800/50 rounded-xl p-4 flex items-center gap-4 hover:bg-gray-700/50 transition-colors">
      <div className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg p-3">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <h3 className="text-gray-400 text-sm">{label}</h3>
        <p className="text-white text-lg font-semibold">{value}</p>
      </div>
    </div>
  );

  const TabButton = ({ id, label, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
        activeTab === id
          ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
          : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
      } transition-all duration-200`}
    >
      <Icon className="w-5 h-5" />
      {label}
    </button>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader className="w-6 h-6 animate-spin text-pink-500" />
          <span>Loading profile...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-center">
        <div className="bg-red-500/10 text-red-500 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Profile Not Found</h2>
          <p className="text-gray-400 mb-4">Please login to view your profile</p>
          <Link
            to="/login"
            className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-2 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-300"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-gray-800/30 rounded-2xl p-6 mb-8 backdrop-blur-sm border border-gray-700/50">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-4xl font-bold">
              {user.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-300">
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-pink-500" />
                  {user.email}
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-pink-500" />
                  {user.phone}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-pink-500" />
                  Joined {user.joinedDate}
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-pink-500" />
                  {user.semester} Semester
                </div>
                <div className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-pink-500" />
                  {user.university}
                </div>
                <div className="flex items-center gap-2">
                  <Book className="w-5 h-5 text-pink-500" />
                  {user.department}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Book} label="Completed Courses" value={user.completedCourses} />
          <StatCard icon={Target} label="Ongoing Courses" value={user.ongoingCourses} />
          <StatCard icon={Award} label="Certificates" value={user.certificates} />
          <StatCard icon={Trophy} label="Achievements" value={user.achievements} />
        </div>

        {/* Main Content */}
        <div className="bg-gray-800/30 rounded-2xl backdrop-blur-sm border border-gray-700/50">
          {/* Tabs */}
          <div className="border-b border-gray-700/50 p-4">
            <div className="flex flex-wrap gap-2">
              <TabButton id="overview" label="Overview" icon={BarChart2} />
              <TabButton id="courses" label="Enrolled Courses" icon={Book} />
              <TabButton id="achievements" label="Achievements" icon={Trophy} />
              <TabButton id="skills" label="Skills & Expertise" icon={Brain} />
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Activity */}
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                  <div className="space-y-4">
                    {user.enrolledCourses.map((course, index) => (
                      <div key={index} className="bg-gray-800/50 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-medium">{course.name}</h3>
                          <span className="text-sm text-gray-400">{course.progress}%</span>
                        </div>
                        <ProgressBar value={course.progress} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Achievements */}
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold mb-4">Recent Achievements</h2>
                  <div className="space-y-4">
                    {user.achievements.map((achievement, index) => (
                      <div key={index} className="bg-gray-800/50 rounded-lg p-4">
                        <div className="flex items-start gap-4">
                          <div className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg p-2">
                            <Trophy className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-medium">{achievement.title}</h3>
                            <p className="text-sm text-gray-400">{achievement.description}</p>
                            <p className="text-sm text-pink-500 mt-1">{achievement.date}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'courses' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {user.enrolledCourses.map((course, index) => (
                  <div key={index} className="bg-gray-800/50 rounded-xl p-6 hover:bg-gray-700/50 transition-colors">
                    <h3 className="font-semibold mb-4">{course.name}</h3>
                    <ProgressBar value={course.progress} />
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-sm text-gray-400">Progress: {course.progress}%</span>
                      <Link
                        to="/courses/{course.name}"
                        className="text-pink-500 hover:text-pink-400 text-sm font-medium"
                      >
                        Continue →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'achievements' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {user.achievements.map((achievement, index) => (
                  <div key={index} className="bg-gray-800/50 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg p-3">
                        <Trophy className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{achievement.title}</h3>
                        <p className="text-gray-400 mt-2">{achievement.description}</p>
                        <p className="text-sm text-pink-500 mt-2">{achievement.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'skills' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-semibold mb-6">Technical Skills</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {user.skills.map((skill, index) => (
                      <div
                        key={index}
                        className="bg-gray-800/50 rounded-lg px-4 py-3 flex items-center gap-2"
                      >
                        <Code className="w-5 h-5 text-pink-500" />
                        <span>{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-6">Learning Path Progress</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-800/50 rounded-xl p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium">Frontend Development</h3>
                        <span className="text-sm text-gray-400">75%</span>
                      </div>
                      <ProgressBar value={75} />
                    </div>
                    <div className="bg-gray-800/50 rounded-xl p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium">Machine Learning</h3>
                        <span className="text-sm text-gray-400">60%</span>
                      </div>
                      <ProgressBar value={60} />
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-6">Certifications</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-gray-800/50 rounded-xl p-6 hover:bg-gray-700/50 transition-colors">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg p-3">
                          <Award className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-medium">Web Development</h3>
                          <p className="text-sm text-gray-400">Intermediate Level</p>
                        </div>
                      </div>
                      <Link
                        to="/certificates/web-dev"
                        className="text-pink-500 hover:text-pink-400 text-sm font-medium"
                      >
                        View Certificate →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;