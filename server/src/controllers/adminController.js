const User = require('../models/User');
const Admin = require('../models/Admin');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const AdminHackathon = require('../models/AdminHackathon');
const AdminJob = require('../models/AdminJob');
const AdminRoadmap = require('../models/AdminRoadmap');
const AdminContent = require('../models/AdminContent');
const AdminCourse = require('../models/AdminCourse');
const Doubt = require('../models/Doubt');

// @desc    Get all users with their enrollments
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const { search, role, page = 1, limit = 10 } = req.query;

    // Build query
    const userQuery = {};
    if (search) {
      userQuery.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (role) {
      userQuery.role = role;
    }

    // Build admin query (include only when appropriate)
    const includeAdmins = true; // include Admin collection by default
    const adminQuery = {};
    if (search) {
      adminQuery.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (role) {
      // Only include admins if filtering by 'admin' or 'course_manager'
      if (role === 'admin' || role === 'course_manager') {
        adminQuery.role = role;
      } else {
        // Exclude admin records for non-admin/instructor role filters
        adminQuery.role = '__exclude__';
      }
    }

    // Fetch all matching users (we'll paginate after combining with admins)
    const allUsers = await User.find(userQuery)
      .select('-password')
      .sort('-createdAt');

    // Map users with enrollment counts
    const usersWithEnrollments = await Promise.all(
      allUsers.map(async (user) => {
        const enrollmentCount = await Enrollment.countDocuments({ userId: user._id });
        const enrollments = await Enrollment.find({ userId: user._id })
          .populate('courseId', 'title price priceAmount thumbnail')
          .select('courseId paymentStatus status enrolledAt progress');

        return {
          ...user.toObject(),
          accountType: 'user',
          enrollmentCount,
          enrollments
        };
      })
    );

    // Fetch admins and normalize shape
    let adminsNormalized = [];
    if (includeAdmins) {
      const adminFindQuery = adminQuery.role === '__exclude__' ? { _id: null } : adminQuery;
      const admins = await Admin.find(adminFindQuery).sort('-createdAt');
      adminsNormalized = await Promise.all(admins.map(async (admin) => {
        let assignedCount = 0;
        if (admin.role === 'course_manager') {
          assignedCount = await Course.countDocuments({ instructorEmail: admin.email });
        }

        return {
          _id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          isAdmin: admin.role === 'admin',
          accountType: 'admin',
          joinedDate: admin.createdAt,
          phone: undefined,
          university: undefined,
          department: undefined,
          semester: undefined,
          enrollmentCount: assignedCount, // Use this for course count in table
          enrollments: [],
          createdAt: admin.createdAt,
          updatedAt: admin.updatedAt,
        };
      }));
    }

    // Combine and paginate
    const combined = [...usersWithEnrollments, ...adminsNormalized]
      .sort((a, b) => new Date(b.createdAt || b.joinedDate || 0) - new Date(a.createdAt || a.joinedDate || 0));

    const total = combined.length;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const start = (pageNum - 1) * limitNum;
    const end = start + limitNum;
    const paged = combined.slice(start, end);

    res.json({
      users: paged,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum) || 1,
        limit: limitNum
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      message: 'Failed to fetch users',
      error: error.message
    });
  }
};

// @desc    Get single user with enrollments
// @route   GET /api/admin/users/:id
// @access  Private/Admin
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // Try standard user first
    let user = await User.findById(id).select('-password');
    if (user) {
      const enrollments = await Enrollment.find({ userId: id })
        .populate('courseId')
        .sort('-enrolledAt');
      return res.json({ user, enrollments });
    }

    // Try admin account
    const admin = await Admin.findById(id);
    if (admin) {
      // If instructor, fetch assigned courses
      let assignedCourses = [];
      if (admin.role === 'course_manager') {
        const [normalAssigned, adminAssigned] = await Promise.all([
          Course.find({ instructorEmail: admin.email })
            .select('title category level duration status students priceAmount'),
          AdminCourse.find({ instructorEmail: admin.email })
            .select('title category level duration status students priceAmount')
        ]);
        assignedCourses = [...normalAssigned, ...adminAssigned];
      }

      const normalized = {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        isAdmin: admin.role === 'admin',
        joinedDate: admin.createdAt,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt,
      };
      return res.json({ user: normalized, enrollments: [], assignedCourses });
    }

    return res.status(404).json({ message: 'User not found' });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      message: 'Failed to fetch user',
      error: error.message
    });
  }
};

