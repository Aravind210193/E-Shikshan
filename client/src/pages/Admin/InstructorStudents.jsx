import React, { useState, useEffect } from "react";
import {
    Users, BookOpen, Search, ShieldCheck, RotateCcw, Trash2,
    GraduationCap, UserPlus, Mail, Calendar, CreditCard, Activity
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { adminCourseAPI, adminUserAPI } from "../../services/adminApi";
import { adminAPI } from "../../services/api";
import { toast } from "react-hot-toast";

const InstructorStudents = () => {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState("");
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [coursesLoading, setCoursesLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchCourses = async () => {
        try {
            setCoursesLoading(true);
            const adminData = JSON.parse(sessionStorage.getItem('adminData') || '{}');
            const email = adminData.email?.toLowerCase();
            const res = await adminCourseAPI.getAll({ instructorEmail: email });
            if (res.data.success) {
                setCourses(res.data.courses || []);
            }
        } catch (err) {
            console.error("Failed to fetch courses", err);
            toast.error("Failed to load your courses");
        } finally {
            setCoursesLoading(false);
        }
    };

    const fetchStudents = async (courseId) => {
        if (!courseId) {
            setStudents([]);
            return;
        }
        setLoading(true);
        console.log(`📡 Fetching roster for: ${courseId}`);
        try {
            const res = await adminCourseAPI.getEnrollments(courseId);
            if (res.data.success) {
                setStudents(res.data.enrollments || []);
            }
        } catch (err) {
            console.error("Failed to fetch students", err);
            let msg = "Failed to load student roster";
            if (err.response?.status === 404) {
                msg = "Course record not found. Please refresh your course list.";
            } else if (err.response?.data?.message) {
                msg = err.response.data.message;
            }
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    useEffect(() => {
        if (selectedCourse) {
            fetchStudents(selectedCourse);
        } else {
            setStudents([]);
        }
    }, [selectedCourse]);

    const handleAction = async (action, enrollmentId) => {
        try {
            if (action === 'revoke') {
                await adminAPI.revokeCourseAccess(enrollmentId);
                toast.success("Access revoked");
            } else if (action === 'restore') {
                await adminAPI.restoreCourseAccess(enrollmentId);
                toast.success("Access restored");
            } else if (action === 'delete') {
                if (!window.confirm("Are you sure you want to delete this enrollment?")) return;
                await adminAPI.deleteEnrollment(enrollmentId);
                toast.success("Enrollment deleted");
            }
            fetchStudents(selectedCourse);
        } catch (err) {
            toast.error(err?.response?.data?.message || "Action failed");
        }
    };

    const filteredStudents = students.filter(enr =>
        enr.userId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        enr.userId?.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-8 space-y-8 bg-[#10111a] min-h-full">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">Student Management</h1>
                    <p className="text-[#7a7f9a] mt-1 font-medium">Monitor and manage student access for your courses</p>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7a7f9a] w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search students..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-[#1a1c2c] border border-[#2d2f45] rounded-xl text-white placeholder-[#5a5f7a] focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold text-sm"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Left Column: Course Selection */}
                <div className="lg:col-span-1 space-y-4">
                    <h3 className="text-[10px] text-[#7a7f9a] font-black uppercase tracking-widest mb-2 px-2">Your Courses</h3>
                    <div className="space-y-2 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                        {coursesLoading ? (
                            [1, 2, 3].map(i => (
                                <div key={i} className="h-16 bg-[#1a1c2c] border border-[#2d2f45] rounded-xl animate-pulse" />
                            ))
                        ) : courses.length > 0 ? (
                            courses.map(course => (
                                <button
                                    key={course._id}
                                    onClick={() => setSelectedCourse(course._id)}
                                    className={`w-full text-left p-4 rounded-xl border transition-all duration-300 group ${selectedCourse === course._id
                                        ? 'bg-indigo-600 border-indigo-400 shadow-lg shadow-indigo-600/20'
                                        : 'bg-[#1a1c2c] border-[#2d2f45] hover:border-indigo-500/50 hover:bg-[#202235]'
                                        }`}
                                >
                                    <p className={`font-bold text-sm leading-tight mb-1 ${selectedCourse === course._id ? 'text-white' : 'text-gray-200'}`}>
                                        {course.title}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <Users className={`w-3 h-3 ${selectedCourse === course._id ? 'text-indigo-200' : 'text-[#7a7f9a]'}`} />
                                        <span className={`text-[10px] font-bold ${selectedCourse === course._id ? 'text-indigo-200' : 'text-[#5a5f7a]'}`}>
                                            {course.students || 0} Students
                                        </span>
                                    </div>
                                </button>
                            ))
                        ) : (
                            <div className="text-center py-8 text-[#5a5f7a] bg-[#1a1c2c] rounded-xl border border-[#2d2f45] border-dashed">
                                <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                <p className="text-xs font-bold">No courses found</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Student List */}
                <div className="lg:col-span-3">
                    <AnimatePresence mode="wait">
                        {!selectedCourse ? (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="bg-[#1a1c2c] border border-[#2d2f45] border-dashed rounded-2xl py-32 text-center"
                            >
                                <div className="max-w-xs mx-auto">
                                    <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <GraduationCap className="w-10 h-10 text-indigo-500" />
                                    </div>
                                    <h4 className="text-white text-xl font-black mb-2 tracking-tight">Select a Course</h4>
                                    <p className="text-[#7a7f9a] text-sm leading-relaxed">Choose a course from the left panel to manage registered students and their access status.</p>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="list"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-[#1a1c2c] border border-[#2d2f45] rounded-2xl shadow-2xl overflow-hidden"
                            >
                                <div className="p-6 border-b border-[#2d2f45] flex justify-between items-center bg-[#1d1f33]">
                                    <div>
                                        <h4 className="text-white font-black text-lg">
                                            {courses.find(c => c._id === selectedCourse)?.title}
                                        </h4>
                                        <p className="text-[#7a7f9a] text-xs font-bold uppercase tracking-widest mt-0.5">
                                            {filteredStudents.length} Students Found
                                        </p>
                                    </div>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="bg-[#131522] text-[#7a7f9a] text-[10px] font-black uppercase tracking-widest">
                                                <th className="py-4 px-6">Student Info</th>
                                                <th className="py-4 px-6">Enrolled On</th>
                                                <th className="py-4 px-6 text-center">Payment Status</th>
                                                <th className="py-4 px-6 text-center">Access</th>
                                                <th className="py-4 px-6 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#2d2f45]">
                                            {loading ? (
                                                <tr>
                                                    <td colSpan="5" className="py-20 text-center">
                                                        <div className="flex flex-col items-center gap-4">
                                                            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                                                            <span className="text-indigo-400 font-black text-xs uppercase tracking-widest">Loading Roster...</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : filteredStudents.length > 0 ? (
                                                filteredStudents.map((enr) => (
                                                    <tr key={enr._id} className="group hover:bg-[#202235] transition-all duration-300">
                                                        <td className="py-5 px-6">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-sm shadow-lg group-hover:scale-110 transition-transform">
                                                                    {enr.userId?.name?.charAt(0).toUpperCase() || 'S'}
                                                                </div>
                                                                <div>
                                                                    <p className="text-white font-bold text-sm tracking-tight">{enr.userId?.name || 'Unknown Student'}</p>
                                                                    <p className="text-[#7a7f9a] text-[10px] font-bold">{enr.userId?.email || 'No email'}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="py-5 px-6 text-sm font-bold text-white/50">
                                                            {enr.enrolledAt ? new Date(enr.enrolledAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                                                        </td>
                                                        <td className="py-5 px-6 text-center">
                                                            <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-md tracking-tighter ${enr.paymentStatus === 'completed' || enr.paymentStatus === 'free'
                                                                ? 'bg-emerald-500/10 text-emerald-400'
                                                                : 'bg-amber-500/10 text-amber-400'
                                                                }`}>
                                                                {enr.paymentStatus}
                                                            </span>
                                                        </td>
                                                        <td className="py-5 px-6 text-center">
                                                            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${enr.status === 'active' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                                                                }`}>
                                                                {enr.status === 'active' ? 'Active' : 'Revoked'}
                                                            </div>
                                                        </td>
                                                        <td className="py-5 px-6">
                                                            <div className="flex items-center justify-end gap-2">
                                                                {enr.status === 'active' ? (
                                                                    <button
                                                                        onClick={() => handleAction('revoke', enr._id)}
                                                                        className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded-lg transition-all font-black text-[10px] uppercase tracking-tighter flex items-center gap-1.5"
                                                                    >
                                                                        <ShieldCheck className="w-3.5 h-3.5" /> Revoke
                                                                    </button>
                                                                ) : (
                                                                    <button
                                                                        onClick={() => handleAction('restore', enr._id)}
                                                                        className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg transition-all font-black text-[10px] uppercase tracking-tighter flex items-center gap-1.5"
                                                                    >
                                                                        <RotateCcw className="w-3.5 h-3.5" /> Restore
                                                                    </button>
                                                                )}
                                                                <button
                                                                    onClick={() => handleAction('delete', enr._id)}
                                                                    className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-all"
                                                                    title="Delete Enrollment"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="5" className="py-20 text-center text-[#7a7f9a]">
                                                        <Users className="w-12 h-12 mx-auto mb-4 opacity-10" />
                                                        <p className="font-bold text-sm">No students matched your search.</p>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default InstructorStudents;
