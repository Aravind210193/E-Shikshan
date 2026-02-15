import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Edit, Trash2, Eye, BookOpen, Clock, Users, CheckCircle, XCircle, X, Save, Star, PlayCircle, Send, FileCode, Video, ClipboardList } from "lucide-react";
import { toast } from "react-hot-toast";
import { adminCourseAPI } from "../../services/adminApi";

const AdminCourses = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterLevel, setFilterLevel] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterInstructor, setFilterInstructor] = useState("all");
  const [instructors, setInstructors] = useState([]);
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
    instructorEmail: ""
  });

  const [lessonForm, setLessonForm] = useState({ title: "", duration: "", url: "", free: false, order: 0 });
  const [projectForm, setProjectForm] = useState({ title: "", description: "", duration: "", instructions: "", deadline: "", submitUrl: "", askAdminUrl: "" });
  const [assignmentForm, setAssignmentForm] = useState({ title: "", description: "", difficulty: "Medium", points: 0, instructions: "", deadline: "" });
  const [resourceForm, setResourceForm] = useState({ title: "", url: "", type: "pdf" });
  const [activeTab, setActiveTab] = useState("lessons");
  const [confirmModal, setConfirmModal] = useState({
    show: false,
    title: "",
    message: "",
    onConfirm: () => { },
    type: "danger"
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
  }, [currentPage, searchQuery, filterCategory, filterLevel, filterStatus, filterInstructor, location.pathname]);

  useEffect(() => {
    if (currentUser.role === 'admin') {
      fetchInstructors();
    }
  }, [currentUser]);

  const fetchInstructors = async () => {
    try {
      const response = await adminCourseAPI.getInstructors();
      if (response.data.success) {
        setInstructors(response.data.instructors);
      }
    } catch (error) {
      console.error('Failed to fetch instructors:', error);
    }
  };

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 9,
        search: searchQuery || undefined,
        category: filterCategory !== 'all' ? filterCategory : undefined,
        level: filterLevel !== 'all' ? filterLevel : undefined,
        status: filterStatus !== 'all' ? filterStatus : undefined,
        instructorEmail: filterInstructor !== 'all' ? filterInstructor : undefined
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
      instructor: currentUser.role === 'course_manager' ? (JSON.parse(sessionStorage.getItem('adminData'))?.name || "") : "",
      instructorEmail: currentUser.role === 'course_manager' ? (JSON.parse(sessionStorage.getItem('adminData'))?.email || currentUser.email) : "",
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

  const handleManageContent = async (course) => {
    try {
      const response = await adminCourseAPI.getById(course._id);
      if (response.data.success) {
        setSelectedCourse(response.data.course);
        setModalMode("manage");
        setShowModal(true);
      }
    } catch (error) {
      toast.error("Failed to fetch course details");
    }
  };

  const handleEdit = async (course) => {
    try {
      const response = await adminCourseAPI.getById(course._id);
      if (response.data.success) {
        const fullCourse = response.data.course;
        setModalMode("edit");
        setSelectedCourse(fullCourse);
        setFormData({
          title: fullCourse.title,
          category: fullCourse.category,
          level: fullCourse.level,
          duration: fullCourse.duration,
          status: fullCourse.status,
          description: fullCourse.description || "",
          instructor: fullCourse.instructor || "",
          instructorEmail: fullCourse.instructorEmail || "",
          instructorBio: fullCourse.instructorBio || "",
          thumbnail: fullCourse.thumbnail || "",
          price: fullCourse.price || "Free",
          priceAmount: fullCourse.priceAmount || 0,
          skills: fullCourse.skills || [],
          prerequisites: fullCourse.prerequisites || [],
          whatYoullLearn: fullCourse.whatYoullLearn || [],
          certificate: fullCourse.certificate || false,
          language: fullCourse.language || "English"
        });
        setShowModal(true);
      }
    } catch (error) {
      toast.error("Failed to fetch course details");
    }
  };

  const handleView = async (course) => {
    try {
      const response = await adminCourseAPI.getById(course._id);
      if (response.data.success) {
        setModalMode("view");
        setSelectedCourse(response.data.course);
        setShowModal(true);
      }
    } catch (error) {
      toast.error("Failed to fetch course details");
    }
  };

  const handleDelete = (courseId) => {
    const isPermanent = currentUser.role === 'admin';
    const message = isPermanent
      ? "Are you sure you want to delete this course PERMANENTLY? This cannot be undone."
      : "Are you sure you want to remove this course from your dashboard? It will remain on the platform.";

    setConfirmModal({
      show: true,
      title: isPermanent ? "Delete Permanently" : "Unassign Course",
      message: message,
      type: "danger",
      onConfirm: async () => {
        try {
          const response = await adminCourseAPI.delete(courseId);
          toast.success(response.data.message || "Course deleted successfully");
          fetchCourses();
          fetchStats();
          setConfirmModal(prev => ({ ...prev, show: false }));
        } catch (error) {
          console.error('Delete failed:', error);
          toast.error(error.response?.data?.message || "Failed to remove course");
          setConfirmModal(prev => ({ ...prev, show: false }));
        }
      }
    });
  };

  const handleAddLesson = async () => {
    try {
      if (!lessonForm.title || !lessonForm.url) return toast.error("Title and URL are required");
      const response = await adminCourseAPI.addLesson(selectedCourse._id, lessonForm);
      if (response.data.success) {
        setSelectedCourse(response.data.course);
        toast.success("Lesson added");
        setLessonForm({ title: "", duration: "", url: "", free: false, order: 0 });
        fetchCourses();
      }
    } catch (error) {
      toast.error("Failed to add lesson");
    }
  };

  const handleDeleteLesson = (lessonId) => {
    setConfirmModal({
      show: true,
      title: "Delete Lesson",
      message: "Are you sure you want to delete this lesson? This action cannot be undone.",
      type: "danger",
      onConfirm: async () => {
        try {
          const response = await adminCourseAPI.deleteLesson(selectedCourse._id, lessonId);
          if (response.data.success) {
            setSelectedCourse(response.data.course);
            toast.success("Lesson removed");
            fetchCourses();
          }
          setConfirmModal(prev => ({ ...prev, show: false }));
        } catch (error) {
          toast.error("Failed to remove lesson");
          setConfirmModal(prev => ({ ...prev, show: false }));
        }
      }
    });
  };

  const handleAddProject = async () => {
    try {
      if (!projectForm.title || !projectForm.description) return toast.error("Title and Description are required");
      const response = await adminCourseAPI.addProject(selectedCourse._id, projectForm);
      if (response.data.success) {
        setSelectedCourse(response.data.course);
        toast.success("Project added");
        setProjectForm({ title: "", description: "", duration: "", instructions: "", deadline: "", submitUrl: "", askAdminUrl: "" });
        fetchCourses();
      }
    } catch (error) {
      toast.error("Failed to add project");
    }
  };

  const handleDeleteProject = (projectId) => {
    setConfirmModal({
      show: true,
      title: "Delete Project",
      message: "Are you sure you want to delete this project? This action cannot be undone.",
      type: "danger",
      onConfirm: async () => {
        try {
          const response = await adminCourseAPI.deleteProject(selectedCourse._id, projectId);
          if (response.data.success) {
            setSelectedCourse(response.data.course);
            toast.success("Project removed");
            fetchCourses();
          }
          setConfirmModal(prev => ({ ...prev, show: false }));
        } catch (error) {
          toast.error("Failed to remove project");
          setConfirmModal(prev => ({ ...prev, show: false }));
        }
      }
    });
  };

  const handleAddAssignment = async () => {
    try {
      if (!assignmentForm.title || !assignmentForm.description) return toast.error("Title and Description are required");
      const response = await adminCourseAPI.addAssignment(selectedCourse._id, assignmentForm);
      if (response.data.success) {
        setSelectedCourse(response.data.course);
        toast.success("Assignment added");
        setAssignmentForm({ title: "", description: "", difficulty: "Medium", points: 0, instructions: "", deadline: "" });
        fetchCourses();
      }
    } catch (error) {
      toast.error("Failed to add assignment");
    }
  };

  const handleDeleteAssignment = (assignmentId) => {
    setConfirmModal({
      show: true,
      title: "Delete Assignment",
      message: "Are you sure you want to delete this assignment? This action cannot be undone.",
      type: "danger",
      onConfirm: async () => {
        try {
          const response = await adminCourseAPI.deleteAssignment(selectedCourse._id, assignmentId);
          if (response.data.success) {
            setSelectedCourse(response.data.course);
            toast.success("Assignment removed");
            fetchCourses();
          }
          setConfirmModal(prev => ({ ...prev, show: false }));
        } catch (error) {
          toast.error("Failed to remove assignment");
          setConfirmModal(prev => ({ ...prev, show: false }));
        }
      }
    });
  };

  const handleAddResource = async () => {
    try {
      if (!resourceForm.title || !resourceForm.url) return toast.error("Title and URL are required");
      const response = await adminCourseAPI.addResource(selectedCourse._id, resourceForm);
      if (response.data.success) {
        setSelectedCourse(response.data.course);
        toast.success("Resource added");
        setResourceForm({ title: "", url: "", type: "pdf" });
        fetchCourses();
      }
    } catch (error) {
      toast.error("Failed to add resource");
    }
  };

  const handleDeleteResource = (resourceId) => {
    setConfirmModal({
      show: true,
      title: "Delete Resource",
      message: "Are you sure you want to delete this resource?",
      type: "danger",
      onConfirm: async () => {
        try {
          const response = await adminCourseAPI.deleteResource(selectedCourse._id, resourceId);
          if (response.data.success) {
            setSelectedCourse(response.data.course);
            toast.success("Resource removed");
            fetchCourses();
          }
          setConfirmModal(prev => ({ ...prev, show: false }));
        } catch (error) {
          toast.error("Failed to remove resource");
          setConfirmModal(prev => ({ ...prev, show: false }));
        }
      }
    });
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
          {currentUser.role === 'admin' && (
            <select
              value={filterInstructor}
              onChange={(e) => setFilterInstructor(e.target.value)}
              className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="all">All Instructors</option>
              {instructors.map(inst => (
                <option key={inst.email} value={inst.email}>{inst.name}</option>
              ))}
            </select>
          )}
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
                    <div className="flex items-center gap-1" title="Videos">
                      <Video className="w-4 h-4" />
                      <span>{course.totalVideos || 0}</span>
                    </div>
                    <div className="flex items-center gap-1" title="Tasks">
                      <ClipboardList className="w-4 h-4" />
                      <span>{course.totalTasks || 0}</span>
                    </div>
                    <div className="flex items-center gap-1" title="Students">
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
                      onClick={() => handleManageContent(course)}
                      className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                      title="Manage Lessons & Projects"
                    >
                      <PlayCircle className="w-4 h-4 text-purple-400" />
                    </motion.button>
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
                  {modalMode === "add" ? "Create New Course" :
                    modalMode === "edit" ? "Edit Course" :
                      modalMode === "manage" ? "Manage Course Content" :
                        "Course Details"}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="p-6">
                {modalMode === "manage" ? (
                  <div className="space-y-6">
                    <div className="flex gap-4 p-1 bg-gray-900 rounded-xl mb-6">
                      <button
                        onClick={() => setActiveTab("lessons")}
                        className={`flex-1 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${activeTab === 'lessons' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                      >
                        <Video className="w-5 h-5" /> Lessons
                      </button>
                      <button
                        onClick={() => setActiveTab("assignments")}
                        className={`flex-1 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${activeTab === 'assignments' ? 'bg-green-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                      >
                        <ClipboardList className="w-5 h-5" /> Tasks
                      </button>
                      <button
                        onClick={() => setActiveTab("projects")}
                        className={`flex-1 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${activeTab === 'projects' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                      >
                        <FileCode className="w-5 h-5" /> Projects
                      </button>
                      <button
                        onClick={() => setActiveTab("resources")}
                        className={`flex-1 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${activeTab === 'resources' ? 'bg-orange-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                      >
                        <BookOpen className="w-5 h-5" /> Materials
                      </button>
                    </div>

                    {activeTab === 'lessons' ? (
                      <div className="space-y-6">
                        <div className="bg-gray-700/50 p-4 rounded-xl space-y-4 border border-gray-600">
                          <h4 className="text-white font-semibold flex items-center gap-2">
                            <Plus className="w-4 h-4 text-blue-400" /> Add New Lesson
                          </h4>
                          <div className="grid grid-cols-2 gap-4">
                            <input
                              type="text"
                              placeholder="Lesson Title"
                              value={lessonForm.title}
                              onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                              className="bg-gray-800 border-gray-600 border rounded-lg px-4 py-2 text-white text-sm"
                            />
                            <input
                              type="text"
                              placeholder="Duration (e.g. 10:15)"
                              value={lessonForm.duration}
                              onChange={(e) => setLessonForm({ ...lessonForm, duration: e.target.value })}
                              className="bg-gray-800 border-gray-600 border rounded-lg px-4 py-2 text-white text-sm"
                            />
                            <input
                              type="text"
                              placeholder="Video URL"
                              value={lessonForm.url}
                              onChange={(e) => setLessonForm({ ...lessonForm, url: e.target.value })}
                              className="bg-gray-800 border-gray-600 border rounded-lg px-4 py-2 text-white text-sm col-span-2"
                            />
                            <label className="flex items-center gap-2 text-gray-400 text-sm">
                              <input
                                type="checkbox"
                                checked={lessonForm.free}
                                onChange={(e) => setLessonForm({ ...lessonForm, free: e.target.checked })}
                              /> Free Preview
                            </label>
                            <button
                              onClick={handleAddLesson}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                            >
                              Add Lesson
                            </button>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h4 className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Current Lessons</h4>
                          {selectedCourse?.videoLectures?.length === 0 ? (
                            <p className="text-gray-500 text-sm italic">No lessons added yet.</p>
                          ) : (
                            selectedCourse?.videoLectures?.map((lesson, idx) => (
                              <div key={idx} className="bg-gray-900 p-4 rounded-xl flex items-center justify-between group border border-gray-800">
                                <div className="flex items-center gap-4">
                                  <div className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center text-xs text-blue-400 font-bold">
                                    {idx + 1}
                                  </div>
                                  <div>
                                    <p className="text-white font-medium text-sm">{lesson.title}</p>
                                    <p className="text-gray-500 text-xs">{lesson.duration} {lesson.free && '• Free'}</p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleDeleteLesson(lesson._id)}
                                  className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    ) : activeTab === 'assignments' ? (
                      <div className="space-y-6">
                        <div className="bg-gray-700/50 p-4 rounded-xl space-y-4 border border-gray-600">
                          <h4 className="text-white font-semibold flex items-center gap-2">
                            <Plus className="w-4 h-4 text-green-400" /> Add New Task
                          </h4>
                          <div className="grid grid-cols-2 gap-4">
                            <input
                              type="text"
                              placeholder="Task Title"
                              value={assignmentForm.title}
                              onChange={(e) => setAssignmentForm({ ...assignmentForm, title: e.target.value })}
                              className="bg-gray-800 border-gray-600 border rounded-lg px-4 py-2 text-white text-sm col-span-2"
                            />
                            <textarea
                              placeholder="Description"
                              value={assignmentForm.description}
                              onChange={(e) => setAssignmentForm({ ...assignmentForm, description: e.target.value })}
                              className="bg-gray-800 border-gray-600 border rounded-lg px-4 py-2 text-white text-sm col-span-2"
                              rows="2"
                            />
                            <select
                              value={assignmentForm.difficulty}
                              onChange={(e) => setAssignmentForm({ ...assignmentForm, difficulty: e.target.value })}
                              className="bg-gray-800 border-gray-600 border rounded-lg px-4 py-2 text-white text-sm"
                            >
                              <option value="Easy">Easy</option>
                              <option value="Medium">Medium</option>
                              <option value="Hard">Hard</option>
                            </select>
                            <input
                              type="number"
                              placeholder="Points"
                              value={assignmentForm.points}
                              onChange={(e) => setAssignmentForm({ ...assignmentForm, points: parseInt(e.target.value) || 0 })}
                              className="bg-gray-800 border-gray-600 border rounded-lg px-4 py-2 text-white text-sm"
                            />
                            <input
                              type="text"
                              placeholder="Deadline (e.g. 1 week)"
                              value={assignmentForm.deadline}
                              onChange={(e) => setAssignmentForm({ ...assignmentForm, deadline: e.target.value })}
                              className="bg-gray-800 border-gray-600 border rounded-lg px-4 py-2 text-white text-sm"
                            />
                            <button
                              onClick={handleAddAssignment}
                              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                            >
                              Add Task
                            </button>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h4 className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Current Tasks</h4>
                          {selectedCourse?.assignments?.length === 0 ? (
                            <p className="text-gray-500 text-sm italic">No tasks added yet.</p>
                          ) : (
                            selectedCourse?.assignments?.map((task, idx) => (
                              <div key={idx} className="bg-gray-900 p-4 rounded-xl flex items-center justify-between group border border-gray-800">
                                <div className="flex items-center gap-4">
                                  <div className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center text-xs text-green-400 font-bold">
                                    {idx + 1}
                                  </div>
                                  <div>
                                    <p className="text-white font-medium text-sm">{task.title}</p>
                                    <p className="text-gray-500 text-xs">{task.difficulty} • {task.points} pts</p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleDeleteAssignment(task._id)}
                                  className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    ) : activeTab === 'resources' ? (
                      <div className="space-y-6">
                        <div className="bg-gray-700/50 p-4 rounded-xl space-y-4 border border-gray-600">
                          <h4 className="text-white font-semibold flex items-center gap-2">
                            <Plus className="w-4 h-4 text-orange-400" /> Add New Material
                          </h4>
                          <div className="grid grid-cols-2 gap-4">
                            <input
                              type="text"
                              placeholder="Material Title"
                              value={resourceForm.title}
                              onChange={(e) => setResourceForm({ ...resourceForm, title: e.target.value })}
                              className="bg-gray-800 border-gray-600 border rounded-lg px-4 py-2 text-white text-sm col-span-2"
                            />
                            <input
                              type="text"
                              placeholder="URL (PDF or Link)"
                              value={resourceForm.url}
                              onChange={(e) => setResourceForm({ ...resourceForm, url: e.target.value })}
                              className="bg-gray-800 border-gray-600 border rounded-lg px-4 py-2 text-white text-sm"
                            />
                            <select
                              value={resourceForm.type}
                              onChange={(e) => setResourceForm({ ...resourceForm, type: e.target.value })}
                              className="bg-gray-800 border-gray-600 border rounded-lg px-4 py-2 text-white text-sm"
                            >
                              <option value="pdf">PDF</option>
                              <option value="doc">Document</option>
                              <option value="link">Link</option>
                              <option value="other">Other</option>
                            </select>
                            <button
                              onClick={handleAddResource}
                              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors col-span-2"
                            >
                              Add Material
                            </button>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h4 className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Current Materials</h4>
                          {selectedCourse?.resources?.length === 0 ? (
                            <p className="text-gray-500 text-sm italic">No materials added yet.</p>
                          ) : (
                            selectedCourse?.resources?.map((res, idx) => (
                              <div key={idx} className="bg-gray-900 p-4 rounded-xl flex items-center justify-between group border border-gray-800">
                                <div className="flex items-center gap-4">
                                  <div className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center text-xs text-orange-400 font-bold">
                                    {idx + 1}
                                  </div>
                                  <div>
                                    <p className="text-white font-medium text-sm">{res.title}</p>
                                    <p className="text-gray-500 text-xs capitalize">{res.type}</p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleDeleteResource(res._id)}
                                  className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="bg-gray-700/50 p-4 rounded-xl space-y-4 border border-gray-600">
                          <h4 className="text-white font-semibold flex items-center gap-2">
                            <Plus className="w-4 h-4 text-purple-400" /> Add New Project
                          </h4>
                          <div className="grid grid-cols-2 gap-4">
                            <input
                              type="text"
                              placeholder="Project Title"
                              value={projectForm.title}
                              onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                              className="bg-gray-800 border-gray-600 border rounded-lg px-4 py-2 text-white text-sm col-span-2"
                            />
                            <textarea
                              placeholder="Description"
                              value={projectForm.description}
                              onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                              className="bg-gray-800 border-gray-600 border rounded-lg px-4 py-2 text-white text-sm col-span-2"
                              rows="2"
                            />
                            <input
                              type="text"
                              placeholder="Deadline (e.g. 2 weeks)"
                              value={projectForm.deadline}
                              onChange={(e) => setProjectForm({ ...projectForm, deadline: e.target.value })}
                              className="bg-gray-800 border-gray-600 border rounded-lg px-4 py-2 text-white text-sm"
                            />
                            <button
                              onClick={handleAddProject}
                              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                            >
                              Add Project
                            </button>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h4 className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Current Projects</h4>
                          {selectedCourse?.projectsDetails?.length === 0 ? (
                            <p className="text-gray-500 text-sm italic">No projects added yet.</p>
                          ) : (
                            selectedCourse?.projectsDetails?.map((project, idx) => (
                              <div key={idx} className="bg-gray-900 p-4 rounded-xl flex items-center justify-between group border border-gray-800">
                                <div className="flex items-center gap-4">
                                  <div className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center text-xs text-purple-400 font-bold">
                                    {idx + 1}
                                  </div>
                                  <div>
                                    <p className="text-white font-medium text-sm">{project.title}</p>
                                    <p className="text-gray-500 text-xs">Deadline: {project.deadline}</p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleDeleteProject(project._id)}
                                  className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : modalMode === "view" ? (
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

                    {/* Videos Section */}
                    <div className="pt-4 border-t border-gray-700">
                      <h3 className="text-white font-semibold flex items-center gap-2 mb-4">
                        <Video className="w-5 h-5 text-blue-400" />
                        Videos ({selectedCourse?.videoLectures?.length || 0})
                      </h3>
                      <div className="space-y-2">
                        {selectedCourse?.videoLectures?.length > 0 ? (
                          selectedCourse.videoLectures.map((video, idx) => (
                            <div key={idx} className="p-3 bg-gray-900/50 rounded-lg border border-gray-700 flex justify-between items-center">
                              <span className="text-sm text-white">
                                <span className="text-gray-500 mr-2">{idx + 1}.</span>
                                {video.title}
                              </span>
                              <span className="text-xs text-gray-500">{video.duration}</span>
                            </div>
                          ))
                        ) : <p className="text-sm text-gray-500 italic">No videos added yet</p>}
                      </div>
                    </div>

                    {/* Tasks Section */}
                    <div className="pt-4 border-t border-gray-700">
                      <h3 className="text-white font-semibold flex items-center gap-2 mb-4">
                        <ClipboardList className="w-5 h-5 text-green-400" />
                        Tasks ({selectedCourse?.assignments?.length || 0})
                      </h3>
                      <div className="space-y-2">
                        {selectedCourse?.assignments?.length > 0 ? (
                          selectedCourse.assignments.map((task, idx) => (
                            <div key={idx} className="p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-sm text-white font-medium">{task.title}</span>
                                <span className="text-xs px-2 py-0.5 bg-green-500/10 text-green-400 rounded-full">{task.difficulty}</span>
                              </div>
                              <p className="text-xs text-gray-500">{task.points} Points • {task.deadline}</p>
                            </div>
                          ))
                        ) : <p className="text-sm text-gray-500 italic">No tasks added yet</p>}
                      </div>
                    </div>

                    {/* Projects Section */}
                    <div className="pt-4 border-t border-gray-700">
                      <h3 className="text-white font-semibold flex items-center gap-2 mb-4">
                        <FileCode className="w-5 h-5 text-purple-400" />
                        Projects ({selectedCourse?.projectsDetails?.length || 0})
                      </h3>
                      <div className="space-y-2">
                        {selectedCourse?.projectsDetails?.length > 0 ? (
                          selectedCourse.projectsDetails.map((project, idx) => (
                            <div key={idx} className="p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                              <p className="text-sm text-white font-medium mb-1">{project.title}</p>
                              <p className="text-xs text-gray-500">Deadline: {project.deadline}</p>
                            </div>
                          ))
                        ) : <p className="text-sm text-gray-500 italic">No projects added yet</p>}
                      </div>
                    </div>

                    {/* Materials Section */}
                    <div className="pt-4 border-t border-gray-700">
                      <h3 className="text-white font-semibold flex items-center gap-2 mb-4">
                        <BookOpen className="w-5 h-5 text-orange-400" />
                        Materials ({selectedCourse?.resources?.length || 0})
                      </h3>
                      <div className="space-y-2">
                        {selectedCourse?.resources?.length > 0 ? (
                          selectedCourse.resources.map((res, idx) => (
                            <div key={idx} className="p-3 bg-gray-900/50 rounded-lg border border-gray-700 flex justify-between items-center">
                              <span className="text-sm text-white font-medium">{res.title}</span>
                              <span className="text-xs px-2 py-0.5 bg-orange-500/10 text-orange-400 rounded-full capitalize">{res.type}</span>
                            </div>
                          ))
                        ) : <p className="text-sm text-gray-500 italic">No materials added yet</p>}
                      </div>
                    </div>
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
                      <label className="text-sm text-gray-400 mb-2 block">Description *</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows="3"
                        required
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

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">Instructor *</label>
                        {currentUser.role === 'admin' ? (
                          <select
                            value={formData.instructorEmail}
                            onChange={(e) => {
                              const inst = instructors.find(i => i.email === e.target.value);
                              setFormData({
                                ...formData,
                                instructorEmail: e.target.value,
                                instructor: inst ? inst.name : ""
                              });
                            }}
                            required
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500 outline-none"
                          >
                            <option value="">Select Instructor</option>
                            {instructors.map(inst => (
                              <option key={inst.email} value={inst.email}>{inst.name} ({inst.email})</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="text"
                            value={formData.instructor}
                            readOnly
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white opacity-50 cursor-not-allowed"
                          />
                        )}
                      </div>
                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">Instructor Email *</label>
                        <input
                          type="email"
                          value={formData.instructorEmail}
                          readOnly
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white opacity-50 placeholder-gray-400 outline-none"
                          placeholder="instructor@example.com"
                        />
                      </div>
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
      <ConfirmModal
        isOpen={confirmModal.show}
        onClose={() => setConfirmModal(prev => ({ ...prev, show: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        type={confirmModal.type}
      />
    </div>
  );
};

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, type = "danger" }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gray-800 rounded-2xl border border-gray-700 max-w-md w-full p-6 shadow-2xl"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className={`p-3 rounded-xl ${type === 'danger' ? 'bg-red-500/20 text-red-500' : 'bg-blue-500/20 text-blue-500'}`}>
                {type === 'danger' ? <Trash2 className="w-6 h-6" /> : <CheckCircle className="w-6 h-6" />}
              </div>
              <h3 className="text-xl font-bold text-white">{title}</h3>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              {message}
            </p>
            <div className="flex gap-3">
              <button
                onClick={onConfirm}
                className={`flex-1 py-3 rounded-xl font-semibold transition-all ${type === 'danger'
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
              >
                Confirm
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-semibold transition-all"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AdminCourses;
