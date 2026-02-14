const Course = require('../models/Course');
const AdminCourse = require('../models/AdminCourse');
const sendEmail = require('../utils/sendEmail');

// @desc    Get all courses (from both Course and AdminCourse collections)
// @route   GET /api/admin/courses
// @access  Private
exports.getAllCourses = async (req, res) => {
  try {
    const { search, category, level, status, page = 1, limit = 10 } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { instructor: { $regex: search, $options: 'i' } }
      ];
    }

    if (category && category !== 'all' && category !== 'All') {
      query.category = category;
    }

    if (level && level !== 'all' && level !== 'All') {
      query.level = level;
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    // Filter by instructor email if user is a course_manager
    if (req.admin && req.admin.role === 'course_manager') {
      query.instructorEmail = req.admin.email;
    }

    // Fetch from both Course and AdminCourse collections
    const [normalCourses, adminCourses] = await Promise.all([
      Course.find(query)
        .sort({ createdAt: -1 })
        .select('-videoLectures -assignments -projectsDetails')
        .lean(),
      AdminCourse.find(query)
        .sort({ createdAt: -1 })
        .select('-videoLectures -assignments -projectsDetails')
        .lean()
    ]);

    // Mark courses with their source
    const coursesWithSource = [
      ...normalCourses.map(c => ({ ...c, source: 'normal' })),
      ...adminCourses.map(c => ({ ...c, source: 'admin' }))
    ];

    // Sort combined courses by creation date
    coursesWithSource.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedCourses = coursesWithSource.slice(startIndex, endIndex);

    const totalCount = coursesWithSource.length;

    res.json({
      success: true,
      courses: paginatedCourses,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: parseInt(page),
      total: totalCount,
    });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single course
// @route   GET /api/admin/courses/:id
// @access  Private
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json({ success: true, course });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create new course
// @route   POST /api/admin/courses
// @access  Private
exports.createCourse = async (req, res) => {
  try {
    console.log('📝 Creating course with data:', req.body);
    console.log('👤 Admin info:', { role: req.admin?.role, email: req.admin?.email });

    const {
      title,
      category,
      level,
      duration,
      status,
      description,
      instructor,
      instructorBio,
      thumbnail,
      price,
      priceAmount,
      skills,
      prerequisites,
      whatYoullLearn,
      syllabus,
      certificate,
      language,
      subtitles,
      instructorEmail // New field
    } = req.body;

    // Determine instructor email
    const emailToSave = req.admin?.role === 'course_manager' ? req.admin?.email : instructorEmail;
    console.log('📧 Email to save:', emailToSave);

    const courseData = {
      title,
      category,
      level,
      duration,
      status: status || 'draft',
      description,
      instructor,
      instructorEmail: emailToSave,
      instructorBio,
      thumbnail,
      price: price || 'Free',
      priceAmount: priceAmount || 0,
      skills: skills || [],
      prerequisites: prerequisites || [],
      whatYoullLearn: whatYoullLearn || [],
      syllabus: syllabus || [],
      certificate: certificate || false,
      language: language || 'English',
      subtitles: subtitles || [],
      createdBy: req.admin?._id
    };

    console.log('💾 Attempting to create course with data:', courseData);

    const course = await Course.create(courseData);
    console.log('✅ Course created successfully:', course._id);

    // Send response
    res.status(201).json({ success: true, course });

    // TODO: Re-enable email after fixing core issue
    // Send email notification asynchronously (non-blocking)
    // if (req.admin?.role === 'admin' && emailToSave) {
    //   setImmediate(async () => {
    //     try {
    //       await sendEmail({
    //         to: emailToSave,
    //         subject: `🎓 New Course Assigned: ${title}`,
    //         html: emailHTML
    //       });
    //       console.log(`✅ Course assignment email sent to ${emailToSave}`);
    //     } catch (emailError) {
    //       console.error('❌ Failed to send course assignment email:', emailError);
    //     }
    //   });
    // }
  } catch (error) {
    console.error('Create course error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      message: 'Server error',
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// @desc    Update course
// @route   PUT /api/admin/courses/:id
// @access  Private
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Update fields if provided
    const updates = req.body;
    const allowedFields = [
      'title', 'category', 'level', 'duration', 'status', 'description',
      'instructor', 'instructorEmail', 'instructorBio', 'thumbnail', 'price', 'priceAmount',
      'skills', 'prerequisites', 'whatYoullLearn', 'syllabus',
      'certificate', 'language', 'subtitles', 'videoLectures',
      'assignments', 'projectsDetails', 'rating'
    ];

    allowedFields.forEach(field => {
      if (updates[field] !== undefined) {
        course[field] = updates[field];
      }
    });

    await course.save();

    res.json({ success: true, course });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete course
// @route   DELETE /api/admin/courses/:id
// @access  Private
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    await course.deleteOne();

    res.json({ success: true, message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get course statistics
// @route   GET /api/admin/courses/stats
// @access  Private
exports.getCourseStats = async (req, res) => {
  try {
    const isManager = req.admin && req.admin.role === 'course_manager';
    const query = isManager ? { instructorEmail: req.admin.email } : {};

    const total = await Course.countDocuments(query);
    const active = await Course.countDocuments({ ...query, status: 'active' });
    const draft = await Course.countDocuments({ ...query, status: 'draft' });
    const archived = await Course.countDocuments({ ...query, status: 'archived' });

    const totalStudentsResult = await Course.aggregate([
      { $match: query },
      { $group: { _id: null, total: { $sum: '$students' } } }
    ]);

    res.json({
      success: true,
      stats: {
        total,
        active,
        draft,
        archived,
        totalStudents: totalStudentsResult[0]?.total || 0
      },
    });
  } catch (error) {
    console.error('Get course stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
