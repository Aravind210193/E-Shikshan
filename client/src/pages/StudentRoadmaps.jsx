import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle, Clock, AlertCircle, ExternalLink, FileText, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { projectSubmissionAPI } from '../services/api';
import toast from 'react-hot-toast';

const StudentRoadmaps = () => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const fetchSubmissions = async () => {
        try {
            const res = await projectSubmissionAPI.getMySubmissions();
            // Filter only roadmap projects
            const roadmapSubs = res.data.filter(sub => sub.workType === 'roadmap_project');
            setSubmissions(roadmapSubs);
        } catch (err) {
            console.error('Error fetching roadmap submissions:', err);
            toast.error('Failed to load roadmap submissions');
        } finally {
            setLoading(false);
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
                    <button
                        onClick={() => navigate('/roadmap')}
                        className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold text-gray-400 hover:text-white transition-all border border-white/5 ml-2"
                    >
                        <BookOpen size={14} />
                        Explore Roadmaps
                    </button>
                </div>

                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                        <BookOpen size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">My Roadmap Projects</h1>
                        <p className="text-gray-400 text-sm">Track your project submissions from learning paths</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {submissions.length > 0 ? submissions.map((sub) => (
                        <motion.div
                            key={sub._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-[#1a1c2e] border border-gray-800 rounded-2xl p-6 hover:border-purple-500/30 transition-all group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[10px] uppercase font-black text-purple-400 tracking-wider bg-purple-500/10 px-2 py-1 rounded">
                                            {sub.roadmap?.title || 'Roadmap'}
                                        </span>
                                        <span className="text-gray-500 text-xs">•</span>
                                        <span className="text-gray-400 text-xs font-mono">
                                            {new Date(sub.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">{sub.title}</h3>

                                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                                        <a
                                            href={sub.submissionUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1 hover:text-purple-400 transition-colors"
                                        >
                                            <ExternalLink size={14} />
                                            View Submission
                                        </a>
                                    </div>

                                    {sub.comments && (
                                        <div className="bg-gray-900/50 p-3 rounded-xl border border-gray-800 text-sm text-gray-300">
                                            <p className="text-gray-500 text-xs mb-1 uppercase font-bold">Your Comments</p>
                                            {sub.comments}
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col items-end gap-2">
                                    <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase flex items-center gap-1 ${sub.status === 'graded' ? 'bg-emerald-500/10 text-emerald-500' :
                                            sub.status === 'reviewed' ? 'bg-blue-500/10 text-blue-500' :
                                                'bg-amber-500/10 text-amber-500'
                                        }`}>
                                        {sub.status === 'graded' ? <CheckCircle size={12} /> :
                                            sub.status === 'reviewed' ? <CheckCircle size={12} /> :
                                                <Clock size={12} />}
                                        {sub.status}
                                    </div>
                                </div>
                            </div>

                            {/* Instructor Feedback or Grade */}
                            {(sub.grade || sub.feedback || sub.instructorReply) && (
                                <div className="mt-4 pt-4 border-t border-gray-800/50">
                                    <h4 className="flex items-center gap-2 text-sm font-bold text-gray-300 mb-3">
                                        <FileText size={16} className="text-purple-400" />
                                        Instructor Feedback
                                    </h4>

                                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-4 rounded-xl border border-gray-700/50">
                                        {sub.grade && (
                                            <div className="mb-3 flex items-center gap-2">
                                                <span className="text-gray-400 text-xs uppercase font-bold">Grade:</span>
                                                <span className="text-white font-bold bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded text-sm">
                                                    {sub.grade}
                                                </span>
                                            </div>
                                        )}

                                        {(sub.feedback || sub.instructorReply) && (
                                            <p className="text-gray-300 text-sm leading-relaxed">
                                                {sub.feedback || sub.instructorReply}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )) : (
                        <div className="text-center py-20 bg-[#1a1c2e]/50 rounded-2xl border border-dashed border-gray-800">
                            <AlertCircle className="mx-auto text-gray-600 mb-4" size={48} />
                            <h3 className="text-xl font-bold text-gray-400">No projects found</h3>
                            <p className="text-gray-500 text-sm mt-2">
                                Start a roadmap and submit projects to see them here.
                            </p>
                            <button
                                onClick={() => navigate('/roadmap')}
                                className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-xl font-bold transition-all"
                            >
                                Browse Roadmaps
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentRoadmaps;
