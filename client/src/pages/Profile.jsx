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
  Loader,
  ArrowRight,
  Edit,
  MapPin,
  Briefcase,
  Languages,
  Globe,
  Check,
  Shield,
  GitBranch
} from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  useEffect(() => {
    const fetchUserProfile = async (retry = 0) => {
      try {
        console.log('Starting to fetch profile data...');
        // Get the token from localStorage
        const token = localStorage.getItem('token');
        
        if (!token) {
          console.log('No token found, redirecting to login');
          navigate('/login');
          return;
        }

        // Default values for missing data
        const defaultSkills = [
          'HTML/CSS', 'JavaScript', 'React.js', 'Node.js', 'MongoDB', 'Python', 'Git'
        ];
        
        const defaultAchievements = [
          { 
            id: 1,
            title: 'First Course Completed',
            description: 'Completed your first course on the platform',
            date: 'August 15, 2025',
            type: 'achievement'
          },
          { 
            id: 2,
            title: 'Web Development Certificate',
            description: 'Successfully completed the web development course',
            date: 'August 30, 2025',
            type: 'certificate'
          }
        ];
        
        const defaultCourses = [
          {
            id: 1,
            name: 'Web Development Fundamentals',
            progress: 100,
            completed: true
          },
          {
            id: 2,
            name: 'React.js - From Zero to Expert',
            progress: 65,
            completed: false
          },
          {
            id: 3,
            name: 'Node.js Backend Development',
            progress: 25,
            completed: false
          }
        ];

        // Initialize with default data first
        let userData = {
          name: 'Student User',
          email: 'student@example.com',
          phone: '123-456-7890',
          university: 'Example University',
          department: 'Computer Science',
          semester: '5th',
          role: 'student',
          joinedDate: new Date(),
          achievements: defaultAchievements,
          enrolledCourses: defaultCourses,
          completedCourses: defaultCourses.filter(course => course.progress === 100).length,
          ongoingCourses: defaultCourses.filter(course => course.progress < 100).length,
          certificates: defaultAchievements.filter(ach => ach.type === 'certificate').length,
          skills: defaultSkills,
          bio: "Hi there! I'm a student passionate about learning new technologies and enhancing my skills through E-Shikshan."
        };
        
        // First, try to fetch user profile
        try {
          console.log('Fetching user profile...');
          const profileResponse = await authAPI.getProfile();
          console.log('Profile response:', profileResponse);
          
          // Update userData with actual profile data
          userData = {
            ...userData,
            ...profileResponse.data,
            role: profileResponse.data.role || 'student',
            bio: profileResponse.data.bio || userData.bio
          };
        } catch (profileErr) {
          console.error('Error fetching profile:', profileErr);
          if (profileErr.response) {
            console.error('Error response:', profileErr.response.status, profileErr.response.data);
          } else if (profileErr.request) {
            console.error('No response received:', profileErr.request);
          } else {
            console.error('Error setting up request:', profileErr.message);
          }
          
          // Try to retry if we haven't reached the max retry count
          if (retry < maxRetries && !profileErr.response) {
            console.log(`Retrying profile fetch (${retry + 1}/${maxRetries})...`);
            setRetryCount(retry + 1);
            setTimeout(() => fetchUserProfile(retry + 1), 1500); // Wait 1.5s before retry
            return;
          }
          
          // Show a user-friendly message about using default data
          console.log('Using fallback profile data since the API request failed');
          // If server is not running or we've reached max retries, just use default data
          setUser(userData);
          setLoading(false);
          return;
        }
        
        setUser(userData);
        
        // Then try to fetch additional data
        try {
          console.log('Fetching enrolled courses...');
          const coursesResponse = await coursesAPI.getEnrolled();
          console.log('Courses response:', coursesResponse);
          
          if (coursesResponse.data && coursesResponse.data.length) {
            userData.enrolledCourses = coursesResponse.data;
            userData.completedCourses = coursesResponse.data.filter(course => course.progress === 100).length;
            userData.ongoingCourses = coursesResponse.data.filter(course => course.progress < 100).length;
            setUser({...userData});
          }
        } catch (courseErr) {
          console.warn('Could not fetch courses:', courseErr);
          if (courseErr.response) {
            console.warn('Course error response:', courseErr.response.status, courseErr.response.data);
          } else {
            console.warn('Using default course data');
          }
        }
        
        try {
          console.log('Fetching achievements...');
          const achievementsResponse = await achievementsAPI.getAll();
          console.log('Achievements response:', achievementsResponse);
          
          if (achievementsResponse.data && achievementsResponse.data.length) {
            userData.achievements = achievementsResponse.data;
            userData.certificates = userData.achievements.filter(ach => ach.type === 'certificate').length;
            setUser({...userData});
          }
        } catch (achievementErr) {
          console.warn('Could not fetch achievements:', achievementErr);
          if (achievementErr.response) {
            console.warn('Achievement error response:', achievementErr.response.status, achievementErr.response.data);
          } else {
            console.warn('Using default achievement data');
          }
        }
        
      } catch (err) {
        console.error('General error in profile fetch:', err);
        if (err.response) {
          setError(`Error ${err.response.status}: ${err.response.data.message || 'Unknown error'}`);
        } else {
          setError(err.message || 'Unknown error occurred');
        }
        
        // If unauthorized, redirect to login
        if (err.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile(retryCount);
  }, [navigate, retryCount]);

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
        <div className="bg-red-500/10 text-red-500 p-6 rounded-lg max-w-md w-full">
          <div className="text-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-xl font-semibold mt-2">Error Loading Profile</h2>
          </div>
          <p className="text-gray-300 mb-4">
            {error}
          </p>
          <div className="flex flex-col gap-2">
            <button 
              onClick={() => window.location.reload()}
              className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-300 px-4 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
            <Link 
              to="/" 
              className="w-full bg-gray-800/50 hover:bg-gray-700/50 px-4 py-2 rounded-lg text-center transition-colors"
            >
              Return to Home
            </Link>
          </div>
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
        {/* Header Section with Profile Banner */}
        <div className="relative bg-gray-800/30 rounded-2xl overflow-hidden mb-8 backdrop-blur-sm border border-gray-700/50">
          {/* Profile Banner */}
          <div className="h-48 bg-gradient-to-r from-purple-900 to-pink-900 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ij48cGF0aCBkPSJNMzYgMzRoLTJWMGgydjM0em0tNCAwVjBoLTJ2MzRoMnptLTYtMmgtMlYwaDF2MzJoMXpNMjIgMzBoLTJWMGgydjMwem0tNCAwVjBoLTJ2MzBoMnptLTYgMGgtMlYwaDF2MzBoMXptLTYtMmgtMlYwaDF2MjhoMXptLTYtMmgtMlYwaDJ2MjZ6TTAgMjRoMnYySDAnIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
            <div className="absolute bottom-0 right-0 p-4">
              <button className="bg-black/30 hover:bg-black/50 text-white text-xs py-1 px-3 rounded-md flex items-center gap-1 backdrop-blur-sm border border-white/10 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                Edit Banner
              </button>
            </div>
          </div>
          
          {/* Profile Info */}
          <div className="p-6 pt-0 relative">
            {/* Avatar with edit button overlay */}
            <div className="relative -mt-16 mb-4 inline-block">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-4xl font-bold border-4 border-gray-800 shadow-xl">
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
              <button className="absolute bottom-1 right-1 bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-full border border-gray-700 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
              </button>
            </div>
            
            {/* Profile completion indicator */}
            <div className="absolute top-6 right-6 bg-gray-800/70 rounded-lg p-3 backdrop-blur-sm border border-gray-700/50">
              <div className="flex items-center gap-2 mb-2">
                <div className="text-sm font-medium">Profile Completion</div>
                <div className="text-pink-500 font-semibold">85%</div>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full" style={{ width: "85%" }}></div>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 items-start mt-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <h1 className="text-3xl font-bold">{user.name}</h1>
                  {user.role === 'student' && (
                    <span className="bg-blue-900/50 text-blue-300 px-3 py-1 rounded-full text-xs font-medium border border-blue-500/30">Student</span>
                  )}
                  {user.role === 'faculty' && (
                    <span className="bg-purple-900/50 text-purple-300 px-3 py-1 rounded-full text-xs font-medium border border-purple-500/30">Faculty</span>
                  )}
                  {user.role === 'admin' && (
                    <span className="bg-red-900/50 text-red-300 px-3 py-1 rounded-full text-xs font-medium border border-red-500/30">Admin</span>
                  )}
                </div>
                
                <p className="text-gray-300 mb-6 max-w-3xl">
                  {user.bio || "Hi there! I'm a student passionate about learning new technologies and enhancing my skills through E-Shikshan. Currently focusing on web development and machine learning."}
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-300">
                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-pink-500" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-pink-500" />
                    <span>{user.phone || "Not provided"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-pink-500" />
                    <span>Joined {new Date(user.joinedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-pink-500" />
                    <span>{user.semester || "Not specified"} Semester</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building className="w-5 h-5 text-pink-500" />
                    <span>{user.university || "Not specified"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Book className="w-5 h-5 text-pink-500" />
                    <span>{user.department || "Not specified"}</span>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col gap-3 min-w-[120px]">
                <button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all">
                  Edit Profile
                </button>
                <button className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-all border border-gray-700">
                  Settings
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Book} label="Completed Courses" value={user.completedCourses || 0} />
          <StatCard icon={Target} label="Ongoing Courses" value={user.ongoingCourses || 0} />
          <StatCard icon={Award} label="Certificates" value={user.certificates || 0} />
          <StatCard icon={Trophy} label="Achievements" value={user.achievements?.length || 0} />
        </div>
        
        {/* Quick Access */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Resume Builder */}
          <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl p-6 border border-blue-500/20 hover:border-blue-500/40 transition-all group">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <FileText className="w-6 h-6 text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">Resume Builder</h3>
                <p className="text-gray-400 mb-4 text-sm">Create and update your professional resume with our AI-powered tools.</p>
                <Link to="/resume-building" className="inline-flex items-center text-blue-400 text-sm font-medium group-hover:text-blue-300 transition-colors">
                  Build Resume <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
          
          {/* Skill Assessment */}
          <div className="bg-gradient-to-br from-pink-900/30 to-purple-900/30 rounded-xl p-6 border border-pink-500/20 hover:border-pink-500/40 transition-all group">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-pink-500/20 rounded-lg">
                <Brain className="w-6 h-6 text-pink-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">Skill Assessment</h3>
                <p className="text-gray-400 mb-4 text-sm">Take assessments to validate your skills and earn verified badges.</p>
                <Link to="/assessments" className="inline-flex items-center text-pink-400 text-sm font-medium group-hover:text-pink-300 transition-colors">
                  Start Assessment <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
          
          {/* Learning Paths */}
          <div className="bg-gradient-to-br from-green-900/30 to-blue-900/30 rounded-xl p-6 border border-green-500/20 hover:border-green-500/40 transition-all group">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <Target className="w-6 h-6 text-green-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">Learning Paths</h3>
                <p className="text-gray-400 mb-4 text-sm">Follow structured learning paths to master new skills systematically.</p>
                <Link to="/roadmaps" className="inline-flex items-center text-green-400 text-sm font-medium group-hover:text-green-300 transition-colors">
                  Explore Paths <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-gray-800/30 rounded-2xl backdrop-blur-sm border border-gray-700/50">
          {/* Tabs */}
          <div className="border-b border-gray-700/50 p-4">
            <div className="flex flex-wrap gap-3">
              <TabButton id="overview" label="Overview" icon={BarChart2} />
              <TabButton id="personal" label="Personal Info" icon={User} />
              <TabButton id="courses" label="Enrolled Courses" icon={Book} />
              <TabButton id="achievements" label="Achievements" icon={Trophy} />
              <TabButton id="skills" label="Skills & Expertise" icon={Brain} />
              <TabButton id="bookmarks" label="Bookmarks" icon={Bookmark} />
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

            {activeTab === 'personal' && (
              <div className="space-y-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Personal Information</h2>
                  <button className="flex items-center gap-2 text-sm text-pink-500 hover:text-pink-400 transition-colors">
                    <Edit size={14} />
                    Edit Information
                  </button>
                </div>
                
                {/* Basic Information */}
                <div className="bg-gray-800/40 rounded-xl p-6 border border-gray-700/50">
                  <h3 className="text-lg font-semibold mb-4 text-pink-400">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10">
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Full Name</div>
                      <div className="font-medium">{user.name}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Email Address</div>
                      <div className="font-medium">{user.email}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Phone Number</div>
                      <div className="font-medium">{user.phone || "Not provided"}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Date of Birth</div>
                      <div className="font-medium">{user.dateOfBirth || "Not provided"}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Gender</div>
                      <div className="font-medium">{user.gender || "Not specified"}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Location</div>
                      <div className="font-medium flex items-center gap-1">
                        <MapPin size={14} className="text-gray-500" />
                        {user.location || "Not provided"}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Education Information */}
                <div className="bg-gray-800/40 rounded-xl p-6 border border-gray-700/50">
                  <h3 className="text-lg font-semibold mb-4 text-blue-400">Education</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10">
                    <div>
                      <div className="text-sm text-gray-400 mb-1">University/College</div>
                      <div className="font-medium">{user.university || "Not specified"}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Department/Major</div>
                      <div className="font-medium">{user.department || "Not specified"}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Degree</div>
                      <div className="font-medium">{user.degree || "Not specified"}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Semester</div>
                      <div className="font-medium">{user.semester || "Not specified"}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Year of Study</div>
                      <div className="font-medium">{user.yearOfStudy || "Not specified"}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Expected Graduation</div>
                      <div className="font-medium">{user.graduationYear || "Not specified"}</div>
                    </div>
                  </div>
                </div>
                
                {/* Professional Information */}
                <div className="bg-gray-800/40 rounded-xl p-6 border border-gray-700/50">
                  <h3 className="text-lg font-semibold mb-4 text-green-400">Professional</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10">
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Current Position</div>
                      <div className="font-medium flex items-center gap-1">
                        <Briefcase size={14} className="text-gray-500" />
                        {user.currentPosition || "Not specified"}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Company/Organization</div>
                      <div className="font-medium">{user.company || "Not specified"}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Work Experience</div>
                      <div className="font-medium">{user.workExperience || "Not specified"}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Industry</div>
                      <div className="font-medium">{user.industry || "Not specified"}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Languages</div>
                      <div className="font-medium flex items-center gap-1">
                        <Languages size={14} className="text-gray-500" />
                        {user.languages || "Not specified"}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Personal Website</div>
                      <div className="font-medium flex items-center gap-1">
                        <Globe size={14} className="text-gray-500" />
                        {user.website ? (
                          <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline truncate">
                            {user.website.replace(/^https?:\/\//, '')}
                          </a>
                        ) : (
                          "Not specified"
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Account Information */}
                <div className="bg-gray-800/40 rounded-xl p-6 border border-gray-700/50">
                  <h3 className="text-lg font-semibold mb-4 text-purple-400">Account</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10">
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Account Type</div>
                      <div className="font-medium capitalize">{user.role || "Student"}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Joined</div>
                      <div className="font-medium">{new Date(user.joinedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Last Login</div>
                      <div className="font-medium">{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : "Not available"}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Account Status</div>
                      <div className="font-medium flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        Active
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'bookmarks' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-6">Your Bookmarked Content</h2>
                
                {/* Tabs for bookmark categories */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <button className="px-4 py-1.5 bg-pink-500 text-white rounded-lg text-sm">All Items</button>
                  <button className="px-4 py-1.5 bg-gray-800 text-gray-300 rounded-lg text-sm hover:bg-gray-700 transition-colors">Courses</button>
                  <button className="px-4 py-1.5 bg-gray-800 text-gray-300 rounded-lg text-sm hover:bg-gray-700 transition-colors">Articles</button>
                  <button className="px-4 py-1.5 bg-gray-800 text-gray-300 rounded-lg text-sm hover:bg-gray-700 transition-colors">Videos</button>
                  <button className="px-4 py-1.5 bg-gray-800 text-gray-300 rounded-lg text-sm hover:bg-gray-700 transition-colors">Roadmaps</button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Bookmark Cards - These would come from user's bookmarked content */}
                  <div className="bg-gray-800/40 rounded-xl overflow-hidden border border-gray-700/50 hover:border-pink-500/30 transition-all">
                    <div className="h-32 bg-gradient-to-br from-blue-900 to-purple-900 relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Book className="w-8 h-8 text-white/70" />
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-pink-500 font-medium">Course</span>
                        <button className="text-gray-400 hover:text-white">
                          <Bookmark className="w-4 h-4 fill-current" />
                        </button>
                      </div>
                      <h3 className="font-semibold mb-2 line-clamp-1">React: From Zero to Expert</h3>
                      <p className="text-sm text-gray-400 mb-3 line-clamp-2">Learn React.js from scratch and build professional single-page applications.</p>
                      <Link to="/courses/react" className="text-blue-400 text-sm hover:text-blue-300 transition-colors">View Course →</Link>
                    </div>
                  </div>
                  
                  <div className="bg-gray-800/40 rounded-xl overflow-hidden border border-gray-700/50 hover:border-pink-500/30 transition-all">
                    <div className="h-32 bg-gradient-to-br from-pink-900 to-red-900 relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <FileText className="w-8 h-8 text-white/70" />
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-pink-500 font-medium">Article</span>
                        <button className="text-gray-400 hover:text-white">
                          <Bookmark className="w-4 h-4 fill-current" />
                        </button>
                      </div>
                      <h3 className="font-semibold mb-2 line-clamp-1">10 Advanced JavaScript Concepts</h3>
                      <p className="text-sm text-gray-400 mb-3 line-clamp-2">Master these advanced JavaScript concepts to take your development skills to the next level.</p>
                      <Link to="/articles/advanced-js" className="text-blue-400 text-sm hover:text-blue-300 transition-colors">Read Article →</Link>
                    </div>
                  </div>
                  
                  <div className="bg-gray-800/40 rounded-xl overflow-hidden border border-gray-700/50 hover:border-pink-500/30 transition-all">
                    <div className="h-32 bg-gradient-to-br from-green-900 to-blue-900 relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Target className="w-8 h-8 text-white/70" />
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-pink-500 font-medium">Roadmap</span>
                        <button className="text-gray-400 hover:text-white">
                          <Bookmark className="w-4 h-4 fill-current" />
                        </button>
                      </div>
                      <h3 className="font-semibold mb-2 line-clamp-1">Full-Stack Development Path</h3>
                      <p className="text-sm text-gray-400 mb-3 line-clamp-2">A comprehensive guide to becoming a full-stack developer with both frontend and backend skills.</p>
                      <Link to="/roadmaps/full-stack" className="text-blue-400 text-sm hover:text-blue-300 transition-colors">View Roadmap →</Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'skills' && (
              <div className="space-y-8">
                {/* Skill Assessment Summary */}
                <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 rounded-xl p-6 border border-gray-700/50">
                  <div className="flex flex-col md:flex-row justify-between gap-6 items-start md:items-center">
                    <div>
                      <h2 className="text-xl font-semibold mb-2">Skill Assessment</h2>
                      <p className="text-gray-400 text-sm">Complete skill assessments to earn verified skill badges for your profile.</p>
                    </div>
                    <button className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg text-white text-sm hover:from-pink-600 hover:to-purple-700 transition-all whitespace-nowrap">
                      Take Assessment
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <div className="bg-gray-800/70 rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-1">3</div>
                      <div className="text-sm text-gray-400">Verified Skills</div>
                    </div>
                    <div className="bg-gray-800/70 rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 mb-1">65%</div>
                      <div className="text-sm text-gray-400">Avg. Score</div>
                    </div>
                    <div className="bg-gray-800/70 rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-400 mb-1">8</div>
                      <div className="text-sm text-gray-400">Skill Points</div>
                    </div>
                    <div className="bg-gray-800/70 rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-400 mb-1">2</div>
                      <div className="text-sm text-gray-400">Badges Earned</div>
                    </div>
                  </div>
                </div>

                {/* Technical Skills */}
                <div>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Code className="w-5 h-5 text-pink-500" />
                    Technical Skills
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {/* Since user.skills might not exist in your model, I'm creating some example skills */}
                    {(user.skills || ['HTML/CSS', 'JavaScript', 'React.js', 'Node.js', 'MongoDB', 'Python', 'Git']).map((skill, index) => (
                      <div
                        key={index}
                        className="bg-gray-800/50 rounded-lg px-4 py-3 flex items-center justify-between group hover:bg-gray-700/50 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Code className="w-5 h-5 text-pink-500" />
                          <span>{skill}</span>
                        </div>
                        {index < 3 && (
                          <div className="bg-green-900/50 p-1 rounded-full">
                            <Shield className="w-3 h-3 text-green-400" />
                          </div>
                        )}
                      </div>
                    ))}
                    <div className="bg-gray-800/30 rounded-lg px-4 py-3 flex items-center justify-center gap-2 border border-dashed border-gray-700 hover:border-pink-500/50 hover:bg-gray-800/50 transition-all cursor-pointer">
                      <span className="text-gray-400">+ Add Skill</span>
                    </div>
                  </div>
                </div>

                {/* Learning Path Progress */}
                <div>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <GitBranch className="w-5 h-5 text-pink-500" />
                    Learning Path Progress
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-800/50 rounded-xl p-6 hover:bg-gray-700/50 transition-colors border border-gray-700/50">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <div className="bg-blue-900/50 p-1.5 rounded-md">
                            <Code className="w-4 h-4 text-blue-400" />
                          </div>
                          <h3 className="font-medium">Frontend Development</h3>
                        </div>
                        <span className="text-sm bg-blue-900/50 text-blue-300 px-2 py-0.5 rounded-md border border-blue-500/30">Advanced</span>
                      </div>
                      <div className="flex justify-between items-center text-sm text-gray-400 mb-2">
                        <span>Progress</span>
                        <span>75%</span>
                      </div>
                      <ProgressBar value={75} />
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex -space-x-2">
                          <div className="w-6 h-6 rounded-full bg-pink-500 flex items-center justify-center text-xs text-white">R</div>
                          <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-xs text-white">J</div>
                          <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-xs text-white">H</div>
                        </div>
                        <Link to="/roadmaps/frontend-developer" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                          Continue →
                        </Link>
                      </div>
                    </div>
                    
                    <div className="bg-gray-800/50 rounded-xl p-6 hover:bg-gray-700/50 transition-colors border border-gray-700/50">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <div className="bg-green-900/50 p-1.5 rounded-md">
                            <Brain className="w-4 h-4 text-green-400" />
                          </div>
                          <h3 className="font-medium">Machine Learning</h3>
                        </div>
                        <span className="text-sm bg-green-900/50 text-green-300 px-2 py-0.5 rounded-md border border-green-500/30">Intermediate</span>
                      </div>
                      <div className="flex justify-between items-center text-sm text-gray-400 mb-2">
                        <span>Progress</span>
                        <span>60%</span>
                      </div>
                      <ProgressBar value={60} />
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex -space-x-2">
                          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-xs text-white">P</div>
                          <div className="w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center text-xs text-white">T</div>
                        </div>
                        <Link to="/roadmaps/machine-learning" className="text-sm text-green-400 hover:text-green-300 transition-colors">
                          Continue →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Certifications */}
                <div>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-pink-500" />
                    Certifications & Badges
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-gray-800/50 rounded-xl p-6 hover:bg-gray-700/50 transition-colors border border-gray-700/50">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg p-3">
                          <Award className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-medium">Web Development</h3>
                          <p className="text-sm text-gray-400">Intermediate Level</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500">Issued: June 2025</div>
                        <Link
                          to="/certificates/web-dev"
                          className="text-pink-500 hover:text-pink-400 text-sm font-medium flex items-center gap-1"
                        >
                          View <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
                    
                    <div className="bg-gray-800/50 rounded-xl p-6 hover:bg-gray-700/50 transition-colors border border-gray-700/50">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg p-3">
                          <Award className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-medium">React Developer</h3>
                          <p className="text-sm text-gray-400">Advanced Level</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500">Issued: August 2025</div>
                        <Link
                          to="/certificates/react-dev"
                          className="text-blue-500 hover:text-blue-400 text-sm font-medium flex items-center gap-1"
                        >
                          View <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
                    
                    <div className="bg-gray-800/30 rounded-xl p-6 border border-dashed border-gray-700 hover:border-pink-500/30 hover:bg-gray-800/50 transition-all flex flex-col items-center justify-center text-center gap-3 cursor-pointer">
                      <div className="bg-gray-800/70 p-3 rounded-full">
                        <Award className="w-6 h-6 text-gray-400" />
                      </div>
                      <div>
                        <div className="text-gray-300 font-medium">Earn More Certificates</div>
                        <p className="text-xs text-gray-500 mt-1">Complete courses and assessments</p>
                      </div>
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