import React, { useState, useMemo, useEffect } from 'react';
import {AnimatePresence, motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Filter, Clock, Users, Star, Award, BookOpen, ChevronDown, TrendingUp, Zap, Heart, Video, FileText, X } from 'lucide-react';
import { enrollmentAPI, coursesAPI } from '../services/api';
import toast from 'react-hot-toast';

const Courses = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [selectedDuration, setSelectedDuration] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('popular');
  const [courses, setCourses] = useState([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const [enrollmentStatus, setEnrollmentStatus] = useState({});

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoadingCourses(true);
        const response = await coursesAPI.getAll();
        if (response && response.data) {
          setCourses(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch courses:', error);
        toast.error('Failed to load courses. Please try again.');
        setCourses([]);
      } finally {
        setIsLoadingCourses(false);
      }
    };

    fetchCourses();
  }, [location.pathname]);

  useEffect(() => {
    const checkEnrollments = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const myCourses = await enrollmentAPI.getMyCourses();
        const statusMap = {};
        myCourses.data.forEach(enrollment => {
          // Only grant access if both paymentStatus is completed/free AND status is active
          const hasAccess = (enrollment.paymentStatus === 'completed' || enrollment.paymentStatus === 'free')
                            && enrollment.status === 'active';
          statusMap[enrollment.courseId._id || enrollment.courseId] = {
            enrolled: hasAccess,
            hasAccess,
            enrollment
          };
        });
        setEnrollmentStatus(statusMap);
      } catch (error) {
        console.error('Failed to check enrollments:', error);
      }
    };

    checkEnrollments();
  }, []);

  const categories = ['All', 'Computer Science', 'Data Science', 'Web Development', 'Business', 'Design', 'Cloud Computing', 'Blockchain', 'Cybersecurity', 'Mobile Development', 'Game Development'];
  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];
  const durations = ['All', '4-6 weeks', '7-10 weeks', '11+ weeks'];

  const filteredCourses = useMemo(() => {
    if (!Array.isArray(courses)) {
      return [];
    }

    let filtered = courses;

    if (searchQuery) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.provider.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(course => course.category === selectedCategory);
    }

    if (selectedLevel !== 'All') {
      filtered = filtered.filter(course => course.level === selectedLevel);
    }

    if (selectedDuration !== 'All') {
      if (selectedDuration === '4-6 weeks') {
        filtered = filtered.filter(course => {
          const w = parseInt(course.duration);
          return w >= 4 && w <= 6;
        });
      } else if (selectedDuration === '7-10 weeks') {
        filtered = filtered.filter(course => {
          const w = parseInt(course.duration);
          return w >= 7 && w <= 10;
        });
      } else if (selectedDuration === '11+ weeks') {
        filtered = filtered.filter(course => {
          const w = parseInt(course.duration);
          return w >= 11;
        });
      }
    }

    if (sortBy === 'popular') {
      filtered = [...filtered].sort((a, b) => b.students - a.students);
    } else if (sortBy === 'rating') {
      filtered = [...filtered].sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'newest') {
      filtered = [...filtered].sort((a, b) => b.id - a.id);
    }

    return filtered;
  }, [searchQuery, selectedCategory, selectedLevel, selectedDuration, sortBy]);

  const handleCourseClick = (course) => {
    navigate(`/courses/${course._id}`);
  };

  const handleEnrollClick = (e, course) => {
    e.stopPropagation();
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to enroll in this course');
      navigate('/login');
      return;
    }

    navigate(`/courses/${course._id}`, { 
      state: { autoOpenEnrollment: true } 
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="relative h-80 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920&h=400&fit=crop')" }}>
        <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-[1px]"></div>
        <div className="relative max-w-7xl mx-auto h-full flex items-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center w-full"
          >
            <h1 className="text-5xl font-bold mb-4">Explore Top Courses</h1>
            <p className="text-xl text-white/90 mb-8">Learn from the world's best universities and companies</p>
            <div className="max-w-3xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="What do you want to learn today?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <div className="sticky top-4">
              <div className="flex items-center justify-between mb-4 lg:hidden px-2">
                <h3 className="text-base font-semibold flex items-center gap-2 flex-shrink-0">
                  <Filter size={18} className="text-purple-400" />
                  Filters
                </h3>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowFilters(!showFilters)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition-all duration-300 border border-slate-700 flex-shrink-0"
                >
                  {showFilters ? <X size={18} /> : <Filter size={18} />}
                </motion.button>
              </div>

              <AnimatePresence>
                {(showFilters || window.innerWidth >= 1024) && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-5 border border-purple-500/20 shadow-lg"
                    >
                      <h3 className="font-semibold mb-4 flex items-center gap-2 text-white">
                        <span className="p-2 bg-indigo-500/20 rounded-lg">
                          <BookOpen size={18} className="text-indigo-400" />
                        </span>
                        Category
                      </h3>
                      <div className="space-y-2">
                        {categories.map((cat, index) => (
                          <motion.button
                            key={cat}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 + index * 0.03 }}
                            whileHover={{ scale: 1.02, x: 4 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedCategory(cat)}
                            className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 text-sm font-medium ${
                              selectedCategory === cat
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                                : 'hover:bg-slate-700/50 text-slate-300 hover:text-white border border-transparent hover:border-slate-600'
                            }`}
                          >
                            {cat}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-5 border border-purple-500/20 shadow-lg"
                    >
                      <h3 className="font-semibold mb-4 flex items-center gap-2 text-white">
                        <span className="p-2 bg-green-500/20 rounded-lg">
                          <TrendingUp size={18} className="text-green-400" />
                        </span>
                        Level
                      </h3>
                      <div className="space-y-2">
                        {levels.map((level, index) => (
                          <motion.button
                            key={level}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + index * 0.03 }}
                            whileHover={{ scale: 1.02, x: 4 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedLevel(level)}
                            className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 text-sm font-medium ${
                              selectedLevel === level
                                ? 'bg-green-600 text-white shadow-lg shadow-green-500/30'
                                : 'hover:bg-slate-700/50 text-slate-300 hover:text-white border border-transparent hover:border-slate-600'
                            }`}
                          >
                            {level}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-5 border border-purple-500/20 shadow-lg"
                    >
                      <h3 className="font-semibold mb-4 flex items-center gap-2 text-white">
                        <span className="p-2 bg-yellow-500/20 rounded-lg">
                          <Clock size={18} className="text-yellow-400" />
                        </span>
                        Duration
                      </h3>
                      <div className="space-y-2">
                        {durations.map((duration, index) => (
                          <motion.button
                            key={duration}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + index * 0.03 }}
                            whileHover={{ scale: 1.02, x: 4 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedDuration(duration)}
                            className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 text-sm font-medium ${
                              selectedDuration === duration
                                ? 'bg-yellow-600 text-white shadow-lg shadow-yellow-500/30'
                                : 'hover:bg-slate-700/50 text-slate-300 hover:text-white border border-transparent hover:border-slate-600'
                            }`}
                          >
                            {duration}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </aside>

          {/* Courses Grid */}
          <main className="lg:col-span-3">
            {/* Sort and Results Count */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-slate-400">
                {filteredCourses.length} courses found
              </p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest</option>
              </select>
            </div>

            {/* Courses Grid */}
            {isLoadingCourses ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                  <p className="mt-4 text-slate-400">Loading courses...</p>
                </div>
              </div>
            ) : filteredCourses.length === 0 ? (
              <div className="text-center py-20">
                <BookOpen className="mx-auto h-12 w-12 text-slate-600 mb-4" />
                <p className="text-slate-400 text-lg">No courses found matching your criteria</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCourses.map((course, index) => (
                  <motion.div
                    key={course._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleCourseClick(course)}
                    className="bg-slate-800 rounded-xl overflow-hidden hover:shadow-xl hover:shadow-indigo-500/20 transition-all duration-300 group cursor-pointer"
                  >
                  {/* Course Image */}
                  <div className="relative h-40 bg-cover bg-center overflow-hidden" style={{ backgroundImage: `url(${course.thumbnail})` }}>
                    <div className="absolute inset-0 bg-slate-900/30 group-hover:bg-slate-900/10 transition-all"></div>
                    <div className="absolute top-2 right-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="p-2 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors"
                      >
                        <Heart size={18} />
                      </button>
                    </div>
                    {course.price === 'Free' && (
                      <div className="absolute top-2 left-2 px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                        FREE
                      </div>
                    )}
                  </div>

                  {/* Course Content */}
                  <div className="p-4">
                    <div className="mb-2">
                      <span className="text-xs text-indigo-400 font-semibold">{course.provider}</span>
                    </div>
                    <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-indigo-400 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-sm text-slate-400 mb-3 line-clamp-2">
                      {course.description}
                    </p>

                    {/* Instructor */}
                    <p className="text-xs text-slate-500 mb-3">by {course.instructor}</p>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {course.skills.slice(0, 3).map(skill => (
                        <span
                          key={skill}
                          className="px-2 py-1 bg-slate-700 text-xs rounded-full text-slate-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Course Stats */}
                    <div className="flex items-center justify-between text-sm mb-4">
                      <div className="flex items-center gap-1 text-yellow-400">
                        <Star size={16} fill="currentColor" />
                        <span className="font-semibold">{course.rating}</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-400">
                        <Users size={16} />
                        <span>{(course.students / 1000).toFixed(0)}k</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-400">
                        <Clock size={16} />
                        <span>{course.duration}</span>
                      </div>
                    </div>
                    {/* Video and PDF Links */}
                    <div className="flex items-center gap-4 text-sm mb-4">
                      {course.videoLectures && course.videoLectures.length > 0 && (
                        <div className="flex items-center gap-1 text-indigo-400">
                          <Video size={16} />
                          <span>{course.videoLectures.length} videos</span>
                        </div>
                      )}
                      {course.resources && course.resources.length > 0 && (
                        <div className="flex items-center gap-1 text-green-400">
                          <FileText size={16} />
                          <span>{course.resources.length} PDFs</span>
                        </div>
                      )}
                    </div>

                    {/* Level Badge and Price */}
                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        course.level === 'Beginner' ? 'bg-green-900/50 text-green-400' :
                        course.level === 'Intermediate' ? 'bg-yellow-900/50 text-yellow-400' :
                        'bg-red-900/50 text-red-400'
                      }`}>
                        {course.level}
                      </span>
                      <span className="font-bold text-indigo-400">
                        {course.price === 'Free' ? 'Free' : `₹${course.priceAmount?.toLocaleString()}`}
                      </span>
                    </div>

                    {/* EdX-Style Enrollment Button */}
                    <div className="border-t border-slate-700 pt-4">
                      {enrollmentStatus[course._id]?.enrolled ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/courses/${course._id}`);
                          }}
                          className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-green-500/20"
                        >
                          <BookOpen size={18} />
                          View Course
                        </button>
                      ) : (
                        <button
                          onClick={(e) => handleEnrollClick(e, course)}
                          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 group"
                        >
                          {course.price === 'Free' ? (
                            <>
                              <Award size={18} className="group-hover:scale-110 transition-transform" />
                              Enroll for Free
                            </>
                          ) : (
                            <>
                              <Zap size={18} className="group-hover:scale-110 transition-transform" />
                              Enroll Now
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Courses;
