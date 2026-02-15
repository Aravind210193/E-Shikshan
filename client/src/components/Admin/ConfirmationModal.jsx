import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirm Action",
    message = "Are you sure you want to proceed?",
    confirmText = "Confirm",
    cancelText = "Cancel",
    type = "danger" // 'danger' | 'warning' | 'info'
}) => {
    if (!isOpen) return null;

    const typeStyles = {
        danger: {
            icon: 'bg-red-500/20 text-red-400',
            button: 'bg-red-600 hover:bg-red-700'
        },
        warning: {
            icon: 'bg-yellow-500/20 text-yellow-400',
            button: 'bg-yellow-600 hover:bg-yellow-700'
        },
        info: {
            icon: 'bg-blue-500/20 text-blue-400',
            button: 'bg-blue-600 hover:bg-blue-700'
        }
    };

    const styles = typeStyles[type] || typeStyles.danger;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="p-6 pb-4">
                        <div className="flex items-start justify-between mb-4">
                            <div className={`w-12 h-12 rounded-xl ${styles.icon} flex items-center justify-center`}>
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-gray-700/50"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
                        <p className="text-gray-300 leading-relaxed">{message}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 p-6 pt-4 border-t border-gray-700">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={onClose}
                            className="px-6 py-2.5 rounded-xl bg-gray-700 hover:bg-gray-600 transition-all duration-200 font-medium text-white"
                        >
                            {cancelText}
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className={`px-6 py-2.5 rounded-xl ${styles.button} transition-all duration-200 font-semibold text-white shadow-lg`}
                        >
                            {confirmText}
                        </motion.button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ConfirmationModal;
