const Course = require('../models/Course');
const AdminCourse = require('../models/AdminCourse');
const Admin = require('../models/Admin');
const sendEmail = require('../utils/sendEmail');
const Notification = require('../models/Notification');
const mongoose = require('mongoose');
const Enrollment = require('../models/Enrollment');
const User = require('../models/User');

// @desc    Get all courses (from both Course and AdminCourse collections)
// @route   GET /api/admin/courses
// @access  Private
exports.getAllCourses = async (req, res) => {
  try {
    const { search, category, level, status, instructorEmail, page = 1, limit = 10 } = req.query;

    const query = {};

    if (instructorEmail) {
      query.instructorEmail = instructorEmail;
    }

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
    let course = await Course.findById(req.params.id);

    if (!course) {
      course = await AdminCourse.findById(req.params.id);
    }

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

    // Send notification and email to instructor
    if (emailToSave) {
      try {
        // 1. Create In-App Notification
        await Notification.create({
          recipientEmail: emailToSave.toLowerCase(),
          title: '🎓 New Course Assigned',
          message: `A new course "${title}" has been assigned to you by Admin.`,
          type: 'general'
        });
        console.log(`🔔 Notification created for ${emailToSave}`);

        // 2. Send Professional Email
        const emailHTML = `
          <!DOCTYPE html>
          <html>
          <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f4f7;">
            <div style="max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
              <div style="background: #4f46e5; padding: 30px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 24px;">New Course Assignment</h1>
              </div>
              <div style="padding: 30px; color: #333333; line-height: 1.6;">
                <h2 style="color: #111827;">Hello ${instructor || 'Instructor'},</h2>
                <p>You have been assigned as the instructor for a new course on <strong>E-Shikshan</strong>.</p>
                <div style="background: #f9fafb; border-left: 4px solid #4f46e5; padding: 20px; margin: 20px 0;">
                  <p style="margin: 0;"><strong>Course:</strong> ${title}</p>
                  <p style="margin: 5px 0 0 0;"><strong>Category:</strong> ${category}</p>
                  <p style="margin: 5px 0 0 0;"><strong>Level:</strong> ${level}</p>
                </div>
                <p>Please log in to your instructor dashboard to manage the course content, add lessons, and engage with students.</p>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/instructor/dashboard" 
                     style="background: #4f46e5; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                    Access Dashboard
                  </a>
                </div>
              </div>
              <div style="background: #f3f4f6; padding: 20px; text-align: center; color: #6b7280; font-size: 12px;">
                <p>© 2026 E-Shikshan Platform. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `;

        setImmediate(async () => {
          try {
            await sendEmail({
              to: emailToSave,
              subject: `🎓 New Course Assigned: ${title}`,
              html: emailHTML
            });
            console.log(`✅ Course assignment email sent to ${emailToSave}`);
          } catch (emailError) {
            console.error('❌ Failed to send email:', emailError);
          }
        });
      } catch (notiError) {
        console.error('❌ Notification system error:', notiError);
      }
    }

    // Send response
    res.status(201).json({ success: true, course });
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
    let course = await Course.findById(req.params.id);
    let isMainCourse = true;

    if (!course) {
      course = await AdminCourse.findById(req.params.id);
      isMainCourse = false;
    }

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const oldEmail = course.instructorEmail;
    const oldInstructor = course.instructor;

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

    // Notification Logic for update
    const newEmail = course.instructorEmail;
    const newInstructor = course.instructor;

    // 1. If instructor changed (unassigned old one)
    if (oldEmail && oldEmail.toLowerCase() !== newEmail?.toLowerCase()) {
      await sendUnassignmentNotification(oldEmail, oldInstructor, course.title);
    }

    // 2. If new instructor assigned and it's different from old one
    if (newEmail && newEmail.toLowerCase() !== oldEmail?.toLowerCase()) {
      // Re-use logic for assignment notification
      try {
        await Notification.create({
          recipientEmail: newEmail.toLowerCase(),
          title: '🎓 New Course Assigned',
          message: `A new course "${course.title}" has been assigned to you by Admin.`,
          type: 'general'
        });

        const emailHTML = `
          <!DOCTYPE html>
          <html>
          <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f4f7;">
            <div style="max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
              <div style="background: #4f46e5; padding: 30px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 24px;">New Course Assignment</h1>
              </div>
              <div style="padding: 30px; color: #333333; line-height: 1.6;">
                <h2 style="color: #111827;">Hello ${newInstructor || 'Instructor'},</h2>
                <p>You have been assigned as the instructor for a course on <strong>E-Shikshan</strong>.</p>
                <div style="background: #f9fafb; border-left: 4px solid #4f46e5; padding: 20px; margin: 20px 0;">
                  <p style="margin: 0;"><strong>Course:</strong> ${course.title}</p>
                </div>
                <p>Please log in to your instructor dashboard to manage the course content.</p>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/instructor/dashboard" 
                     style="background: #4f46e5; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                    Access Dashboard
                  </a>
                </div>
              </div>
            </div>
          </body>
          </html>
        `;

        setImmediate(() => {
          sendEmail({
            to: newEmail,
            subject: `🎓 New Course Assigned: ${course.title}`,
            html: emailHTML
          }).catch(e => console.error("Email fail:", e));
        });
      } catch (err) {
        console.error("Noti fail:", err);
      }
    }

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
      // Check AdminCourse if not found in Course
      const adminCourse = await AdminCourse.findById(req.params.id);
      if (!adminCourse) {
        return res.status(404).json({ message: 'Course not found' });
      }

      // Hard delete AdminCourse if admin
      if (req.admin.role === 'admin') {
        const instEmail = adminCourse.instructorEmail;
        const instName = adminCourse.instructor;
        const courseTitle = adminCourse.title;

        await AdminCourse.findByIdAndDelete(req.params.id);

        if (instEmail) {
          await sendUnassignmentNotification(instEmail, instName, courseTitle);
        }
        return res.json({ success: true, message: 'Admin course deleted permanently' });
      } else {
        // Instructor trying to delete admin course - just unassign
        const instructorEmail = adminCourse.instructorEmail;
        const instructorName = adminCourse.instructor;
        const courseTitle = adminCourse.title;

        adminCourse.instructorEmail = "";
        adminCourse.instructor = "";
        await adminCourse.save();

        if (instructorEmail) {
          await sendUnassignmentNotification(instructorEmail, instructorName, courseTitle);
        }

        return res.json({ success: true, message: 'Admin course removed from your dashboard' });
      }
    }

    // Role-based deletion logic for Course
    if (req.admin.role === 'admin') {
      const instEmail = course.instructorEmail;
      const instName = course.instructor;
      const courseTitle = course.title;

      // Admins delete permanently
      await Course.findByIdAndDelete(req.params.id);

      if (instEmail) {
        await sendUnassignmentNotification(instEmail, instName, courseTitle);
      }
      console.log(`🗑️ Course ${req.params.id} deleted permanently by Admin ${req.admin.email}`);
      res.json({ success: true, message: 'Course deleted permanently' });
    } else {
      // Instructors (course_manager) only remove for themselves
      const instructorEmail = course.instructorEmail;
      const instructorName = course.instructor;
      const courseTitle = course.title;

      course.instructorEmail = "";
      course.instructor = ""; // Also clear name
      await course.save();

      if (instructorEmail) {
        await sendUnassignmentNotification(instructorEmail, instructorName, courseTitle);
      }

      console.log(`👋 Course ${req.params.id} unassigned by Instructor ${req.admin.email}`);
      res.json({ success: true, message: 'Course removed from your dashboard' });
    }
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all instructors (admins with role course_manager)
// @route   GET /api/admin/courses/instructors
// @access  Private
exports.getInstructors = async (req, res) => {
  try {
    const instructors = await Admin.find({ role: 'course_manager', isActive: true })
      .select('name email')
      .sort({ name: 1 });

    res.json({ success: true, instructors });
  } catch (error) {
    console.error('Get instructors error:', error);
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

// --- Lesson (Video Lecture) CRUD ---

// @desc    Add lesson to a course
// @route   POST /api/admin/courses/:id/lessons
exports.addLesson = async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);
    if (!course) {
      course = await AdminCourse.findById(req.params.id);
    }
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const { title, duration, url, free, order } = req.body;
    course.videoLectures.push({ title, duration, url, free: free || false, order: order || 0 });

    // Update total videos count
    course.totalVideos = course.videoLectures.length;

    await course.save();
    res.status(201).json({ success: true, course });
  } catch (error) {
    console.error('Add lesson error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update lesson in a course
// @route   PUT /api/admin/courses/:id/lessons/:lessonId
exports.updateLesson = async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);
    if (!course) {
      course = await AdminCourse.findById(req.params.id);
    }
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const lesson = course.videoLectures.id(req.params.lessonId);
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });

    const { title, duration, url, free, order } = req.body;
    if (title) lesson.title = title;
    if (duration) lesson.duration = duration;
    if (url) lesson.url = url;
    if (free !== undefined) lesson.free = free;
    if (order !== undefined) lesson.order = order;

    await course.save();
    res.json({ success: true, course });
  } catch (error) {
    console.error('Update lesson error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete lesson from a course
// @route   DELETE /api/admin/courses/:id/lessons/:lessonId
exports.deleteLesson = async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);
    if (!course) {
      course = await AdminCourse.findById(req.params.id);
    }
    if (!course) return res.status(404).json({ message: 'Course not found' });

    course.videoLectures.pull({ _id: req.params.lessonId });
    course.totalVideos = course.videoLectures.length;

    await course.save();
    res.json({ success: true, message: 'Lesson removed', course });
  } catch (error) {
    console.error('Delete lesson error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// --- Project CRUD ---

// @desc    Add project to a course
// @route   POST /api/admin/courses/:id/projects
exports.addProject = async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);
    if (!course) {
      course = await AdminCourse.findById(req.params.id);
    }
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const { title, description, duration, instructions, deadline, submitUrl, askAdminUrl } = req.body;
    course.projectsDetails.push({
      title, description, duration, instructions, deadline, submitUrl, askAdminUrl
    });

    course.projects = course.projectsDetails.length;

    await course.save();
    res.status(201).json({ success: true, course });
  } catch (error) {
    console.error('Add project error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update project in a course
// @route   PUT /api/admin/courses/:id/projects/:projectId
exports.updateProject = async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);
    if (!course) {
      course = await AdminCourse.findById(req.params.id);
    }
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const project = course.projectsDetails.id(req.params.projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const updates = req.body;
    const fields = ['title', 'description', 'duration', 'instructions', 'deadline', 'submitUrl', 'askAdminUrl'];

    fields.forEach(field => {
      if (updates[field] !== undefined) project[field] = updates[field];
    });

    await course.save();
    res.json({ success: true, course });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete project from a course
// @route   DELETE /api/admin/courses/:id/projects/:projectId
exports.deleteProject = async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);
    if (!course) {
      course = await AdminCourse.findById(req.params.id);
    }
    if (!course) return res.status(404).json({ message: 'Course not found' });

    course.projectsDetails.pull({ _id: req.params.projectId });
    course.projects = course.projectsDetails.length;

    await course.save();
    res.json({ success: true, message: 'Project removed', course });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// --- Assignment (Task) CRUD ---

// @desc    Add assignment to a course
// @route   POST /api/admin/courses/:id/assignments
exports.addAssignment = async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);
    if (!course) {
      course = await AdminCourse.findById(req.params.id);
    }
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const { title, description, difficulty, points, instructions, deadline } = req.body;
    course.assignments.push({
      title, description, difficulty, points, instructions, deadline
    });

    course.totalTasks = course.assignments.length;

    await course.save();
    res.status(201).json({ success: true, course });
  } catch (error) {
    console.error('Add assignment error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update assignment in a course
// @route   PUT /api/admin/courses/:id/assignments/:assignmentId
exports.updateAssignment = async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);
    if (!course) {
      course = await AdminCourse.findById(req.params.id);
    }
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const assignment = course.assignments.id(req.params.assignmentId);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

    const updates = req.body;
    const fields = ['title', 'description', 'difficulty', 'points', 'instructions', 'deadline'];

    fields.forEach(field => {
      if (updates[field] !== undefined) assignment[field] = updates[field];
    });

    await course.save();
    res.json({ success: true, course });
  } catch (error) {
    console.error('Update assignment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete assignment from a course
// @route   DELETE /api/admin/courses/:id/assignments/:assignmentId
exports.deleteAssignment = async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);
    if (!course) {
      course = await AdminCourse.findById(req.params.id);
    }
    if (!course) return res.status(404).json({ message: 'Course not found' });

    course.assignments.pull({ _id: req.params.assignmentId });
    course.totalTasks = course.assignments.length;

    await course.save();
    res.json({ success: true, message: 'Assignment removed', course });
  } catch (error) {
    console.error('Delete assignment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// --- Resource (Material) CRUD ---

// @desc    Add resource to a course
// @route   POST /api/admin/courses/:id/resources
exports.addResource = async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);
    if (!course) {
      course = await AdminCourse.findById(req.params.id);
    }
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const { title, url, type } = req.body;
    course.resources.push({ title, url, type: type || 'pdf' });

    await course.save();
    res.status(201).json({ success: true, course });
  } catch (error) {
    console.error('Add resource error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete resource from a course
// @route   DELETE /api/admin/courses/:id/resources/:resourceId
exports.deleteResource = async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);
    if (!course) {
      course = await AdminCourse.findById(req.params.id);
    }
    if (!course) return res.status(404).json({ message: 'Course not found' });

    course.resources.pull({ _id: req.params.resourceId });

    await course.save();
    res.json({ success: true, message: 'Resource removed', course });
  } catch (error) {
    console.error('Delete resource error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all students enrolled in a course
// @route   GET /api/admin/courses/:id/enrollments
exports.getCourseEnrollments = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`\n👨‍🎓 [DEBUG] Fetching enrollments for ID: ${id}`);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log(`  ❌ ID is NOT a valid ObjectId: ${id}`);
      return res.status(400).json({ message: 'Invalid Course ID format' });
    }

    // Check if course exists and if manager has access
    let course = await Course.findById(id);
    let source = 'Normal Course';

    if (!course) {
      console.log(`  🔍 Not found in Normal courses, checking Admin courses...`);
      course = await AdminCourse.findById(id);
      source = 'Admin Course';
    }

    if (!course) {
      console.log(`  ❌ Course ${id} NOT FOUND in any collection (checked Course and AdminCourse)`);
      return res.status(404).json({ message: `Course not found (checked both collections for ID ${id})` });
    }

    console.log(`  ✅ Found course in ${source}. Title: "${course.title}"`);

    // If manager, check if it's their course
    if (req.admin && req.admin.role === 'course_manager') {
      const instructorEmail = (course.instructorEmail || '').toLowerCase();
      const adminEmail = (req.admin.email || '').toLowerCase();

      console.log(`  🔒 Auth Check: Instructor(${instructorEmail}) vs Requester(${adminEmail})`);

      if (instructorEmail !== adminEmail) {
        console.log(`  🚫 Auth Failed: Instructor email mismatch`);
        return res.status(403).json({
          message: 'Access denied: You are not the instructor for this course',
          debug: { courseInstructor: instructorEmail, yourEmail: adminEmail }
        });
      }
    }

    console.log(`  🔍 Querying Enrollments for ${id}...`);
    const enrollments = await Enrollment.find({ courseId: id })
      .populate('userId', 'name email role')
      .sort('-enrolledAt');

    console.log(`  ✅ Found ${enrollments.length} enrollments`);

    res.json({
      success: true,
      count: enrollments.length,
      enrollments
    });
  } catch (error) {
    console.error('🔥 CRITICAL ERROR in getCourseEnrollments:', error);
    res.status(500).json({ message: 'Server error while fetching roster', error: error.message });
  }
};

