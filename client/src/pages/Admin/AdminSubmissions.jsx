import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader, FileCheck, CheckCircle, Clock, X, Send, User, BookOpen, ExternalLink, Award } from "lucide-react";
import { toast } from "react-hot-toast";
import { adminProjectSubmissionAPI } from "../../services/adminApi";

const AdminSubmissions = () => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [grade, setGrade] = useState("");
    const [feedback, setFeedback] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [activeQuickFilter, setActiveQuickFilter] = useState("all");

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const fetchSubmissions = async () => {
        try {
            setLoading(true);
            const response = await adminProjectSubmissionAPI.getInstructorSubmissions();
            setSubmissions(response.data.data || []);
        } catch (error) {
            console.error("Failed to fetch submissions:", error);
            toast.error("Failed to load submissions");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!grade.trim()) return toast.error("Please provide a grade");

        try {
            setSubmitting(true);
            await adminProjectSubmissionAPI.update(selectedSubmission._id, {
                status: 'graded',
                grade,
                feedback
            });
            toast.success("Submission graded successfully");
            setGrade("");
            setFeedback("");
            setSelectedSubmission(null);
            fetchSubmissions();
        } catch (error) {
            console.error("Failed to update submission:", error);
            toast.error("Failed to update submission");
        } finally {
            setSubmitting(false);
        }
    };

    const filteredSubmissions = submissions.filter(sub => {
        const matchesSearch = (sub.student?.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (sub.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (sub.course?.title || "").toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === "all" || sub.status === filterStatus;

        // Quick Filters
        let matchesQuick = true;
        if (activeQuickFilter === 'pending') matchesQuick = sub.status === 'pending';
        else if (activeQuickFilter === 'project') matchesQuick = sub.workType === 'project';
        else if (activeQuickFilter === 'assignment') matchesQuick = sub.workType === 'assignment';

        return matchesSearch && matchesStatus && matchesQuick;
    });

    return (
        <div className="p-6 space-y-6 bg-[#10111a] min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Submissions</h1>
                    <p className="text-gray-400">Review and grade student work</p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div
                    onClick={() => setActiveQuickFilter("all")}
                    className={`bg-[#1a1c2c] border rounded-xl p-4 flex items-center gap-4 cursor-pointer transition-all ${activeQuickFilter === 'all' ? 'border-indigo-500 bg-indigo-500/5 shadow-indigo-500/10 shadow-lg' : 'border-[#2d2f45] hover:border-gray-600'}`}
                >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${activeQuickFilter === 'all' ? 'bg-indigo-500 text-white' : 'bg-indigo-500/10 text-indigo-400'}`}>
                        <FileCheck size={20} />
                    </div>
                    <div>
                        <p className="text-white font-bold text-lg">{submissions.length}</p>
                        <p className="text-[#7a7f9a] text-[10px] font-black uppercase tracking-widest">Total Received</p>
                    </div>
                </div>
                <div
                    onClick={() => setActiveQuickFilter("pending")}
                    className={`bg-[#1a1c2c] border rounded-xl p-4 flex items-center gap-4 cursor-pointer transition-all ${activeQuickFilter === 'pending' ? 'border-amber-500 bg-amber-500/5 shadow-amber-500/10 shadow-lg' : 'border-[#2d2f45] hover:border-gray-600'}`}
                >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${activeQuickFilter === 'pending' ? 'bg-amber-500 text-white' : 'bg-amber-500/10 text-amber-400'}`}>
                        <Clock size={20} />
                    </div>
                    <div>
                        <p className="text-white font-bold text-lg">{submissions.filter(s => s.status === 'pending').length}</p>
                        <p className="text-[#7a7f9a] text-[10px] font-black uppercase tracking-widest">Pending Review</p>
                    </div>
                </div>
                <div
                    onClick={() => setActiveQuickFilter("project")}
                    className={`bg-[#1a1c2c] border rounded-xl p-4 flex items-center gap-4 cursor-pointer transition-all ${activeQuickFilter === 'project' ? 'border-purple-500 bg-purple-500/5 shadow-purple-500/10 shadow-lg' : 'border-[#2d2f45] hover:border-gray-600'}`}
                >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${activeQuickFilter === 'project' ? 'bg-purple-500 text-white' : 'bg-purple-500/10 text-purple-400'}`}>
                        <Award size={20} />
                    </div>
                    <div>
                        <p className="text-white font-bold text-lg">{submissions.filter(s => s.workType === 'project').length}</p>
                        <p className="text-[#7a7f9a] text-[10px] font-black uppercase tracking-widest">Projects</p>
                    </div>
                </div>
                <div
                    onClick={() => setActiveQuickFilter("assignment")}
                    className={`bg-[#1a1c2c] border rounded-xl p-4 flex items-center gap-4 cursor-pointer transition-all ${activeQuickFilter === 'assignment' ? 'border-blue-500 bg-blue-500/5 shadow-blue-500/10 shadow-lg' : 'border-[#2d2f45] hover:border-gray-600'}`}
                >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${activeQuickFilter === 'assignment' ? 'bg-blue-500 text-white' : 'bg-blue-500/10 text-blue-400'}`}>
                        <BookOpen size={20} />
                    </div>
                    <div>
                        <p className="text-white font-bold text-lg">{submissions.filter(s => s.workType === 'assignment').length}</p>
                        <p className="text-[#7a7f9a] text-[10px] font-black uppercase tracking-widest">Assignments</p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-[#1a1c2c] rounded-2xl p-4 border border-[#2d2f45] flex flex-col md:flex-row gap-4 shadow-xl">
                <div className="flex-1 relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search students, projects, or courses..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-10 py-3 bg-[#11121d] border border-[#2d2f45] rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-[#25283c] rounded-lg text-gray-400 hover:text-white transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-3 bg-[#11121d] border border-[#2d2f45] rounded-xl text-white focus:ring-2 focus:ring-indigo-500 outline-none min-w-[150px] cursor-pointer"
                >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="graded">Graded</option>
                </select>
            </div>

            {/* List */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader className="w-12 h-12 text-indigo-500 animate-spin" />
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading submissions...</p>
                </div>
            ) : filteredSubmissions.length === 0 ? (
                <div className="text-center py-20 bg-[#1a1c2c] rounded-2xl border border-[#2d2f45] border-dashed">
                    <Award className="w-16 h-16 mx-auto mb-4 text-gray-600 opacity-20" />
                    <p className="text-xl text-gray-400 font-medium">No submissions found</p>
                    <p className="text-gray-500 mt-2 text-sm">New submissions from students will appear here</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {filteredSubmissions.map((sub, index) => (
                        <motion.div
                            key={sub._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-[#1a1c2c] rounded-xl border border-[#2d2f45] p-6 hover:border-indigo-500/50 transition-all group shadow-lg"
                        >
                            <div className="flex flex-col md:flex-row justify-between gap-6">
                                <div className="space-y-4 flex-1">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20">
                                            {(sub.student?.name || 'S').charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="text-white font-bold text-lg">{sub.student?.name || 'Unknown Student'}</h3>
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter ${sub.status === 'graded' ? 'bg-emerald-500/10 text-emerald-400' :
                                                    sub.status === 'reviewed' ? 'bg-blue-500/10 text-blue-400' :
                                                        'bg-amber-500/10 text-amber-400 animate-pulse'
                                                    }`}>
                                                    {sub.status}
                                                </span>
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter ${sub.workType === 'project' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-purple-500/10 text-purple-400'
                                                    }`}>
                                                    {sub.workType}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-4 text-xs text-[#7a7f9a]">
                                                <div className="flex items-center gap-1.5">
                                                    <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                                                    <span className="font-bold text-white/80">{sub.course?.title}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Award className="w-3.5 h-3.5 text-purple-400" />
                                                    <span className="font-bold text-indigo-300">{sub.title}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    <span>{new Date(sub.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-[#11121d] rounded-xl p-4 border border-[#2d2f45]">
                                            <p className="text-[10px] text-[#5a5f7a] font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                                                <ExternalLink className="w-3 h-3" /> Submission Link
                                            </p>
                                            <a
                                                href={sub.submissionUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-cyan-400 hover:text-cyan-300 text-sm font-bold break-all flex items-center gap-2"
                                            >
                                                {sub.submissionUrl}
                                            </a>
                                        </div>
                                        {sub.comments && (
                                            <div className="bg-[#11121d] rounded-xl p-4 border border-[#2d2f45]">
                                                <p className="text-[10px] text-[#5a5f7a] font-black uppercase tracking-widest mb-2">Student Comments</p>
                                                <p className="text-gray-300 text-sm italic">"{sub.comments}"</p>
                                            </div>
                                        )}
                                    </div>

                                    {(sub.grade || sub.feedback) && (
                                        <div className="bg-emerald-500/5 rounded-xl p-4 border border-emerald-500/20">
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest">Instructor Evaluation</p>
                                                {sub.grade && (
                                                    <span className="bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded">
                                                        GRADE: {sub.grade}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-gray-300 text-sm">{sub.feedback || "No feedback provided."}</p>
                                        </div>
                                    )}
                                </div>
                                <div className="flex md:flex-col justify-end items-end gap-3 px-4">
                                    <button
                                        onClick={() => window.open(sub.submissionUrl, '_blank')}
                                        className="p-3 bg-[#11121d] hover:bg-[#25283c] border border-[#2d2f45] text-[#7a7f9a] hover:text-white rounded-xl transition-all shadow-lg"
                                        title="View Work"
                                    >
                                        <ExternalLink className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedSubmission(sub);
                                            setGrade(sub.grade || "");
                                            setFeedback(sub.feedback || "");
                                        }}
                                        className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase tracking-tighter transition-all shadow-lg shadow-indigo-500/20 active:scale-95 flex items-center gap-2"
                                    >
                                        <FileCheck className="w-4 h-4" />
                                        {sub.status === 'graded' ? 'Edit Grade' : 'Grade Now'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Evaluation Modal */}
            <AnimatePresence>
                {selectedSubmission && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-[#1a1c2c] rounded-2xl border border-[#2d2f45] max-w-xl w-full overflow-hidden shadow-2xl relative"
                        >
                            <button
                                onClick={() => setSelectedSubmission(null)}
                                className="absolute top-4 right-4 p-2 hover:bg-[#25283c] rounded-xl text-[#7a7f9a] hover:text-white transition-all z-10"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <div className="p-8 space-y-6">
                                <div>
                                    <h2 className="text-2xl font-black text-white flex items-center gap-3">
                                        <div className="p-2 bg-indigo-500/10 rounded-lg">
                                            <FileCheck className="w-6 h-6 text-indigo-400" />
                                        </div>
                                        Evaluate Work
                                    </h2>
                                    <p className="text-[#7a7f9a] text-sm mt-2">Providing a grade and feedback for <span className="text-white font-bold">{selectedSubmission.student?.name}</span>'s submission.</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="bg-[#11121d] rounded-xl p-4 border border-[#2d2f45]">
                                        <div className="flex justify-between items-center mb-2">
                                            <p className="text-[10px] text-[#5a5f7a] font-black uppercase tracking-widest">Work Details</p>
                                            <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded font-black">
                                                {selectedSubmission.title}
                                            </span>
                                        </div>
                                        <p className="text-white font-bold text-sm mb-1">{selectedSubmission.course?.title}</p>
                                        <a href={selectedSubmission.submissionUrl} target="_blank" rel="noreferrer" className="text-cyan-400 text-xs hover:underline flex items-center gap-1">
                                            <ExternalLink className="w-3 h-3" /> View Submission Link
                                        </a>
                                    </div>

                                    <form onSubmit={handleUpdate} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] text-[#7a7f9a] block font-black uppercase tracking-widest">Grade (e.g., A+, 95/100, Pass)</label>
                                                <input
                                                    type="text"
                                                    value={grade}
                                                    onChange={(e) => setGrade(e.target.value)}
                                                    required
                                                    autoFocus
                                                    className="w-full px-4 py-3 bg-[#11121d] border border-[#2d2f45] rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold"
                                                    placeholder="Enter grade..."
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] text-[#7a7f9a] block font-black uppercase tracking-widest">Status</label>
                                                <select
                                                    className="w-full px-4 py-3 bg-[#11121d] border border-[#2d2f45] rounded-xl text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold cursor-pointer"
                                                    defaultValue="graded"
                                                >
                                                    <option value="graded">Graded</option>
                                                    <option value="reviewed">Under Review</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] text-[#7a7f9a] block font-black uppercase tracking-widest">Feedback (Optional)</label>
                                            <textarea
                                                value={feedback}
                                                onChange={(e) => setFeedback(e.target.value)}
                                                rows="4"
                                                className="w-full px-4 py-3 bg-[#11121d] border border-[#2d2f45] rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none text-sm"
                                                placeholder="Provide constructive feedback to the student..."
                                            />
                                        </div>

                                        <div className="flex gap-4 pt-2">
                                            <button
                                                type="button"
                                                onClick={() => setSelectedSubmission(null)}
                                                className="flex-1 px-6 py-4 bg-[#25283c] hover:bg-[#2d2f45] text-white rounded-xl font-bold transition-all"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={submitting}
                                                className="flex-[2] px-6 py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-indigo-500/30"
                                            >
                                                {submitting ? <Loader className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                                                Save Evaluation
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminSubmissions;