// @desc    Update user role/admin status
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, isAdmin } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (role) {
      user.role = role;
    }
    if (typeof isAdmin === 'boolean') {
      user.isAdmin = isAdmin;
    }

    await user.save();

    res.json({
      message: 'User role updated successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({
      message: 'Failed to update user role',
      error: error.message
    });
  }
};

// @desc    Grant course access to user
// @route   POST /api/admin/enrollments/grant
// @access  Private/Admin
const grantCourseAccess = async (req, res) => {
  try {
    const { userId, courseId, userDetails } = req.body;

    if (!userId || !courseId) {
      return res.status(400).json({
        message: 'User ID and Course ID are required'
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if enrollment already exists
    let enrollment = await Enrollment.findOne({ userId, courseId });

    if (enrollment) {
      // Update existing enrollment
      enrollment.paymentStatus = 'completed';
      enrollment.status = 'active';
      enrollment.paymentMethod = 'admin_granted';
      enrollment.amountPaid = 0;
      enrollment.paymentDate = new Date();

      await enrollment.save();

      return res.json({
        message: 'Course access updated successfully',
        enrollment
      });
    }

    // Create new enrollment with admin grant
    enrollment = new Enrollment({
      userId,
      courseId,
      userDetails: userDetails || {
        fullName: user.name,
        email: user.email,
        phone: user.phone || ''
      },
      paymentStatus: 'completed',
      paymentMethod: 'admin_granted',
      amountPaid: 0,
      status: 'active',
      paymentDate: new Date(),
      enrolledAt: new Date()
    });

    await enrollment.save();

    // Increment student count
    course.students += 1;
    await course.save();

    res.status(201).json({
      message: 'Course access granted successfully',
      enrollment
    });
  } catch (error) {
    console.error('Grant access error:', error);
    res.status(500).json({
      message: 'Failed to grant course access',
      error: error.message
    });
  }
};

// @desc    Revoke course access from user
// @route   PUT /api/admin/enrollments/:id/revoke
// @access  Private/Admin
const revokeCourseAccess = async (req, res) => {
  try {
    const { id } = req.params;

    const enrollment = await Enrollment.findById(id);
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    // Update enrollment status to suspended
    enrollment.status = 'suspended';
    await enrollment.save();

    res.json({
      message: 'Course access revoked successfully',
      enrollment
    });
  } catch (error) {
    console.error('Revoke access error:', error);
    res.status(500).json({
      message: 'Failed to revoke course access',
      error: error.message
    });
  }
};

// @desc    Restore course access to user
// @route   PUT /api/admin/enrollments/:id/restore
// @access  Private/Admin
const restoreCourseAccess = async (req, res) => {
  try {
    const { id } = req.params;

    const enrollment = await Enrollment.findById(id);
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    // Restore enrollment status
    enrollment.status = 'active';
    await enrollment.save();

    res.json({
      message: 'Course access restored successfully',
      enrollment
    });
  } catch (error) {
    console.error('Restore access error:', error);
    res.status(500).json({
      message: 'Failed to restore course access',
      error: error.message
    });
  }
};

// @desc    Delete enrollment
// @route   DELETE /api/admin/enrollments/:id
// @access  Private/Admin
const deleteEnrollment = async (req, res) => {
  try {
    const { id } = req.params;

    const enrollment = await Enrollment.findById(id);
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    // Decrement student count
    const course = await Course.findById(enrollment.courseId);
    if (course && course.students > 0) {
      course.students -= 1;
      await course.save();
    }

    await Enrollment.findByIdAndDelete(id);

    res.json({
      message: 'Enrollment deleted successfully'
    });
  } catch (error) {
    console.error('Delete enrollment error:', error);
    res.status(500).json({
      message: 'Failed to delete enrollment',
      error: error.message
    });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    const adminRole = req.admin?.role?.toLowerCase();
    const isManager = adminRole === 'course_manager' || adminRole === 'instructor' || adminRole === 'faculty';
    const courseQuery = isManager ? { instructorEmail: req.admin.email } : {};

    // Filter total users/students
    let totalUsers;
    let totalStudents;
    if (isManager) {
      const instructorCourses = await Course.find(courseQuery).select('_id');
      const courseIds = instructorCourses.map(c => c._id);
      const uniqueStudentIds = await Enrollment.distinct('userId', { courseId: { $in: courseIds } });
      totalUsers = uniqueStudentIds.length;
      totalStudents = uniqueStudentIds.length; // For manager, total students equals total unique users they see
    } else {
      totalUsers = await User.countDocuments();
      totalStudents = await User.countDocuments({ role: 'student' });
    }
    console.log(`[DEBUG] Dashboard Stats Request - Role: ${adminRole}, Manager: ${isManager}, Students: ${totalStudents}`);

    const totalCourses = await Course.countDocuments(courseQuery);
    const activeCourses = await Course.countDocuments({ ...courseQuery, status: 'active' });
    const draftCourses = await Course.countDocuments({ ...courseQuery, status: 'draft' });
    const archivedCourses = await Course.countDocuments({ ...courseQuery, status: 'archived' });

    // Top courses by enrollment (manager filtered)
    const topCourses = await Course.find({ ...courseQuery, status: 'active' })
      .select('title students thumbnail category rating')
      .sort('-students')
      .limit(5);

    // Filter enrollments if manager
    let enrollmentQuery = {};
    if (isManager) {
      // Get all course IDs owned by this manager
      const managerCourses = await Course.find(courseQuery).select('_id');
      const courseIds = managerCourses.map(c => c._id);
      enrollmentQuery = { courseId: { $in: courseIds } };
    }

    const totalEnrollments = await Enrollment.countDocuments(enrollmentQuery);
    const activeEnrollments = await Enrollment.countDocuments({ ...enrollmentQuery, status: 'active' });
    const suspendedEnrollments = await Enrollment.countDocuments({ ...enrollmentQuery, status: 'suspended' });

    // Admin only stats (hide or zero for manager)
    const totalHackathons = isManager ? 0 : await AdminHackathon.countDocuments();
    const activeHackathons = isManager ? 0 : await AdminHackathon.countDocuments({ status: 'active' });
    const totalJobs = isManager ? 0 : await AdminJob.countDocuments();
    const activeJobs = isManager ? 0 : await AdminJob.countDocuments({ status: 'Active' });

    // Courses by category
    const coursesByCategory = await Course.aggregate([
      { $match: { ...courseQuery, status: 'active' } },
      { $group: { _id: '$category', count: { $sum: 1 }, students: { $sum: '$students' } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Recent enrollments (filtered for manager)
    const recentEnrollments = await Enrollment.find(enrollmentQuery)
      .populate('userId', 'name email')
      .populate('courseId', 'title price')
      .sort('-enrolledAt')
      .limit(10);

    // Revenue calculation (only completed payments, filtered for manager)
    const revenueMatch = {
      paymentStatus: { $in: ['completed', 'active'] },
      ...enrollmentQuery
    };
    const revenueData = await Enrollment.aggregate([
      { $match: revenueMatch },
      { $group: { _id: null, totalRevenue: { $sum: '$amountPaid' } } }
    ]);
    const totalRevenue = revenueData[0]?.totalRevenue || 0;

    // Roadmaps for dashboard
    const totalRoadmaps = await AdminRoadmap.countDocuments();
    const activeRoadmaps = await AdminRoadmap.countDocuments({ status: 'active' });
    const recentRoadmaps = await AdminRoadmap.find({ status: 'active' })
      .select('title category thumbnail level steps')
      .sort('-createdAt')
      .limit(6);

    // Content for dashboard
    const totalContent = await AdminContent.countDocuments();
    const publishedContent = await AdminContent.countDocuments({ status: 'published' });
    const contentByType = await AdminContent.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);
    const recentContent = await AdminContent.find()
      .select('title type branch subject status createdAt')
      .sort('-createdAt')
      .limit(10);

    // Trends Aggregation (Last 6 Months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const enrollmentTrend = await Enrollment.aggregate([
      { $match: { ...enrollmentQuery, enrolledAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$enrolledAt" } },
          enrollments: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const userMonthlyTrend = isManager ? [] : await User.aggregate([
      { $match: { role: 'student', createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          users: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Doubts for instructor if applicable
    let doubtsStats = { total: 0, pending: 0, resolved: 0 };
    let recentDoubts = [];
    if (isManager) {
      const doubtQuery = { instructorEmail: req.admin.email };
      doubtsStats.total = await Doubt.countDocuments(doubtQuery);
      doubtsStats.pending = await Doubt.countDocuments({ ...doubtQuery, status: 'pending' });
      doubtsStats.resolved = await Doubt.countDocuments({ ...doubtQuery, status: 'resolved' });
      recentDoubts = await Doubt.find({ ...doubtQuery, status: 'pending' })
        .populate('student', 'name email')
        .populate('course', 'title')
        .sort('-createdAt')
        .limit(10);
    }

    res.json({
      stats: {
        apiVersion: "v2-students-fixed",
        totalUsers,
        totalStudents,
        totalCourses,
        activeCourses,
        draftCourses,
        archivedCourses,
        totalEnrollments,
        activeEnrollments,
        suspendedEnrollments,
        totalRevenue,
        totalHackathons,
        activeHackathons,
        totalJobs,
        activeJobs,
        totalRoadmaps,
        activeRoadmaps,
        totalContent,
        publishedContent,
        doubtsStats
      },
      topCourses,
      coursesByCategory,
      recentEnrollments,
      recentRoadmaps,
      recentContent,
      contentByType,
      recentDoubts,
      enrollmentTrend,
      userMonthlyTrend
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      message: 'Failed to fetch dashboard stats',
      error: error.message
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUserRole,
  // CRUD for users
  async createUser(req, res) {
    try {
      const {
        name,
        email,
        password,
        phone,
        university,
        department,
        semester,
        role = 'student',
        isAdmin = false,
      } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email and password are required' });
      }

      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(400).json({ message: 'A user with this email already exists' });
      }

      const user = new User({
        name,
        email,
        password, // will be hashed by pre-save hook
        phone,
        university,
        department,
        semester,
        role,
        isAdmin: !!isAdmin,
      });
      await user.save();

      const sanitized = user.toObject();
      delete sanitized.password;
      res.status(201).json({ message: 'User created successfully', user: sanitized });
    } catch (error) {
      console.error('Create user error:', error);
      res.status(500).json({ message: 'Failed to create user', error: error.message });
    }
  },

  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body || {};

      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // If email changes, ensure uniqueness
      if (updates.email && updates.email !== user.email) {
        const emailExists = await User.findOne({ email: updates.email });
        if (emailExists) {
          return res.status(400).json({ message: 'Email already in use' });
        }
        user.email = updates.email;
      }

      // Basic fields
      if (typeof updates.name === 'string') user.name = updates.name;
      if (typeof updates.phone === 'string') user.phone = updates.phone;
      if (typeof updates.university === 'string') user.university = updates.university;
      if (typeof updates.department === 'string') user.department = updates.department;
      if (typeof updates.semester === 'string') user.semester = updates.semester;
      if (typeof updates.role === 'string') user.role = updates.role;
      if (typeof updates.isAdmin === 'boolean') user.isAdmin = updates.isAdmin;

      // Password (will trigger pre-save hashing)
      if (updates.password) {
        user.password = updates.password;
      }

      await user.save();

      const sanitized = user.toObject();
      delete sanitized.password;
      res.json({ message: 'User updated successfully', user: sanitized });
    } catch (error) {
      console.error('Update user error:', error);
      res.status(500).json({ message: 'Failed to update user', error: error.message });
    }
  },

  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Clean up enrollments and decrement course student counts
      const userEnrollments = await Enrollment.find({ userId: id });
      for (const enr of userEnrollments) {
        const course = await Course.findById(enr.courseId);
        if (course && course.students > 0) {
          course.students -= 1;
          await course.save();
        }
        await Enrollment.findByIdAndDelete(enr._id);
      }

      await user.deleteOne();
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Delete user error:', error);
      res.status(500).json({ message: 'Failed to delete user', error: error.message });
    }
  },
  grantCourseAccess,
  revokeCourseAccess,
  restoreCourseAccess,
  deleteEnrollment,
  getDashboardStats
};
