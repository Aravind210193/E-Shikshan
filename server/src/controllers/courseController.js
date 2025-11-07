const Course = require('../models/Course');

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
    
    res.json(courses);
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

    if (course) {
      res.json(course);
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ message: 'Failed to fetch course', error: error.message });
  }
};

module.exports = { getCourses, getCourseById };
