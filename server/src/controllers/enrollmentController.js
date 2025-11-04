const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

// @desc    Enroll in a course
// @route   POST /api/enrollments
// @access  Private
const enrollInCourse = async (req, res) => {
  try {
    const { courseId, userDetails } = req.body;
    const userId = req.user._id;

    // Validate required fields
    if (!courseId || !userDetails?.fullName || !userDetails?.email) {
      return res.status(400).json({ 
        message: 'Course ID and user details (name, email) are required' 
      });
    }

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({ userId, courseId });
    if (existingEnrollment) {
      return res.status(400).json({ 
        message: 'You are already enrolled in this course',
        enrollment: existingEnrollment
      });
    }

    // Determine if course is free
    const isFree = course.price === 'Free' || course.priceAmount === 0;

    // Create enrollment
    const enrollment = new Enrollment({
      userId,
      courseId,
      userDetails,
      paymentStatus: isFree ? 'free' : 'pending',
      paymentMethod: isFree ? 'free' : undefined,
      amountPaid: isFree ? 0 : course.priceAmount,
      status: isFree ? 'active' : 'active', // Activate immediately for free courses
      enrolledAt: new Date()
    });

    await enrollment.save();

    // Increment student count only for free courses immediately.
    // For paid courses, increment will happen after successful payment in processPayment.
    if (isFree) {
      course.students += 1;
      await course.save();
    }

    res.status(201).json({
      message: isFree 
        ? 'Successfully enrolled in the course!' 
        : 'Enrollment created. Please complete payment to access course content.',
      enrollment,
      requiresPayment: !isFree,
      course: {
        title: course.title,
        price: course.price,
        priceAmount: course.priceAmount
      }
    });
  } catch (error) {
    console.error('Enrollment error:', error);
    res.status(500).json({ 
      message: 'Failed to enroll in course', 
      error: error.message 
    });
  }
};

