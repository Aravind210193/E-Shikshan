import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader, FileCheck, X, Send, User, Briefcase, Mail, FileText, ExternalLink, Clock, Building2, MapPin } from "lucide-react";
import { toast } from "react-hot-toast";
import { jobsAPI } from "../../services/api";

const AdminJobApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [selectedApp, setSelectedApp] = useState(null);
    const [activeQuickFilter, setActiveQuickFilter] = useState("all");
    const [updating, setUpdating] = useState(false);
    const [updateForm, setUpdateForm] = useState({ status: "", message: "" });

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const response = await jobsAPI.getInstructorApplications();
            setApplications(response.data.applications || []);
        } catch (error) {
            console.error("Failed to fetch applications:", error);
            toast.error("Failed to load applications");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (e) => {
        if (e) e.preventDefault();
        if (!selectedApp) return;

        try {
            setUpdating(true);
            await jobsAPI.updateApplicationStatus(selectedApp._id, updateForm);
            toast.success(`Application status updated to ${updateForm.status}`);
            setSelectedApp(null);
            fetchApplications();
        } catch (error) {
            console.error("Status update error:", error);
            toast.error(error?.response?.data?.message || "Failed to update status");
        } finally {
            setUpdating(false);
        }
    };

    const openUpdateModal = (app) => {
        setSelectedApp(app);
        setUpdateForm({ status: app.status, message: "" });
    };

    const filteredApplications = applications.filter(app => {
        const studentName = app.student?.name || "";
        const jobTitle = app.job?.title || "";
        const email = app.student?.email || "";

        const matchesSearch = studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
            email.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = filterStatus === "all" || app.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="p-6 space-y-6 bg-[#0f1117] min-h-screen text-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                        <Briefcase className="text-blue-500 w-8 h-8" />
                        Job Applications
                    </h1>
                    <p className="text-gray-400">Manage candidate reviews and selection process</p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-[#161923] border border-gray-800 rounded-2xl p-5 flex items-center gap-5">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                        <Briefcase size={24} />
                    </div>
                    <div>
                        <p className="text-white font-bold text-2xl">{applications.length}</p>
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Total Applied</p>
                    </div>
                </div>
                <div className="bg-[#161923] border border-gray-800 rounded-2xl p-5 flex items-center gap-5">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                        <Clock size={24} />
                    </div>
                    <div>
                        <p className="text-white font-bold text-2xl">{applications.filter(a => a.status === 'pending').length}</p>
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Pending Review</p>
                    </div>
                </div>
                <div className="bg-[#161923] border border-gray-800 rounded-2xl p-5 flex items-center gap-5">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                        <FileCheck size={24} />
                    </div>
                    <div>
                        <p className="text-white font-bold text-2xl">{applications.filter(a => ['shortlisted', 'interview'].includes(a.status)).length}</p>
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Pipeline</p>
                    </div>
                </div>
                <div className="bg-[#161923] border border-gray-800 rounded-2xl p-5 flex items-center gap-5">
                    <div className="w-12 h-12 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center">
                        <User size={24} />
                    </div>
                    <div>
                        <p className="text-white font-bold text-2xl">{applications.filter(a => a.status === 'accepted').length}</p>
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Hired</p>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="bg-[#161923] rounded-2xl border border-gray-800 overflow-hidden shadow-2xl">
                <div className="p-4 border-b border-gray-800 flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by student or job role..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-[#0f1117] border border-gray-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder-gray-600"
                        />
                    </div>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-3 bg-[#0f1117] border border-gray-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer min-w-[160px]"
                    >
                        <option value="all">All Status</option>
                        {['pending', 'reviewed', 'shortlisted', 'interview', 'accepted', 'rejected'].map(s => (
                            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                    </select>
                </div>

                {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center gap-4">
                        <Loader className="w-10 h-10 text-blue-500 animate-spin" />
                        <p className="text-gray-500 font-medium animate-pulse">Fetching applications...</p>
                    </div>
                ) : filteredApplications.length === 0 ? (
                    <div className="py-20 text-center">
                        <X size={48} className="mx-auto text-gray-700 mb-4 opacity-20" />
                        <p className="text-gray-400 text-lg font-medium">No applications found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-[#0f1117] text-gray-400 text-xs font-black uppercase tracking-widest">
                                    <th className="px-6 py-4">Applicant</th>
                                    <th className="px-6 py-4">Role / Company</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800/50">
                                {filteredApplications.map((app, index) => (
                                    <motion.tr
                                        key={app._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.03 }}
                                        className="hover:bg-gray-800/20 transition-colors"
                                    >
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                                                    {(app.student?.name || '?').charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-white font-bold text-sm leading-tight">{app.student?.name}</p>
                                                    <p className="text-gray-500 text-xs mt-1">{app.student?.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div>
                                                <p className="text-white font-semibold text-sm">{app.job?.title}</p>
                                                <p className="text-gray-500 text-xs flex items-center gap-1">
                                                    <Building2 size={12} /> {app.job?.company || 'Internal Role'}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${app.status === 'accepted' ? 'bg-green-500/10 text-green-400' :
                                                    app.status === 'rejected' ? 'bg-red-500/10 text-red-400' :
                                                        app.status === 'interview' ? 'bg-purple-500/10 text-purple-400' :
                                                            app.status === 'shortlisted' ? 'bg-blue-500/10 text-blue-400' :
                                                                'bg-amber-500/10 text-amber-400'
                                                }`}>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <button
                                                onClick={() => openUpdateModal(app)}
                                                className="bg-gray-800 hover:bg-blue-600 text-gray-300 hover:text-white px-4 py-2 rounded-lg text-xs font-bold transition-all border border-gray-700 hover:border-blue-500"
                                            >
                                                Review
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Application Detail & Status Update Modal */}
            <AnimatePresence>
                {selectedApp && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-[#161923] border border-gray-800 rounded-3xl w-full max-w-4xl shadow-2xl relative my-8"
                        >
                            <button
                                onClick={() => setSelectedApp(null)}
                                className="absolute top-6 right-6 p-2 bg-gray-800/50 hover:bg-blue-600/20 text-gray-500 hover:text-blue-500 rounded-xl transition-all z-10"
                            >
                                <X size={24} />
                            </button>

                            <div className="grid grid-cols-1 lg:grid-cols-5 h-full">
                                {/* Left: Candidate profile */}
                                <div className="lg:col-span-3 p-8 border-r border-gray-800/50 overflow-y-auto max-h-[85vh]">
                                    <div className="flex items-center gap-6 mb-8 border-b border-gray-800/50 pb-8">
                                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-3xl font-black shadow-2xl shadow-blue-500/30">
                                            {(selectedApp.student?.name || '?').charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1">
                                            <h2 className="text-2xl font-black text-white">{selectedApp.student?.name}</h2>
                                            <p className="text-gray-400 flex items-center gap-2 mt-1">
                                                <Briefcase size={16} className="text-blue-500" />
                                                {selectedApp.job?.title}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="bg-[#0f1117] p-4 rounded-2xl border border-gray-800/50">
                                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Contact Info</p>
                                                <div className="space-y-2">
                                                    <p className="text-white text-sm flex items-center gap-2"><Mail size={14} className="text-blue-400" /> {selectedApp.student?.email}</p>
                                                </div>
                                            </div>
                                            <div className="bg-[#0f1117] p-4 rounded-2xl border border-gray-800/50 flex items-center justify-between">
                                                <div>
                                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Resume</p>
                                                    <p className="text-white text-sm">Attached Document</p>
                                                </div>
                                                <a
                                                    href={selectedApp.resumeUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="p-3 bg-blue-500/20 text-blue-400 rounded-xl hover:bg-blue-500 hover:text-white transition-all"
                                                >
                                                    <ExternalLink size={18} />
                                                </a>
                                            </div>
                                        </div>

                                        <div className="bg-[#0f1117] p-6 rounded-2xl border border-gray-800/50">
                                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Cover Letter</p>
                                            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap italic">
                                                "{selectedApp.coverLetter || 'No cover letter submitted.'}"
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Action Center */}
                                <div className="lg:col-span-2 p-8 bg-[#1a1e2b]/30">
                                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                        <FileCheck className="text-blue-500" />
                                        Process Application
                                    </h3>

                                    <form onSubmit={handleStatusUpdate} className="space-y-6">
                                        <div>
                                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2 block">Application Status</label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {['reviewed', 'shortlisted', 'interview', 'accepted', 'rejected'].map((s) => (
                                                    <button
                                                        key={s}
                                                        type="button"
                                                        onClick={() => setUpdateForm({ ...updateForm, status: s })}
                                                        className={`py-2 px-3 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all ${updateForm.status === s
                                                                ? 'border-blue-500 bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                                                                : 'border-gray-800 bg-[#0f1117] text-gray-500 hover:border-gray-700'
                                                            }`}
                                                    >
                                                        {s}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2 block">Feedback Message</label>
                                            <textarea
                                                value={updateForm.message}
                                                onChange={(e) => setUpdateForm({ ...updateForm, message: e.target.value })}
                                                placeholder="Provide feedback or next steps (optional)..."
                                                className="w-full h-32 bg-[#0f1117] border border-gray-800 rounded-2xl p-4 text-sm text-white resize-none outline-none focus:ring-2 focus:ring-blue-500/50 placeholder:text-gray-700"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={updating || !updateForm.status}
                                            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 text-white font-black uppercase tracking-widest py-4 rounded-2xl transition-all shadow-xl shadow-blue-500/20 active:scale-95 flex items-center justify-center gap-2"
                                        >
                                            {updating ? (
                                                <><Loader className="w-4 h-4 animate-spin" /> Processing...</>
                                            ) : (
                                                <><Send className="w-4 h-4" /> Update Candidate</>
                                            )}
                                        </button>
                                    </form>

                                    <div className="mt-8 p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
                                        <p className="text-[10px] text-blue-400 font-bold leading-relaxed flex gap-2">
                                            <Clock size={14} className="flex-shrink-0" />
                                            Updating status will notify the candidate and update their dashboard in real-time.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminJobApplications;
