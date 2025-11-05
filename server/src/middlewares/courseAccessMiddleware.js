const User = require('../models/User');
const Enrollment = require('../models/Enrollment');

/**
 * Middleware to check if user has access to a specific course
 * This verifies that:
 * 1. User is authenticated (protect middleware should run before this)
 * 2. Course is in user's enrolledCourses array
 * 3. Enrollment status is 'active' and payment is 'completed' or 'free'
 */
const checkCourseAccess = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const courseId = req.params.courseId || req.body.courseId;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: 'Course ID is required'
      });
    }

    console.log('🔐 Checking course access for user:', userId, 'course:', courseId);

    // Check 1: Verify enrollment exists and is active
    const enrollment = await Enrollment.findOne({ 
      userId, 
      courseId,
      status: 'active',
      paymentStatus: { $in: ['completed', 'free'] }
    });

    if (!enrollment) {
      console.log('❌ No active enrollment found');
      return res.status(403).json({
        success: false,
        message: 'You do not have access to this course. Please enroll first.',
        hasAccess: false
      });
    }

    // Check 2: Verify course is in user's enrolledCourses array (double security)
    const user = await User.findById(userId);
    const hasAccess = user.enrolledCourses.some(
      ec => ec.courseId.toString() === courseId.toString() && ec.status === 'active'
    );

    if (!hasAccess) {
      console.log('❌ Course not in user\'s enrolledCourses array');
      return res.status(403).json({
        success: false,
        message: 'Access denied. Course not found in your enrolled courses.',
        hasAccess: false
      });
    }

    console.log('✅ Access granted to course:', courseId);
    
    // Attach enrollment and user to request for use in route handlers
    req.enrollment = enrollment;
    req.courseAccess = {
      hasAccess: true,
      enrollmentId: enrollment._id,
      enrolledAt: enrollment.enrolledAt
    };

    next();
  } catch (error) {
    console.error('Course access check error:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking course access',
      error: error.message
    });
  }
};

/**
 * Middleware to check if user has access to specific course content (videos, assignments, etc.)
 * More granular than checkCourseAccess
 */
const checkContentAccess = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { courseId, contentId, contentType } = req.params;

    console.log('🔐 Checking content access:', { userId, courseId, contentId, contentType });

    // First check course access
    const enrollment = await Enrollment.findOne({ 
      userId, 
      courseId,
      status: 'active',
      paymentStatus: { $in: ['completed', 'free'] }
    });

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: 'You must be enrolled in this course to access its content.',
        hasAccess: false
      });
    }

    // Check if content is marked as free preview (allow without enrollment)
    // This logic can be extended based on your Course model structure
    
    console.log('✅ Content access granted');
    req.enrollment = enrollment;
    next();
  } catch (error) {
    console.error('Content access check error:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking content access',
      error: error.message
    });
  }
};

module.exports = { checkCourseAccess, checkContentAccess };
