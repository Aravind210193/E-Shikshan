import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { enrollmentAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Loader, CheckCircle, XCircle, AlertCircle, Key } from 'lucide-react';

const TransactionVerificationModal = ({ enrollmentId, onSuccess, onClose }) => {
  const [transactionId, setTransactionId] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);

  const handleVerify = async () => {
    if (!transactionId.trim()) {
      toast.error('Please enter your transaction ID');
      return;
    }

    setIsVerifying(true);
    setVerificationResult(null);

    try {
      const response = await enrollmentAPI.verifyTransaction(enrollmentId, {
        transactionId: transactionId.trim(),
        upiTransactionId: transactionId.trim() // Try both fields
      });

      console.log('Verification Response:', response.data);

      if (response.data.success && response.data.accessGranted) {
        setVerificationResult({
          success: true,
          message: response.data.message
        });
        toast.success('Transaction verified! Access granted.');
        setTimeout(() => {
          onSuccess();
        }, 2000);
      } else {
        setVerificationResult({
          success: false,
          message: response.data.message || 'Verification failed'
        });
        toast.error('Transaction verification failed');
      }
    } catch (error) {
      console.error('Verification error:', error);
      const errorMessage = error.response?.data?.message || 'Verification failed';
      setVerificationResult({
        success: false,
        message: errorMessage,
        hint: error.response?.data?.hint
      });
      toast.error(errorMessage);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-800 rounded-2xl max-w-md w-full border border-gray-700 shadow-2xl"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-2xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
              <Key className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Verify Transaction</h2>
              <p className="text-blue-100 text-sm">Enter your payment transaction ID</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Info Box */}
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-300">
                <p className="font-semibold mb-2 text-red-400">⚠️ Important: You Must Pay First!</p>
                <p className="mb-2">You can only verify AFTER completing payment. Steps:</p>
                <ol className="space-y-1 text-xs list-decimal list-inside">
                  <li>Scan the QR code with your UPI app</li>
                  <li>Complete the payment</li>
                  <li>Wait for payment confirmation in your app</li>
                  <li>Copy the Transaction ID from your payment app</li>
                  <li>Enter it below to verify and get access</li>
                </ol>
              </div>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-300">
                <p className="font-semibold mb-1">Where to find Transaction ID:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Open your payment app (PhonePe/GPay/Paytm)</li>
                  <li>• Go to transaction history</li>
                  <li>• Find the latest payment</li>
                  <li>• Look for "Transaction ID", "Ref No", or "UTR"</li>
                  <li>• Copy the full ID (e.g., TXN123456789)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Transaction ID *
            </label>
            <input
              type="text"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              placeholder="Enter transaction ID from payment app"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
              disabled={isVerifying}
              onKeyPress={(e) => e.key === 'Enter' && handleVerify()}
            />
          </div>

          {/* Verification Result */}
          {verificationResult && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              {verificationResult.success ? (
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-green-400 font-semibold">Verified Successfully!</p>
                      <p className="text-green-300 text-sm mt-1">{verificationResult.message}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-red-400 font-semibold">Verification Failed</p>
                      <p className="text-red-300 text-sm mt-1">{verificationResult.message}</p>
                      {verificationResult.hint && (
                        <p className="text-red-300 text-xs mt-2">{verificationResult.hint}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isVerifying}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleVerify}
              disabled={isVerifying || !transactionId.trim() || verificationResult?.success}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
            >
              {isVerifying ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Verifying...
                </>
              ) : verificationResult?.success ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Verified
                </>
              ) : (
                'Verify Transaction'
              )}
            </button>
          </div>

          {/* Help Text */}
          <p className="text-center text-sm text-gray-400 mt-4">
            Having trouble? <a href="/support" className="text-blue-400 hover:underline">Contact Support</a>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default TransactionVerificationModal;