// @desc    Process payment for enrollment (Payment Gateway Webhook Simulation)
// @route   POST /api/enrollments/:id/payment
// @access  Private
// 
// PAYMENT FLOW WITH GATEWAY:
// 1. User enrolls → enrollment created with status='pending'
// 2. User completes UPI payment through PhonePe/Google Pay/Paytm
// 3. Payment gateway detects payment and sends webhook to this endpoint
// 4. This endpoint receives transaction ID from payment gateway
// 5. Verifies transaction ID matches the payment in gateway
// 6. Updates enrollment status to 'completed' and grants access
//
// CURRENT IMPLEMENTATION:
// - Simulates payment gateway by generating transaction ID
// - In production, replace with actual gateway webhook (Razorpay/Stripe)
// - Transaction ID will come from gateway's webhook payload
// - Verify payment signature from gateway for security
//
const processPayment = async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    const { paymentMethod, amount, phoneNumber } = req.body;
    const userId = req.user._id;

    console.log('🔔 Payment webhook received for enrollment:', enrollmentId);
    console.log('📊 Payment data:', { paymentMethod, amount, phoneNumber });

    const enrollment = await Enrollment.findById(enrollmentId);
    if (!enrollment) {
      console.log('❌ Enrollment not found:', enrollmentId);
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    // Verify enrollment belongs to user
    if (enrollment.userId.toString() !== userId.toString()) {
      console.log('❌ Unauthorized access attempt by user:', userId);
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    // Check if already paid
    if (enrollment.paymentStatus === 'completed' || enrollment.paymentStatus === 'free') {
      console.log('⚠️ Payment already completed for enrollment:', enrollmentId);
      return res.status(400).json({ message: 'Payment already completed' });
    }

    // SIMULATE PAYMENT GATEWAY RESPONSE
    // In production, this transaction ID comes from payment gateway webhook
    // Example: Razorpay sends { razorpay_payment_id, razorpay_order_id, razorpay_signature }
    const gatewayTransactionId = `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    console.log('💳 Payment Gateway Transaction ID:', gatewayTransactionId);
    console.log('✅ Payment verified by gateway - Processing enrollment...');
    
    // TODO: In production, verify payment signature here
    // Example with Razorpay:
    // const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET);
    // hmac.update(orderId + "|" + paymentId);
    // const generatedSignature = hmac.digest('hex');
    // if (generatedSignature !== razorpay_signature) throw new Error('Invalid signature');

  // Store payment details with gateway-provided transaction ID
  enrollment.paymentStatus = 'completed';
  // Normalize and validate payment method against schema enum
  const normalizedMethod = (paymentMethod || 'upi').toString().toLowerCase();
  enrollment.paymentMethod = normalizedMethod;
    enrollment.transactionId = gatewayTransactionId;
    enrollment.paymentDate = new Date();
    enrollment.status = 'active'; // Activate course access
    enrollment.paymentDetails = {
      amount: amount,
      phoneNumber: phoneNumber,
  method: normalizedMethod,
      transactionId: gatewayTransactionId,
      verifiedAt: new Date()
    };

    await enrollment.save();
    
    console.log('💾 Payment saved successfully');
    console.log('📝 Enrollment status:', enrollment.paymentStatus);
    console.log('🎓 Course access:', enrollment.status);

    // Increment course student count (for paid courses)
    const course = await Course.findById(enrollment.courseId);
    if (course) {
      course.students = (course.students || 0) + 1;
      await course.save();
      console.log('📊 Course student count updated:', course.students);
    }

    console.log('✅ Payment processing completed successfully');
    console.log('🎉 User now has access to the course!');

    res.json({
      message: 'Payment verified successfully! You now have full access to the course.',
      enrollment,
      transactionId: gatewayTransactionId
    });
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ 
      message: 'Payment processing failed', 
      error: error.message 
    });
  }
};

// @desc    Get user's enrollments
// @route   GET /api/enrollments/my-courses
// @access  Private
const getMyEnrollments = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const enrollments = await Enrollment.find({ userId })
      .populate('courseId')
      .sort('-enrolledAt');

    res.json(enrollments);
  } catch (error) {
    console.error('Get enrollments error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch enrollments', 
      error: error.message 
    });
  }
};

// @desc    Get single enrollment details
// @route   GET /api/enrollments/:id
// @access  Private
const getEnrollmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const enrollment = await Enrollment.findById(id).populate('courseId');
    
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    // Verify enrollment belongs to user
    if (enrollment.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    res.json(enrollment);
  } catch (error) {
    console.error('Get enrollment error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch enrollment', 
      error: error.message 
    });
  }
};

// @desc    Check enrollment status for a course
// @route   GET /api/enrollments/check/:courseId
// @access  Private
const checkEnrollmentStatus = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;

    const enrollment = await Enrollment.findOne({ userId, courseId });
    
    if (!enrollment) {
      return res.json({ 
        enrolled: false, 
        hasAccess: false 
      });
    }

  // Access only after completed payment or free course
  const hasAccess = enrollment.paymentStatus === 'completed' || enrollment.paymentStatus === 'free';
  // Enrolled is aligned with access; pending does not count as enrolled
  const isEnrolled = hasAccess;

    res.json({
      enrolled: isEnrolled,
      hasAccess,
      paymentStatus: enrollment.paymentStatus,
      enrollment: isEnrolled ? enrollment : null,
      pendingEnrollmentId: !isEnrolled && enrollment.paymentStatus === 'pending' ? enrollment._id : null
    });
  } catch (error) {
    console.error('Check enrollment error:', error);
    res.status(500).json({ 
      message: 'Failed to check enrollment status', 
      error: error.message 
    });
  }
};

// @desc    Update course progress
// @route   PUT /api/enrollments/:id/progress
// @access  Private
const updateProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, itemId } = req.body; // type: 'video', 'assignment', 'project', 'quiz'
    const userId = req.user._id;

    const enrollment = await Enrollment.findById(id);
    
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    // Verify enrollment belongs to user
    if (enrollment.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    // Update progress based on type
    switch (type) {
      case 'video':
        if (!enrollment.progress.videosWatched.includes(itemId)) {
          enrollment.progress.videosWatched.push(itemId);
        }
        break;
      case 'assignment':
        if (!enrollment.progress.assignmentsCompleted.includes(itemId)) {
          enrollment.progress.assignmentsCompleted.push(itemId);
        }
        break;
      case 'project':
        if (!enrollment.progress.projectsCompleted.includes(itemId)) {
          enrollment.progress.projectsCompleted.push(itemId);
        }
        break;
      case 'quiz':
        if (!enrollment.progress.quizzesTaken.includes(itemId)) {
          enrollment.progress.quizzesTaken.push(itemId);
        }
        break;
      default:
        return res.status(400).json({ message: 'Invalid progress type' });
    }

    // Calculate overall progress
    const course = await Course.findById(enrollment.courseId);
    const totalItems = (course.totalVideos || 0) + 
                      (course.assignments?.length || 0) + 
                      (course.projectsDetails?.length || 0) + 
                      (course.totalQuizzes || 0);
    
    const completedItems = enrollment.progress.videosWatched.length +
                          enrollment.progress.assignmentsCompleted.length +
                          enrollment.progress.projectsCompleted.length +
                          enrollment.progress.quizzesTaken.length;

    enrollment.progress.overallProgress = totalItems > 0 
      ? Math.round((completedItems / totalItems) * 100) 
      : 0;

    await enrollment.save();

    res.json({
      message: 'Progress updated successfully',
      progress: enrollment.progress
    });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ 
      message: 'Failed to update progress', 
      error: error.message 
    });
  }
};

// @desc    Delete pending enrollment (cancel before payment)
// @route   DELETE /api/enrollments/:id
// @access  Private
const deletePendingEnrollment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const enrollment = await Enrollment.findById(id);
    
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    // Verify enrollment belongs to user
    if (enrollment.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    // Only allow deletion of pending enrollments
    if (enrollment.paymentStatus !== 'pending') {
      return res.status(400).json({ 
        message: 'Cannot delete enrollment. Only pending enrollments can be cancelled.' 
      });
    }

    // Decrement student count
    const course = await Course.findById(enrollment.courseId);
    if (course && course.students > 0) {
      course.students -= 1;
      await course.save();
    }

    // Delete the enrollment
    await Enrollment.findByIdAndDelete(id);

    res.json({
      message: 'Enrollment cancelled successfully'
    });
  } catch (error) {
    console.error('Delete enrollment error:', error);
    res.status(500).json({ 
      message: 'Failed to delete enrollment', 
      error: error.message 
    });
  }
};

module.exports = {
  enrollInCourse,
  processPayment,
  getMyEnrollments,
  getEnrollmentById,
  checkEnrollmentStatus,
  updateProgress,
  deletePendingEnrollment
};
