const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const User = require('../models/User');

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
      status: isFree ? 'active' : 'pending', // Only activate for free courses, paid courses need payment verification
      enrolledAt: new Date()
    });

    await enrollment.save();

    // Increment student count only for free courses immediately.
    // For paid courses, increment will happen after successful payment in webhook.
    if (isFree) {
      course.students += 1;
      await course.save();
      
      // Add course to user's enrolledCourses array
      const user = await User.findById(userId);
      if (user) {
        const alreadyInArray = user.enrolledCourses.some(
          ec => ec.courseId.toString() === courseId.toString()
        );
        
        if (!alreadyInArray) {
          user.enrolledCourses.push({
            courseId: courseId,
            enrollmentId: enrollment._id,
            enrolledAt: new Date(),
            status: 'active'
          });
          await user.save();
        }
      }
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

  // Access only after completed payment or free course AND status is active
  const hasAccess = (enrollment.paymentStatus === 'completed' || enrollment.paymentStatus === 'free') 
                    && enrollment.status === 'active';
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

// @desc    Verify transaction ID and grant course access
// @route   POST /api/enrollments/:enrollmentId/verify-transaction
// @access  Private
const verifyTransactionAndGrantAccess = async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    const { transactionId, upiTransactionId } = req.body;
    const userId = req.user._id;

    console.log('🔍 Transaction Verification Request');
    console.log('📋 Enrollment ID:', enrollmentId);
    console.log('💳 User-provided Transaction ID:', transactionId);
    console.log('🔢 User-provided UPI Transaction ID:', upiTransactionId);

    // Validate required fields
    if (!transactionId) {
      return res.status(400).json({ 
        success: false,
        message: 'Transaction ID is required for verification' 
      });
    }

    // Find enrollment
    const enrollment = await Enrollment.findById(enrollmentId).populate('courseId');
    if (!enrollment) {
      console.log('❌ Enrollment not found');
      return res.status(404).json({ 
        success: false,
        message: 'Enrollment not found' 
      });
    }

    // Verify enrollment belongs to user
    if (enrollment.userId.toString() !== userId.toString()) {
      console.log('❌ Unauthorized access attempt by user:', userId);
      return res.status(403).json({ 
        success: false,
        message: 'Unauthorized access to this enrollment' 
      });
    }

    // Check if payment is already completed
    if (enrollment.paymentStatus === 'completed') {
      console.log('✅ Payment already completed - Access already granted');
      return res.json({
        success: true,
        message: 'Payment already verified. You have access to the course.',
        enrollment,
        accessGranted: true,
        alreadyVerified: true
      });
    }

    // Check if payment is free
    if (enrollment.paymentStatus === 'free') {
      console.log('✅ Free course - Access already granted');
      return res.json({
        success: true,
        message: 'This is a free course. You already have access.',
        enrollment,
        accessGranted: true,
        isFree: true
      });
    }

    // Get stored transaction IDs from database
    const storedTransactionId = enrollment.transactionId;
    const storedUpiTransactionId = enrollment.paymentDetails?.upiTransactionId;
    const storedOrderId = enrollment.paymentDetails?.orderId;

    console.log('💾 Database Transaction ID:', storedTransactionId);
    console.log('💾 Database UPI Transaction ID:', storedUpiTransactionId);
    console.log('💾 Database Order ID:', storedOrderId);

    // CHECK IF WEBHOOK RECEIVED THE PAYMENT
    // If no transaction ID in database, payment was NOT received via webhook
    if (!storedTransactionId && !storedUpiTransactionId) {
      console.log('❌ PAYMENT NOT VERIFIED - No transaction record in database');
      console.log('⚠️  This means either:');
      console.log('    1. Payment was not made');
      console.log('    2. Webhook not received yet (wait a few seconds)');
      console.log('    3. Payment gateway issue');
      console.log('');
      console.log('🔍 User attempted to verify with ID:', transactionId);
      console.log('❌ VERIFICATION REJECTED - Cannot verify without payment confirmation');
      
      return res.status(400).json({
        success: false,
        message: 'Payment not found in our system. Please ensure you have completed the payment.',
        accessGranted: false,
        reason: 'No payment record found',
        hint: 'If you just paid, please wait 30-60 seconds for the payment to be processed. If you have not paid yet, please scan the QR code and complete the payment first.',
        enrollmentId: enrollmentId,
        paymentStatus: enrollment.paymentStatus,
        debug: {
          providedTransactionId: transactionId,
          storedTransactionId: storedTransactionId || 'Not found',
          webhookReceived: false
        }
      });
    }

    // VERIFY TRANSACTION ID MATCH
    // Transaction ID exists in database (webhook received), now verify user's input matches
    let transactionMatches = false;
    let matchedField = '';

    // Check if main transaction ID matches
    if (storedTransactionId && transactionId === storedTransactionId) {
      transactionMatches = true;
      matchedField = 'transactionId';
      console.log('✅ Main Transaction ID matches!');
    }
    // Check if UPI transaction ID matches
    else if (storedUpiTransactionId && transactionId === storedUpiTransactionId) {
      transactionMatches = true;
      matchedField = 'upiTransactionId';
      console.log('✅ UPI Transaction ID matches!');
    }
    // Check if provided UPI transaction ID matches stored one
    else if (upiTransactionId && storedUpiTransactionId && upiTransactionId === storedUpiTransactionId) {
      transactionMatches = true;
      matchedField = 'upiTransactionId (secondary)';
      console.log('✅ UPI Transaction ID (secondary) matches!');
    }
    // Check if provided UPI transaction ID matches main stored ID
    else if (upiTransactionId && storedTransactionId && upiTransactionId === storedTransactionId) {
      transactionMatches = true;
      matchedField = 'transactionId (via UPI)';
      console.log('✅ Transaction ID matches UPI ID!');
    }

    // TRANSACTION ID DOES NOT MATCH
    if (!transactionMatches) {
      console.log('❌ Transaction ID MISMATCH!');
      console.log('❌ User provided:', transactionId);
      console.log('❌ Database has:', storedTransactionId || 'No transaction ID stored');
      
      return res.status(403).json({
        success: false,
        message: 'Transaction ID verification failed. The provided transaction ID does not match our records.',
        accessGranted: false,
        reason: 'Transaction ID mismatch',
        providedTransactionId: transactionId,
        hint: 'Please ensure you entered the correct transaction ID from your payment app.'
      });
    }

    // TRANSACTION ID MATCHES - GRANT ACCESS
    console.log(`✅ Transaction ID verified via ${matchedField}`);
    console.log('🎉 Granting course access...');

    // Update enrollment status to active
    enrollment.status = 'active';
    enrollment.paymentStatus = 'completed';
    
    // Update verification timestamp
    if (!enrollment.paymentDetails) {
      enrollment.paymentDetails = {};
    }
    enrollment.paymentDetails.verifiedByUser = true;
    enrollment.paymentDetails.userVerificationAt = new Date();
    enrollment.paymentDetails.verifiedTransactionId = transactionId;
    enrollment.paymentDetails.matchedField = matchedField;

    await enrollment.save();

    console.log('💾 Enrollment updated - Access granted');
    console.log('✅ User can now access course content');

    res.json({
      success: true,
      message: 'Transaction verified successfully! You now have access to the course.',
      enrollment,
      accessGranted: true,
      transactionVerified: true,
      matchedField: matchedField,
      course: {
        id: enrollment.courseId._id,
        title: enrollment.courseId.title
      }
    });

  } catch (error) {
    console.error('❌ Transaction verification error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to verify transaction', 
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
  deletePendingEnrollment,
  verifyTransactionAndGrantAccess
};
