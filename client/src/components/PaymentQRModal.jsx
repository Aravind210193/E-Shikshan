import React, { useState, useEffect } from 'react';
import { enrollmentAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Loader, CheckCircle, XCircle } from 'lucide-react';
import PAYMENT_CONFIG, { generateUPILink, generateQRCodeURL } from '../config/paymentConfig';
import TransactionVerificationModal from './TransactionVerificationModal';

const PaymentQRModal = ({ enrollmentId, amount, onSuccess, onClose }) => {
  const [paymentStatus, setPaymentStatus] = useState('pending'); // pending, completed
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  useEffect(() => {
    console.log('\n🎯 === PAYMENT QR MODAL OPENED ===');
    console.log('📋 Enrollment ID:', enrollmentId);
    console.log('💰 Amount:', `₹${amount}`);
    console.log('🏦 Merchant UPI:', PAYMENT_CONFIG.upiId);
    console.log('📱 Merchant Phone:', PAYMENT_CONFIG.phoneNumber);
    console.log('\n⚠️ WEBHOOK TESTING INSTRUCTIONS:');
    console.log('   To simulate payment gateway webhook, run this command:');
    console.log(`   node server/simulate-payment.js ${enrollmentId}`);
    console.log('\n   This will simulate:');
    console.log('   1. QR code being scanned');
    console.log('   2. Payment being completed');
    console.log('   3. Webhook sent to backend');
    console.log('   4. Transaction ID generated and stored');
    console.log('\n📝 After running simulation, check backend console for webhook processing');
    console.log('================================\n');
  }, [enrollmentId, amount]);

  // Generate UPI QR code data
  const upiLink = generateUPILink(amount, `Course Enrollment ${enrollmentId}`);
  const qrCodeURL = generateQRCodeURL(upiLink);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-2xl max-w-md w-full p-6 border border-gray-700">
        <h2 className="text-2xl font-bold mb-4 text-white">Complete Payment</h2>

        {/* QR Code Section */}
        <div className="bg-white p-6 rounded-xl mb-6">
          <div className="flex justify-center">
            <img 
              src={qrCodeURL}
              alt="Payment QR Code"
              className="w-64 h-64"
            />
          </div>
        </div>

        {/* Amount Display */}
        <div className="text-center mb-6">
          <p className="text-gray-400 mb-2">Amount to Pay</p>
          <p className="text-3xl font-bold text-white">₹{amount.toFixed(2)}</p>
        </div>

        {/* Payment Status */}
        <div className="mb-6">
          {paymentStatus === 'pending' && (
            <div className="flex items-center gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <Loader className="w-5 h-5 text-blue-400 animate-spin" />
              <p className="text-blue-400">Scan QR code with any UPI app to pay</p>
            </div>
          )}

          {paymentStatus === 'completed' && (
            <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <p className="text-green-400">Payment verified! Redirecting...</p>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-gray-700/50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold mb-2 text-white">Payment Instructions:</h3>
          <ol className="text-sm text-gray-300 space-y-2">
            <li>1. Open any UPI app (PhonePe, Google Pay, Paytm, etc.)</li>
            <li>2. Scan the QR code above</li>
            <li>3. Verify amount and complete payment</li>
            <li>4. After payment, click "I Have Paid" button below</li>
            <li>5. Enter your transaction ID to verify payment</li>
          </ol>
          
          {/* Manual Payment Details */}
          <div className="mt-4 pt-4 border-t border-gray-600">
            <h4 className="font-semibold mb-2 text-white text-sm">Or Pay Manually:</h4>
            <div className="bg-gray-800 rounded-lg p-3 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">UPI ID:</span>
                <span className="text-white font-mono text-sm">{PAYMENT_CONFIG.upiId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Phone Number:</span>
                <span className="text-white font-mono text-sm">{PAYMENT_CONFIG.phoneNumber}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Name:</span>
                <span className="text-white text-sm">{PAYMENT_CONFIG.merchantName}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-3">
          {paymentStatus === 'completed' ? (
            <button
              onClick={onSuccess}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors"
            >
              Go to Course
            </button>
          ) : (
            <>
              <button
                onClick={onClose}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowVerificationModal(true)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors shadow-lg shadow-green-500/20"
              >
                I Have Paid ✓
              </button>
            </>
          )}
        </div>

        {/* Support Link */}
        <p className="text-center text-sm text-gray-400 mt-4">
          Payment issues? <a href="/support" className="text-blue-400 hover:underline">Contact Support</a>
        </p>
      </div>

      {/* Transaction Verification Modal */}
      {showVerificationModal && (
        <TransactionVerificationModal
          enrollmentId={enrollmentId}
          onSuccess={() => {
            setShowVerificationModal(false);
            setPaymentStatus('completed');
            onSuccess();
          }}
          onClose={() => setShowVerificationModal(false)}
        />
      )}
    </div>
  );
};

export default PaymentQRModal;

// Usage in CourseDetail.jsx:
/*
const [showPaymentModal, setShowPaymentModal] = useState(false);
const [currentEnrollmentId, setCurrentEnrollmentId] = useState(null);

const handleEnrollClick = async () => {
  try {
    const response = await enrollmentAPI.enroll({
      courseId: course._id,
      userDetails: {
        fullName: user.name,
        email: user.email,
        phone: user.phone
      }
    });

    if (response.data.requiresPayment) {
      setCurrentEnrollmentId(response.data.enrollment._id);
      setShowPaymentModal(true);
    } else {
      toast.success('Successfully enrolled!');
      navigate(`/courses/${course._id}/content`);
    }
  } catch (error) {
    toast.error(error.response?.data?.message || 'Enrollment failed');
  }
};

return (
  <>
    <button onClick={handleEnrollClick}>Enroll Now</button>
    
    {showPaymentModal && (
      <PaymentQRModal
        enrollmentId={currentEnrollmentId}
        amount={course.priceAmount}
        onSuccess={() => {
          setShowPaymentModal(false);
          navigate(`/courses/${course._id}/content`);
        }}
        onClose={() => setShowPaymentModal(false)}
      />
    )}
  </>
);
*/
