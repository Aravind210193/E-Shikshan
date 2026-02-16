import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, CheckCircle, Clock, AlertCircle, ChevronRight, User, Home, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const StudentDoubts = () => {
    const [doubts, setDoubts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [replyTexts, setReplyTexts] = useState({});
    const [submittingIds, setSubmittingIds] = useState(new Set());

    useEffect(() => {
        fetchDoubts();
    }, []);

    const navigate = useNavigate();

    const fetchDoubts = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/doubts/student`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDoubts(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching student doubts:', err);
            toast.error('Failed to load doubts');
            setLoading(false);
        }
    };

    const handleStudentReply = async (doubtId) => {
        const text = replyTexts[doubtId];
        if (!text || !text.trim()) return;

        try {
            setSubmittingIds(prev => new Set(prev).add(doubtId));
            const token = localStorage.getItem('token');
            const res = await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/doubts/${doubtId}/student-reply`,
                { message: text },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Update local state
            setDoubts(prev => prev.map(d => d._id === doubtId ? res.data : d));
            setReplyTexts(prev => ({ ...prev, [doubtId]: '' }));
            toast.success('Reply sent');
        } catch (err) {
            console.error('Failed to send reply:', err);
            toast.error('Failed to send reply');
        } finally {
            setSubmittingIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(doubtId);
                return newSet;
            });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0f111a] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f111a] text-white p-4 lg:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-4">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold text-gray-400 hover:text-white transition-all border border-white/5"
                    >
                        <Home size={14} />
                        Back to Home
                    </button>
                </div>
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                        <MessageSquare size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">My Doubts</h1>
                        <p className="text-gray-400 text-sm">Track your questions and instructor replies</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {doubts.length > 0 ? doubts.map((doubt) => (
                        <motion.div
                            key={doubt._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-[#1a1c2e] border border-gray-800 rounded-2xl p-6 hover:border-indigo-500/30 transition-all group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <span className="text-[10px] uppercase font-black text-indigo-400 tracking-wider">
                                        {doubt.course?.title || 'Course'} • {doubt.itemTitle}
                                    </span>
                                    <h3 className="text-lg font-bold mt-1 text-white/90">{doubt.question}</h3>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${doubt.status === 'resolved' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                                        }`}>
                                        {doubt.status}
                                    </div>
                                    <button
                                        onClick={async () => {
                                            if (window.confirm('Delete this question?')) {
                                                try {
                                                    const token = localStorage.getItem('token');
                                                    await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/doubts/${doubt._id}`, {
                                                        headers: { Authorization: `Bearer ${token}` }
                                                    });
                                                    toast.success('Question deleted');
                                                    fetchDoubts();
                                                } catch (err) {
                                                    toast.error('Failed to delete question');
                                                }
                                            }
                                        }}
                                        className="text-[10px] text-red-400 hover:text-red-300 underline font-bold"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>

                            {/* Conversation Thread */}
                            <div className="space-y-4 mt-6">
                                {/* Legacy Reply Display if Discussion is empty */}
                                {(!doubt.discussion || doubt.discussion.length === 0) && doubt.reply && (
                                    <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-800 ml-8">
                                        <div className="flex items-center gap-2 mb-2 text-indigo-400">
                                            <User size={14} />
                                            <span className="text-xs font-bold uppercase tracking-wide">Instructor Reply</span>
                                        </div>
                                        <p className="text-sm text-gray-300 leading-relaxed italic">"{doubt.reply}"</p>
                                    </div>
                                )}

                                {/* Discussion Thread */}
                                {doubt.discussion?.map((msg, idx) => (
                                    <div
                                        key={idx}
                                        className={`flex flex-col ${msg.sender === 'student' ? 'items-end' : 'items-start'}`}
                                    >
                                        <div
                                            className={`max-w-[85%] p-4 rounded-xl border ${msg.sender === 'student'
                                                    ? 'bg-indigo-600/10 border-indigo-500/20 rounded-tr-sm'
                                                    : 'bg-gray-900/50 border-gray-800 rounded-tl-sm'
                                                }`}
                                        >
                                            <div className={`flex items-center gap-2 mb-1 ${msg.sender === 'student' ? 'justify-end text-indigo-400' : 'text-gray-400'}`}>
                                                {msg.sender === 'student' ? null : <User size={12} />}
                                                <span className="text-[10px] font-bold uppercase tracking-wide">
                                                    {msg.sender === 'student' ? 'You' : 'Instructor'}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                                        </div>
                                        <span className="text-[10px] text-gray-600 mt-1 px-1">
                                            {new Date(msg.timestamp).toLocaleDateString()}
                                        </span>
                                    </div>
                                ))}

                                {/* Reply Input */}
                                <div className="pt-4 border-t border-gray-800/50 mt-4">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={replyTexts[doubt._id] || ''}
                                            onChange={(e) => setReplyTexts(prev => ({ ...prev, [doubt._id]: e.target.value }))}
                                            placeholder="Type a reply..."
                                            className="flex-1 bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-2 text-sm text-white placeholder-gray-500 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleStudentReply(doubt._id);
                                                }
                                            }}
                                        />
                                        <button
                                            disabled={submittingIds.has(doubt._id) || !replyTexts[doubt._id]?.trim()}
                                            onClick={() => handleStudentReply(doubt._id)}
                                            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-xl transition-all"
                                        >
                                            {submittingIds.has(doubt._id) ? (
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <Send size={18} />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )) : (
                        <div className="text-center py-20 bg-[#1a1c2e]/50 rounded-2xl border border-dashed border-gray-800">
                            <AlertCircle className="mx-auto text-gray-600 mb-4" size={48} />
                            <h3 className="text-xl font-bold text-gray-400">No doubts found</h3>
                            <p className="text-gray-500 text-sm mt-2">Questions you ask in courses will appear here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentDoubts;
