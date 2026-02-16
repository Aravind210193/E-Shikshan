import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, Trash2, Info } from 'lucide-react';

const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Are you sure?",
    message = "This action cannot be undone.",
    confirmText = "Delete",
    cancelText = "Cancel",
    type = "danger", // danger, info, warning
    isLoading = false
}) => {
    if (!isOpen) return null;

    const themes = {
        danger: {
            icon: <Trash2 size={24} className="text-red-400" />,
            bg: "bg-red-500/10",
            border: "border-red-500/50",
            button: "bg-red-600 hover:bg-red-700 shadow-red-900/20",
            text: "text-red-400"
        },
        warning: {
            icon: <AlertTriangle size={24} className="text-amber-400" />,
            bg: "bg-amber-500/10",
            border: "border-amber-500/50",
            button: "bg-amber-600 hover:bg-amber-700 shadow-amber-900/20",
            text: "text-amber-400"
        },
        info: {
            icon: <Info size={24} className="text-indigo-400" />,
            bg: "bg-indigo-500/10",
            border: "border-indigo-500/50",
            button: "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-900/20",
            text: "text-indigo-400"
        }
    };

    const activeTheme = themes[type] || themes.danger;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl relative overflow-hidden"
                >
                    {/* Decorative background blur */}
                    <div className={`absolute -top-24 -right-24 w-48 h-48 ${activeTheme.bg} blur-3xl opacity-50 rounded-full`} />

                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-6">
                            <div className={`p-3 rounded-2xl ${activeTheme.bg} border ${activeTheme.border}`}>
                                {activeTheme.icon}
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
                        <p className="text-slate-400 text-sm leading-relaxed mb-8">
                            {message}
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-2xl transition-all border border-slate-700"
                            >
                                {cancelText}
                            </button>
                            <button
                                onClick={onConfirm}
                                disabled={isLoading}
                                className={`flex-1 px-4 py-3 ${activeTheme.button} text-white font-bold rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2`}
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    confirmText
                                )}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ConfirmModal;
