import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader, MessageSquare, CheckCircle, Clock, X, Send, User, BookOpen } from "lucide-react";
import { toast } from "react-hot-toast";
import { adminDoubtAPI } from "../../services/adminApi";

const AdminDoubts = () => {
    const [doubts, setDoubts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [selectedDoubt, setSelectedDoubt] = useState(null);
    const [replyText, setReplyText] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchDoubts();
    }, []);

    const fetchDoubts = async () => {
        try {
            setLoading(true);
            const response = await adminDoubtAPI.getInstructorDoubts();
            setDoubts(response.data.doubts || []);
        } catch (error) {
            console.error("Failed to fetch doubts:", error);
            toast.error("Failed to load doubts");
        } finally {
            setLoading(false);
        }
    };

    const handleReply = async (e) => {
        e.preventDefault();
        if (!replyText.trim()) return;

        try {
            setSubmitting(true);
            await adminDoubtAPI.reply(selectedDoubt._id, replyText);
            toast.success("Reply sent successfully");
            setReplyText("");
            setSelectedDoubt(null);
            fetchDoubts();
        } catch (error) {
            console.error("Failed to send reply:", error);
            toast.error("Failed to send reply");
        } finally {
            setSubmitting(false);
        }
    };

    const filteredDoubts = doubts.filter(doubt => {
        const matchesSearch = doubt.studentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doubt.question?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doubt.courseTitle?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === "all" || doubt.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="p-6 space-y-6 bg-gray-900 min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Doubt Management</h1>
                    <p className="text-gray-400">Answer student questions and provide support</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700 flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search doubts, students, or courses..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-10 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-600 rounded-lg text-gray-400 hover:text-white transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500 outline-none min-w-[150px]"
                >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="resolved">Resolved</option>
                </select>
            </div>

            {/* List */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader className="w-12 h-12 text-blue-500 animate-spin" />
                    <p className="text-gray-400">Loading doubts...</p>
                </div>
            ) : filteredDoubts.length === 0 ? (
                <div className="text-center py-20 bg-gray-800 rounded-2xl border border-gray-700 border-dashed">
                    <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                    <p className="text-xl text-gray-400 font-medium">No doubts found</p>
                    <p className="text-gray-500 mt-2">Questions from students will appear here</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {filteredDoubts.map((doubt, index) => (
                        <motion.div
                            key={doubt._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-gray-800 rounded-xl border border-gray-700 p-6 hover:border-blue-500/50 transition-all group"
                        >
                            <div className="flex flex-col md:flex-row justify-between gap-4">
                                <div className="space-y-4 flex-1">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-400">
                                            <User className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-white font-semibold">{doubt.studentName}</h3>
                                            <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                                                <BookOpen className="w-3 h-3" />
                                                <span>{doubt.courseTitle}</span>
                                                {doubt.itemTitle && (
                                                    <>
                                                        <span>•</span>
                                                        <span className="text-blue-400 font-medium">
                                                            {doubt.itemType === 'assignment' ? 'Assignment' : 'Project'}: {doubt.itemTitle}
                                                        </span>
                                                    </>
                                                )}
                                                <span>•</span>
                                                <Clock className="w-3 h-3" />
                                                <span>{new Date(doubt.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/50">
                                        <p className="text-gray-300 text-sm leading-relaxed">
                                            <span className="text-blue-400 font-medium mr-2">Q:</span>
                                            {doubt.question}
                                        </p>
                                    </div>
                                    {doubt.reply && (
                                        <div className="bg-green-500/5 rounded-xl p-4 border border-green-500/20">
                                            <p className="text-gray-300 text-sm leading-relaxed">
                                                <span className="text-green-400 font-medium mr-2">A:</span>
                                                {doubt.reply}
                                            </p>
                                            <p className="text-[10px] text-gray-500 mt-2 italic">
                                                Answered on {new Date(doubt.updatedAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <div className="flex md:flex-col justify-between items-end gap-4 min-w-[120px]">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${doubt.status === 'resolved'
                                        ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                        : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                                        }`}>
                                        {doubt.status === 'resolved' ? 'Resolved' : 'Pending'}
                                    </span>
                                    {doubt.status === 'pending' && (
                                        <button
                                            onClick={() => setSelectedDoubt(doubt)}
                                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all shadow-lg active:scale-95 flex items-center gap-2"
                                        >
                                            <Send className="w-4 h-4" />
                                            Reply
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Reply Modal */}
            <AnimatePresence>
                {selectedDoubt && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-gray-800 rounded-2xl border border-gray-700 max-w-lg w-full overflow-hidden shadow-2xl"
                        >
                            <div className="p-6 border-b border-gray-700 flex items-center justify-between bg-gray-800/50">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <MessageSquare className="w-5 h-5 text-blue-400" />
                                    Reply to Doubt
                                </h2>
                                <button onClick={() => setSelectedDoubt(null)} className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <form onSubmit={handleReply} className="p-6 space-y-4">
                                <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/50">
                                    <div className="flex justify-between items-start mb-2">
                                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Student's Question</p>
                                        {selectedDoubt.itemTitle && (
                                            <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20">
                                                {selectedDoubt.itemType === 'assignment' ? 'Assignment' : 'Project'}: {selectedDoubt.itemTitle}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-gray-300 text-sm italic">"{selectedDoubt.question}"</p>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400 block font-medium">Your Response</label>
                                    <textarea
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        rows="5"
                                        autoFocus
                                        required
                                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        placeholder="Type your explanation here..."
                                    />
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                                    >
                                        {submitting ? <Loader className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                        Send Reply
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminDoubts;
