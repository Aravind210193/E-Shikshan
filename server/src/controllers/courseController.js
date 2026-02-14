const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res) => {
  try {
    const { category, level, search } = req.query;

    console.log('📚 Get Courses Request:', { category, level, search });

    // Simplified query - don't filter by status if causing issues
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (level && level !== 'All') {
      query.level = level;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { instructor: { $regex: search, $options: 'i' } }
      ];
    }

    console.log('📚 Query:', JSON.stringify(query));

    const courses = await Course.find(query).sort('-createdAt');

    console.log(`📚 Found ${courses.length} courses`);

    // Get enrollment counts for all courses
    const courseIds = courses.map(course => course._id);
    const enrollmentCounts = await Enrollment.aggregate([
      {
        $match: {
          courseId: { $in: courseIds },
          status: { $in: ['active', 'completed'] }
        }
      },
      {
        $group: {
          _id: '$courseId',
          count: { $sum: 1 }
        }
      }
    ]);

    // Create a map of courseId -> enrollment count
    const enrollmentMap = {};
    enrollmentCounts.forEach(item => {
      enrollmentMap[item._id.toString()] = item.count;
    });

    // Attach actual student counts to courses
    const coursesWithCounts = courses.map(course => {
      const courseObj = course.toObject();
      courseObj.students = enrollmentMap[course._id.toString()] || 0;
      return courseObj;
    });

    res.json(coursesWithCounts);
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ message: 'Failed to fetch courses', error: error.message });
  }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Get actual enrolled students count from Enrollment collection
    const enrolledStudentsCount = await Enrollment.countDocuments({
      courseId: req.params.id,
      status: { $in: ['active', 'completed'] }
    });

    // Return course with actual students count
    const courseData = course.toObject();
    courseData.students = enrolledStudentsCount;

    res.json(courseData);
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ message: 'Failed to fetch course', error: error.message });
  }
};

module.exports = { getCourses, getCourseById };
