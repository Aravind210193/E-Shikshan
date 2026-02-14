import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Edit, Trash2, Eye, BookOpen, Clock, Users, CheckCircle, XCircle, X, Save, Star } from "lucide-react";
import { toast } from "react-hot-toast";
import { adminCourseAPI } from "../../services/adminApi";

const AdminCourses = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterLevel, setFilterLevel] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    draft: 0,
    archived: 0,
    totalStudents: 0
  });
  const [formData, setFormData] = useState({
    title: "",
    category: "Programming",
    level: "Beginner",
    duration: "",
    status: "active",
    description: "",
    instructor: "",
    instructorBio: "",
    thumbnail: "",
    price: "Free",
    priceAmount: 0,
    skills: [],
    prerequisites: [],
    whatYoullLearn: [],
    certificate: false,
    language: "English",
    instructorEmail: "" // New field
  });

  const [currentUser, setCurrentUser] = useState({ role: 'admin', email: '' });

  useEffect(() => {
    const role = sessionStorage.getItem('adminRole');
    const data = JSON.parse(sessionStorage.getItem('adminData') || '{}');
    setCurrentUser({ role, email: data.email });
  }, []);

  const [courses, setCourses] = useState([]);

  // Fetch courses from API
  useEffect(() => {
    fetchCourses();
    fetchStats();
  }, [currentPage, searchQuery, filterCategory, filterLevel, filterStatus, location.pathname]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 9,
        search: searchQuery || undefined,
        category: filterCategory !== 'all' ? filterCategory : undefined,
        level: filterLevel !== 'all' ? filterLevel : undefined,
        status: filterStatus !== 'all' ? filterStatus : undefined
      };

      const response = await adminCourseAPI.getAll(params);
      setCourses(response.data.courses || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await adminCourseAPI.getStats();
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const filteredCourses = courses;

  // CRUD Operations
  const handleAdd = () => {
    setModalMode("add");
    setFormData({
      title: "",
      category: "Programming",
      level: "Beginner",
      duration: "",
      status: "active",
      description: "",
      instructor: currentUser.role === 'course_manager' ? JSON.parse(sessionStorage.getItem('adminData')).name : "",
      instructorEmail: currentUser.role === 'course_manager' ? currentUser.email : "",
      instructorBio: "",
      thumbnail: "",
      price: "Free",
      priceAmount: 0,
      skills: [],
      prerequisites: [],
      whatYoullLearn: [],
      certificate: false,
      language: "English"
    });
    setShowModal(true);
  };

  const handleEdit = (course) => {
    setModalMode("edit");
    setSelectedCourse(course);
    setFormData({
      title: course.title,
      category: course.category,
      level: course.level,
      duration: course.duration,
      status: course.status,
      description: course.description || "",
      instructor: course.instructor || "",
      instructorEmail: course.instructorEmail || "", // Populate existing email
      instructorBio: course.instructorBio || "",
      thumbnail: course.thumbnail || "",
      price: course.price || "Free",
      priceAmount: course.priceAmount || 0,
      skills: course.skills || [],
      prerequisites: course.prerequisites || [],
      whatYoullLearn: course.whatYoullLearn || [],
      certificate: course.certificate || false,
      language: course.language || "English"
    });
    setShowModal(true);
  };

  const handleView = (course) => {
    setModalMode("view");
    setSelectedCourse(course);
    setShowModal(true);
  };

  const handleDelete = async (courseId) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await adminCourseAPI.delete(courseId);
        toast.success("Course deleted successfully");
        fetchCourses();
        fetchStats();
      } catch (error) {
        console.error('Delete failed:', error);
        toast.error(error.response?.data?.message || "Failed to delete course");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === "add") {
        await adminCourseAPI.create(formData);
        toast.success("Course created successfully");
      } else if (modalMode === "edit") {
        await adminCourseAPI.update(selectedCourse._id, formData);
        toast.success("Course updated successfully");
      }
      setShowModal(false);
      fetchCourses();
      fetchStats();
    } catch (error) {
      console.error('Submit failed:', error);
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Course Management</h1>
          <p className="text-gray-400">Manage all courses and learning content</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAdd}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold flex items-center gap-2 shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Create New Course
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Courses", value: stats.total, icon: BookOpen, color: "blue" },
          { label: "Active Courses", value: stats.active, icon: CheckCircle, color: "green" },
          { label: "Draft Courses", value: stats.draft, icon: Clock, color: "yellow" },
          { label: "Total Students", value: stats.totalStudents, icon: Users, color: "purple" }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800 rounded-xl p-4 border border-gray-700"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-400 text-sm">{stat.label}</p>
              <stat.icon className={`w-5 h-5 ${stat.color === 'blue' ? 'text-blue-400' :
                stat.color === 'green' ? 'text-green-400' :
                  stat.color === 'yellow' ? 'text-yellow-400' :
                    'text-purple-400'
                }`} />
            </div>
            <p className={`text-2xl font-bold ${stat.color === 'blue' ? 'text-blue-400' :
              stat.color === 'green' ? 'text-green-400' :
                stat.color === 'yellow' ? 'text-yellow-400' :
                  'text-purple-400'
              }`}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors w-5 h-5" />
            <input
              type="text"
              placeholder="Search courses by title, instructor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-10 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-600 rounded-lg text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="all">All Categories</option>
            <option value="Programming">Programming</option>
            <option value="Data Science">Data Science</option>
            <option value="Web Development">Web Development</option>
            <option value="Mobile Development">Mobile Development</option>
            <option value="DevOps">DevOps</option>
            <option value="Design">Design</option>
            <option value="Business">Business</option>
            <option value="Marketing">Marketing</option>
          </select>
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="all">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Courses Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-xl">No courses found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course, index) => (
            <motion.div
              key={course._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden hover:border-blue-500/50 transition-all duration-300"
            >
              <div className="h-48 bg-gradient-to-br from-blue-600 to-purple-600 relative overflow-hidden">
                {course.thumbnail ? (
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen className="w-16 h-16 text-white/50" />
                  </div>
                )}
                <div className="absolute top-4 right-4 flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${course.status === 'active'
                    ? 'bg-green-500 text-white'
                    : course.status === 'draft'
                      ? 'bg-yellow-500 text-white'
                      : 'bg-gray-500 text-white'
                    }`}>
                    {course.status}
                  </span>
                  {course.source && (
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${course.source === 'admin'
                      ? 'bg-purple-500 text-white'
                      : 'bg-blue-500 text-white'
                      }`}>
                      {course.source === 'admin' ? 'Admin Course' : 'Normal Course'}
                    </span>
                  )}
                </div>
                <div className="absolute bottom-4 left-4">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-medium text-white">
                    {course.category}
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                    {course.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{course.students || 0}</span>
                    </div>
                    {course.rating > 0 && (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{course.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                  {course.instructor && (
                    <p className="text-xs text-gray-500 mt-2">By {course.instructor}</p>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-700 flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    {course.price !== 'Free' ? `₹${course.priceAmount || course.price}` : 'Free'}
                  </span>
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleView(course)}
                      className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4 text-blue-400" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleEdit(course)}
                      className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                      title="Edit Course"
                    >
                      <Edit className="w-4 h-4 text-green-400" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(course._id)}
                      className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                      title="Delete Course"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors border border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          {[...Array(Math.min(totalPages, 5))].map((_, idx) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = idx + 1;
            } else if (currentPage <= 3) {
              pageNum = idx + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + idx;
            } else {
              pageNum = currentPage - 2 + idx;
            }
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`px-4 py-2 rounded-lg transition-colors ${currentPage === pageNum
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700'
                  }`}
              >
                {pageNum}
              </button>
            );
          })}
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors border border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {/* Add/Edit/View Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-800 rounded-2xl border border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">
                  {modalMode === "add" ? "Create New Course" : modalMode === "edit" ? "Edit Course" : "Course Details"}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="p-6">
                {modalMode === "view" ? (
                  <div className="space-y-4">
                    {selectedCourse?.thumbnail && (
                      <div>
                        <label className="text-sm text-gray-400">Thumbnail</label>
                        <img src={selectedCourse.thumbnail} alt={selectedCourse.title} className="w-full h-48 object-cover rounded-xl mt-2" />
                      </div>
                    )}
                    <div>
                      <label className="text-sm text-gray-400">Course Title</label>
                      <p className="text-white font-medium mt-1">{selectedCourse?.title}</p>
                    </div>
                    {selectedCourse?.description && (
                      <div>
                        <label className="text-sm text-gray-400">Description</label>
                        <p className="text-white mt-1">{selectedCourse.description}</p>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-400">Category</label>
                        <p className="text-white font-medium mt-1">{selectedCourse?.category}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">Level</label>
                        <p className="text-white font-medium mt-1">{selectedCourse?.level}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-400">Duration</label>
                        <p className="text-white font-medium mt-1">{selectedCourse?.duration}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">Students Enrolled</label>
                        <p className="text-white font-medium mt-1">{selectedCourse?.students || 0}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-400">Status</label>
                        <p className="text-white font-medium mt-1 capitalize">{selectedCourse?.status}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">Price</label>
                        <p className="text-white font-medium mt-1">{selectedCourse?.price !== 'Free' ? `₹${selectedCourse?.priceAmount || selectedCourse?.price}` : 'Free'}</p>
                      </div>
                    </div>
                    {selectedCourse?.instructor && (
                      <div>
                        <label className="text-sm text-gray-400">Instructor</label>
                        <p className="text-white font-medium mt-1">{selectedCourse.instructor}</p>
                      </div>
                    )}
                    {selectedCourse?.rating > 0 && (
                      <div>
                        <label className="text-sm text-gray-400">Rating</label>
                        <div className="flex items-center gap-2 mt-1">
                          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                          <p className="text-white font-medium">{selectedCourse.rating.toFixed(1)}/5</p>
                        </div>
                      </div>
                    )}
                    {selectedCourse?.skills && selectedCourse.skills.length > 0 && (
                      <div>
                        <label className="text-sm text-gray-400">Skills</label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedCourse.skills.map((skill, idx) => (
                            <span key={idx} className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Course Title *</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Enter course title"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Description</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows="3"
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Enter course description"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">Category *</label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                          <option value="Programming">Programming</option>
                          <option value="Data Science">Data Science</option>
                          <option value="Web Development">Web Development</option>
                          <option value="Mobile Development">Mobile Development</option>
                          <option value="DevOps">DevOps</option>
                          <option value="Design">Design</option>
                          <option value="Business">Business</option>
                          <option value="Marketing">Marketing</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">Level *</label>
                        <select
                          value={formData.level}
                          onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">Duration *</label>
                        <input
                          type="text"
                          value={formData.duration}
                          onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                          required
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
                          placeholder="e.g., 12 weeks"
                        />
                      </div>

                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">Status *</label>
                        <select
                          value={formData.status}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                          <option value="active">Active</option>
                          <option value="draft">Draft</option>
                          <option value="archived">Archived</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Instructor</label>
                      <input
                        type="text"
                        value={formData.instructor}
                        onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Instructor name"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Instructor Email {currentUser.role === 'course_manager' && '(Auto-filled)'}</label>
                      <input
                        type="email"
                        value={formData.instructorEmail}
                        onChange={(e) => setFormData({ ...formData, instructorEmail: e.target.value })}
                        className={`w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none ${currentUser.role === 'course_manager' ? 'opacity-50 cursor-not-allowed' : ''}`}
                        placeholder="Instructor email"
                        readOnly={currentUser.role === 'course_manager'}
                      />
                    </div>

                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Thumbnail URL</label>
                      <input
                        type="text"
                        value={formData.thumbnail}
                        onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Course thumbnail URL"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">Price</label>
                        <input
                          type="text"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
                          placeholder="Free or ₹3,999"
                        />
                      </div>

                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">Price Amount</label>
                        <input
                          type="number"
                          value={formData.priceAmount}
                          onChange={(e) => setFormData({ ...formData, priceAmount: parseInt(e.target.value) || 0 })}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
                          placeholder="Numeric price"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2"
                      >
                        <Save className="w-5 h-5" />
                        {modalMode === "add" ? "Create Course" : "Update Course"}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={() => setShowModal(false)}
                        className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-semibold"
                      >
                        Cancel
                      </motion.button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminCourses;