// Helper for unassignment notifications
async function sendUnassignmentNotification(email, name, title) {
  try {
    // 1. In-App Notification
    await Notification.create({
      recipientEmail: email.toLowerCase(),
      title: '👋 Course Unassigned',
      message: `The course "${title}" has been unassigned from your profile.`,
      type: 'general'
    });

    // 2. Email Notification
    const emailHTML = `
      <!DOCTYPE html>
      <html>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f4f7;">
        <div style="max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
          <div style="background: #ef4444; padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Course Unassigned</h1>
          </div>
          <div style="padding: 30px; color: #333333; line-height: 1.6;">
            <h2 style="color: #111827;">Hello ${name || 'Instructor'},</h2>
            <p>You have been unassigned from the following course on <strong>E-Shikshan</strong>:</p>
            <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 20px; margin: 20px 0;">
              <p style="margin: 0;"><strong>Course:</strong> ${title}</p>
            </div>
            <p>If this was not expected, please contact your administrator.</p>
          </div>
          <div style="background: #f3f4f6; padding: 20px; text-align: center; color: #6b7280; font-size: 12px;">
            <p>© 2026 E-Shikshan Platform. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    setImmediate(() => {
      sendEmail({
        to: email,
        subject: `👋 Course Unassigned: ${title}`,
        html: emailHTML
      }).catch(e => console.error("Email error:", e));
    });
    console.log(`🔔 Unassignment notification sent to ${email}`);
  } catch (err) {
    console.error("Notification system error:", err);
  }
}
