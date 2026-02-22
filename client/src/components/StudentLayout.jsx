import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import StudentSidebar from './StudentSidebar';

const StudentLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    // Close sidebar whenever route changes (user tapped a nav link)
    useEffect(() => {
        setSidebarOpen(false);
    }, [location.pathname]);

    // Prevent body scroll while mobile sidebar is open
    useEffect(() => {
        if (sidebarOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [sidebarOpen]);

    return (
        <div className="flex min-h-screen bg-[#0f111a]">

            {/* ── DESKTOP SIDEBAR (always visible on lg+) ── */}
            <div className="hidden lg:block flex-shrink-0">
                <StudentSidebar />
            </div>

            {/* ── MOBILE SIDEBAR + OVERLAY ── */}
            <AnimatePresence>
                {sidebarOpen && (
                    <>
                        {/* Dark overlay — tap anywhere to close */}
                        <motion.div
                            key="overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
                            onClick={() => setSidebarOpen(false)}
                        />

                        {/* Slide-in sidebar panel */}
                        <motion.div
                            key="mobile-sidebar"
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="fixed inset-y-0 left-0 z-50 lg:hidden"
                        >
                            <StudentSidebar onClose={() => setSidebarOpen(false)} />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* ── MAIN CONTENT ── */}
            <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">

                {/* Mobile top bar */}
                <div className="lg:hidden flex items-center gap-4 px-4 py-3 bg-[#1a1c2e] border-b border-gray-800 sticky top-0 z-30">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 transition-all active:scale-95"
                        aria-label="Open menu"
                    >
                        <Menu size={20} />
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-sm">
                            E
                        </div>
                        <span className="text-white font-bold text-sm">Student Portal</span>
                    </div>
                </div>

                <main className="flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default StudentLayout;
