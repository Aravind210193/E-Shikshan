const crypto = require('crypto');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const User = require('../models/User');

// @desc    Handle payment gateway webhook
// @route   POST /api/webhooks/payment
// @access  Public (but verified via signature)
const handlePaymentWebhook = async (req, res) => {
  try {
    console.log('\n');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('🔔 PAYMENT GATEWAY WEBHOOK RECEIVED');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('⏰ Timestamp:', new Date().toISOString());
    console.log('📦 Webhook Payload:', JSON.stringify(req.body, null, 2));
    console.log('🔐 Webhook Headers:', JSON.stringify(req.headers, null, 2));
    console.log('───────────────────────────────────────────────────────────\n');

    const {
      transactionId,
      orderId,
      amount,
      status,
      timestamp,
      signature,
      paymentMethod,
      customerPhone,
      customerEmail,
      // Additional fields from payment apps
      upiTransactionId,    // UPI transaction reference number
      paymentApp,          // Which app: PhonePe, GooglePay, Paytm, etc.
      bankReferenceNumber, // Bank RRN (Retrieval Reference Number)
      vpa,                 // Virtual Payment Address (UPI ID used)
      payerVPA,            // Payer's UPI ID
      payeeVPA             // Payee's UPI ID (merchant)
    } = req.body;

    // STEP 1: Validate required fields
    if (!transactionId || !orderId || !amount || !status) {
      console.log('❌ Missing required webhook fields');
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: transactionId, orderId, amount, status'
      });
    }

    // STEP 2: Verify webhook signature
    const isSignatureValid = verifyWebhookSignature(req.body, signature);
    if (!isSignatureValid) {
      console.log('❌ Invalid webhook signature');
      return res.status(401).json({
        success: false,
        message: 'Invalid signature - webhook authentication failed'
      });
    }
    console.log('✅ Webhook signature verified');

    // STEP 3: Find enrollment by orderId (orderId = enrollmentId in our system)
    const enrollment = await Enrollment.findById(orderId);
    if (!enrollment) {
      console.log('❌ Enrollment not found for orderId:', orderId);
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }
    console.log('✅ Enrollment found:', enrollment._id);

    // STEP 4: Check if payment already processed
    if (enrollment.paymentStatus === 'completed') {
      console.log('⚠️ Payment already processed for this enrollment');
      return res.status(200).json({
        success: true,
        message: 'Payment already processed',
        alreadyProcessed: true
      });
    }

    // STEP 5: Verify amount matches
    const course = await Course.findById(enrollment.courseId);
    if (!course) {
      console.log('❌ Course not found:', enrollment.courseId);
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const expectedAmount = parseFloat(course.priceAmount);
    const receivedAmount = parseFloat(amount);

    if (Math.abs(expectedAmount - receivedAmount) > 0.01) {
      console.log('❌ Amount mismatch! Expected:', expectedAmount, 'Received:', receivedAmount);
      // Mark as failed and log for investigation
      enrollment.paymentStatus = 'failed';
      enrollment.paymentDetails = {
        ...enrollment.paymentDetails,
        failureReason: 'Amount mismatch',
        expectedAmount,
        receivedAmount,
        failedAt: new Date()
      };
      await enrollment.save();

      return res.status(400).json({
        success: false,
        message: 'Payment amount mismatch'
      });
    }
    console.log('✅ Amount verified:', receivedAmount);

    // STEP 6: Process based on payment status
    if (status === 'SUCCESS' || status === 'success' || status === 'COMPLETED') {
      console.log('\n✅ ═══ PAYMENT SUCCESSFUL ═══');
      console.log('📱 Payment App:', paymentApp || 'Not specified');
      console.log('💳 Transaction ID:', transactionId);
      console.log('🔢 UPI Transaction ID:', upiTransactionId || 'N/A');
      console.log('🏦 Bank Reference:', bankReferenceNumber || 'N/A');
      console.log('📞 Customer Phone:', customerPhone || 'N/A');
      console.log('💰 Amount Paid:', receivedAmount);
      console.log('🎯 Order ID:', orderId);
      console.log('═══════════════════════════════\n');

      // Update enrollment with payment details
      enrollment.paymentStatus = 'completed';
      enrollment.paymentMethod = (paymentMethod || 'upi').toLowerCase();
      enrollment.transactionId = transactionId; // Main transaction ID from payment gateway
      enrollment.paymentDate = new Date(timestamp) || new Date();
      enrollment.status = 'active'; // Grant course access
      enrollment.amountPaid = receivedAmount;

      // Store comprehensive payment details
      enrollment.paymentDetails = {
        // Basic transaction info
        transactionId: transactionId,
        upiTransactionId: upiTransactionId || transactionId, // UPI-specific transaction ID
        orderId: orderId,
        amount: receivedAmount,
        method: (paymentMethod || 'upi').toLowerCase(),

        // Payment app details
        paymentApp: paymentApp || 'Unknown', // PhonePe, GooglePay, Paytm, BHIM, etc.
        paymentSource: paymentApp ? `Paid via ${paymentApp}` : 'UPI Payment',

        // Bank and UPI details
        bankReferenceNumber: bankReferenceNumber || null, // Bank RRN
        vpa: vpa || payerVPA || null, // UPI ID used for payment
        payerVPA: payerVPA || null,   // Customer's UPI ID
        payeeVPA: payeeVPA || '9391774388@paytm', // Merchant UPI ID

        // Customer details
        customerPhone: customerPhone,
        customerEmail: customerEmail,

        // Status and timestamps
        gatewayStatus: status,
        verifiedAt: new Date(),
        webhookReceivedAt: new Date(),
        paymentCompletedAt: timestamp ? new Date(timestamp) : new Date()
      };

      await enrollment.save();
      console.log('\n💾 ═══ DATABASE UPDATED ═══');
      console.log('✓ Enrollment Status:', enrollment.status);
      console.log('✓ Payment Status:', enrollment.paymentStatus);
      console.log('✓ Stored Transaction ID:', enrollment.transactionId);
      console.log('✓ Stored Payment App:', enrollment.paymentDetails.paymentApp);
      console.log('✓ Stored UPI Transaction ID:', enrollment.paymentDetails.upiTransactionId);
      console.log('═══════════════════════════════\n');

      // Add course to user's enrolledCourses array
      const user = await User.findById(enrollment.userId);
      if (user) {
        // Check if course already in enrolledCourses
        const alreadyInArray = user.enrolledCourses.some(
          ec => ec.courseId.toString() === enrollment.courseId.toString()
        );

        if (!alreadyInArray) {
          user.enrolledCourses.push({
            courseId: enrollment.courseId,
            enrollmentId: enrollment._id,
            enrolledAt: new Date(),
            status: 'active'
          });
          await user.save();
          console.log('✓ Course added to user\'s enrolledCourses array');
        } else {
          console.log('✓ Course already in user\'s enrolledCourses array');
        }
      }

      // Increment course student count
      course.students = (course.students || 0) + 1;
      await course.save();
      console.log('📊 Course student count incremented:', course.students);

      console.log('\n🎉 ═══ WEBHOOK PROCESSING COMPLETE ═══');
      console.log('✓ Payment verified successfully');
      console.log('✓ Enrollment activated');
      console.log('✓ Course added to user profile');
      console.log('✓ User can now access course content');

      // Send emails
      try {
        const sendEmail = require('../utils/sendEmail');

        // Email to student
        await sendEmail({
          to: customerEmail || enrollment.userDetails?.email,
          subject: `Payment Successful: ${course.title} - E-Shikshan`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
              <h2>Payment Received!</h2>
              <p>Hi ${enrollment.userDetails?.fullName || 'Student'},</p>
              <p>Your payment for <b>${course.title}</b> was successful.</p>
              <p>Transaction ID: ${transactionId}</p>
              <p>You can now access your course content on the dashboard.</p>
              <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard" style="background: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Go to Dashboard</a>
              <br/><br/>
              <p>Happy learning!<br/>Team E-Shikshan</p>
            </div>
          `
        });

        // Email to instructor
        if (course.instructorEmail) {
          await sendEmail({
            to: course.instructorEmail,
            subject: `New Student Enrolled (Paid): ${course.title}`,
            html: `
              <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                <h2>New Enrollment Alert</h2>
                <p>Hello,</p>
                <p>A new student <b>${enrollment.userDetails?.fullName}</b> has enrolled in your course <b>${course.title}</b> after successful payment.</p>
                <p>Keep track of their progress on your instructor dashboard.</p>
                <br/>
                <p>Best Regards,<br/>E-Shikshan Platform</p>
              </div>
            `
          });
        }
      } catch (emailErr) {
        console.error('Error sending enrollment emails from webhook:', emailErr);
      }

      console.log('═══════════════════════════════════════\n');

      return res.status(200).json({
        success: true,
        message: 'Payment verified and enrollment activated',
        enrollmentId: enrollment._id,
        transactionId: transactionId,
        upiTransactionId: upiTransactionId || transactionId,
        paymentApp: paymentApp || 'UPI',
        bankReference: bankReferenceNumber
      });

    } else if (status === 'FAILED' || status === 'failed') {
      console.log('❌ Payment failed');

      enrollment.paymentStatus = 'failed';
      enrollment.transactionId = transactionId; // Store even for failed transactions
      enrollment.paymentDetails = {
        transactionId: transactionId,
        upiTransactionId: upiTransactionId || transactionId,
        orderId: orderId,
        amount: receivedAmount,
        paymentApp: paymentApp || 'Unknown',
        bankReferenceNumber: bankReferenceNumber || null,
        gatewayStatus: status,
        failedAt: new Date(),
        failureReason: 'Payment declined or cancelled by user'
      };
      await enrollment.save();

      return res.status(200).json({
        success: true,
        message: 'Payment failure recorded',
        enrollmentId: enrollment._id,
        transactionId: transactionId
      });

    } else if (status === 'PENDING' || status === 'pending') {
      console.log('⏳ Payment pending');

      enrollment.paymentStatus = 'pending';
      enrollment.transactionId = transactionId; // Store even for pending transactions
      enrollment.paymentDetails = {
        transactionId: transactionId,
        upiTransactionId: upiTransactionId || transactionId,
        orderId: orderId,
        paymentApp: paymentApp || 'Unknown',
        gatewayStatus: status,
        pendingAt: new Date()
      };
      enrollment.paymentStatus = 'failed';
      enrollment.paymentDetails = {
        transactionId,
        orderId,
        amount: receivedAmount,
        gatewayStatus: status,
        failedAt: new Date()
      };
      await enrollment.save();

      return res.status(200).json({
        success: true,
        message: 'Payment failure recorded',
        enrollmentId: enrollment._id
      });

    } else if (status === 'PENDING' || status === 'pending') {
      console.log('⏳ Payment pending');

      enrollment.paymentStatus = 'pending';
      enrollment.paymentDetails = {
        transactionId,
        orderId,
        gatewayStatus: status,
        pendingAt: new Date()
      };
      await enrollment.save();

      return res.status(200).json({
        success: true,
        message: 'Payment pending',
        enrollmentId: enrollment._id
      });

    } else {
      console.log('⚠️ Unknown payment status:', status);
      return res.status(400).json({
        success: false,
        message: 'Unknown payment status'
      });
    }

  } catch (error) {
    console.error('❌ Webhook processing error:', error);
    return res.status(500).json({
      success: false,
      message: 'Webhook processing failed',
      error: error.message
    });
  }
};

// Verify webhook signature to ensure request is from payment gateway
const verifyWebhookSignature = (payload, receivedSignature) => {
  try {
    // If no signature provided and we're not enforcing it, skip verification
    // In production, ALWAYS enforce signature verification
    if (!receivedSignature && process.env.NODE_ENV !== 'production') {
      console.log('⚠️ Skipping signature verification in development mode');
      return true;
    }

    if (!receivedSignature) {
      console.log('❌ No signature provided');
      return false;
    }

    // Get webhook secret from environment variables
    const webhookSecret = process.env.PAYMENT_WEBHOOK_SECRET || 'your-webhook-secret-key-change-in-production';

    // Create signature from payload
    // Format: transactionId|orderId|amount|status|timestamp
    const signatureString = `${payload.transactionId}|${payload.orderId}|${payload.amount}|${payload.status}|${payload.timestamp}`;

    // Generate HMAC SHA256 signature
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(signatureString)
      .digest('hex');

    console.log('🔐 Signature String:', signatureString);
    console.log('🔐 Expected Signature:', expectedSignature);
    console.log('🔐 Received Signature:', receivedSignature);

    // Compare signatures using timing-safe comparison
    const isValid = crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(receivedSignature)
    );

    return isValid;
  } catch (error) {
    console.error('❌ Signature verification error:', error);
    return false;
  }
};

// @desc    Get payment status by orderId (for frontend polling)
// @route   GET /api/webhooks/payment-status/:orderId
// @access  Private
const getPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user._id;

    const enrollment = await Enrollment.findById(orderId);
    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    // Verify enrollment belongs to user
    if (enrollment.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access'
      });
    }

    res.json({
      success: true,
      paymentStatus: enrollment.paymentStatus,
      status: enrollment.status,
      transactionId: enrollment.transactionId,
      paymentDate: enrollment.paymentDate,
      paymentDetails: enrollment.paymentDetails
    });
  } catch (error) {
    console.error('Get payment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment status',
      error: error.message
    });
  }
};

module.exports = {
  handlePaymentWebhook,
  getPaymentStatus
};
