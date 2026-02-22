import React, { useEffect, useState } from "react";
import { Search, Eye, CheckCircle, XCircle, Trash2, Clock, MapPin, Briefcase, FileText, Send, User, ChevronRight, Filter, RefreshCcw } from "lucide-react";
import { toast } from "react-hot-toast";
import { jobsAPI } from "../../services/api";
import { motion, AnimatePresence } from "framer-motion";
import ConfirmationModal from "../../components/Admin/ConfirmationModal";

const AdminJobApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedApp, setSelectedApp] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    // Confirmation Modal State
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: "",
        message: "",
        onConfirm: () => { },
        type: "danger"
    });

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const res = await jobsAPI.getInstructorApplications();
            setApplications(res.data.applications || []);
        } catch (error) {
            toast.error("Failed to fetch applications");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, status) => {
        setConfirmModal({
            isOpen: true,
            title: "Update Application Status",
            message: `Are you sure you want to change this application status to ${status.toUpperCase()}? An email notification will be sent to the candidate.`,
            type: "warning",
            onConfirm: async () => {
                try {
                    setActionLoading(true);
                    await jobsAPI.updateApplicationStatus(id, { status });
                    toast.success(`Application ${status} successfully`);
                    fetchApplications();
                    setIsModalOpen(false);
                } catch (error) {
                    toast.error("Failed to update status");
                } finally {
                    setActionLoading(false);
                }
            }
        });
    };

    const handleDelete = async (id) => {
        setConfirmModal({
            isOpen: true,
            title: "Delete Application",
            message: "Are you sure you want to delete this application? An email will be sent to the candidate explaining that their application was removed from the system. This action cannot be undone.",
            type: "danger",
            onConfirm: async () => {
                try {
                    setActionLoading(true);
                    await jobsAPI.deleteApplication(id);
                    toast.success("Application deleted successfully");
                    fetchApplications();
                } catch (error) {
                    toast.error("Failed to delete application");
                } finally {
                    setActionLoading(false);
                }
            }
        });
    };

    const filteredApplications = applications.filter(app => {
        const matchesSearch =
            app.student?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.student?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.job?.title?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || app.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusStyle = (status) => {
        switch (status) {
            case 'hired':
                return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
            case 'rejected':
                return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
            case 'interview':
                return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            default:
                return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
        }
    };

    return (
        <div className="p-4 md:p-8 min-h-screen bg-gray-900">
            {/* Header section... same as before but maybe a bit more polished */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                        <FileText className="w-8 h-8 text-blue-500" />
                        Job Applications
                    </h1>
                    <p className="text-gray-400">Review and manage candidate applications for active positions</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl px-4 py-2 border border-gray-700 flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        <span className="text-sm font-medium text-gray-300">{applications.length} Total</span>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="md:col-span-2 relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search candidates, roles, or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-800/50 border border-gray-700/50 rounded-2xl text-white outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-gray-600"
                    />
                </div>
                <div className="relative">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-800/50 border border-gray-700/50 rounded-2xl text-white outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer appearance-none transition-all"
                    >
                        <option value="all">All Statuses</option>
                        <option value="pending">Pending Review</option>
                        <option value="interview">Interview Stage</option>
                        <option value="hired">Hired / Accepted</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
                <button
                    onClick={fetchApplications}
                    className="flex items-center justify-center gap-2 px-6 py-3.5 bg-gray-800 hover:bg-gray-700 text-white rounded-2xl border border-gray-700 transition-all active:scale-95"
                >
                    <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>

            {/* Table */}
            <div className="bg-gray-800/40 border border-gray-700/50 rounded-[2.5rem] overflow-hidden backdrop-blur-md shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-800/50 border-b border-gray-700/50">
                                <th className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Candidate</th>
                                <th className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Job Details</th>
                                <th className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Applied On</th>
                                <th className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Status</th>
                                <th className="px-8 py-6 text-right text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Management</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700/30">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                                            <p className="text-gray-500 font-medium">Synchronizing application data...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredApplications.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4 text-gray-500">
                                            <div className="p-4 bg-gray-900 rounded-3xl">
                                                <FileText className="w-12 h-12 opacity-20" />
                                            </div>
                                            <p className="text-sm">No matching applications found</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredApplications.map((app) => (
                                    <tr key={app._id} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                                    {app.student?.name?.charAt(0) || 'U'}
                                                </div>
                                                <div>
                                                    <p className="text-white font-bold group-hover:text-blue-400 transition-colors">{app.student?.name}</p>
                                                    <p className="text-gray-500 text-sm font-mono">{app.student?.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div>
                                                <p className="text-white font-semibold">{app.job?.title || 'Unknown Position'}</p>
                                                <p className="text-gray-500 text-sm flex items-center gap-1.5 mt-1">
                                                    <Briefcase className="w-3.5 h-3.5" />
                                                    {app.job?.company}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 text-gray-400">
                                                <Clock className="w-4 h-4 text-gray-600" />
                                                <span className="text-sm">{new Date(app.appliedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-4 py-1.5 rounded-xl border text-[10px] uppercase font-black tracking-widest ${getStatusStyle(app.status)}`}>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedApp(app);
                                                        setIsModalOpen(true);
                                                    }}
                                                    className="p-3 bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-white rounded-xl transition-all shadow-sm active:scale-90"
                                                    title="Review Candidate"
                                                >
                                                    <Eye className="w-4.5 h-4.5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(app._id)}
                                                    className="p-3 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white rounded-xl transition-all shadow-sm active:scale-95"
                                                    title="Purge Application"
                                                >
                                                    <Trash2 className="w-4.5 h-4.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Application Detail Modal */}
            <AnimatePresence>
                {isModalOpen && selectedApp && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-gray-800 border border-gray-700 rounded-[2.5rem] max-w-4xl w-full my-auto overflow-hidden shadow-2xl"
                        >
                            {/* Modal Header */}
                            <div className="p-8 pb-4 flex items-start justify-between">
                                <div className="flex items-center gap-5">
                                    <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center text-white text-2xl font-black shadow-xl shadow-blue-600/20">
                                        <User className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-bold text-white tracking-tight">{selectedApp.student?.name}</h2>
                                        <p className="text-gray-400 flex items-center gap-2 mt-1">
                                            <MapPin className="w-4 h-4 text-blue-500" />
                                            Active Candidate • Applied {new Date(selectedApp.appliedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-3 hover:bg-gray-700 rounded-2xl text-gray-400 hover:text-white transition-all"
                                >
                                    <XCircle className="w-7 h-7" />
                                </button>
                            </div>

                            <div className="p-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Left Column */}
                                    <div className="space-y-8">
                                        <div className="bg-gray-900/50 rounded-3xl p-6 border border-gray-700/50">
                                            <h3 className="text-xs font-black text-blue-500 uppercase tracking-[0.2em] mb-4">Application Narrative</h3>
                                            <p className="text-gray-300 leading-relaxed italic">"{selectedApp.coverLetter || "Candidate did not provide a cover letter for this position."}"</p>
                                        </div>

                                        <div className="space-y-4">
                                            <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em]">Contact Metadata</h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-gray-900/30 p-4 rounded-2xl border border-gray-700/30">
                                                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Email Protocol</p>
                                                    <p className="text-white text-sm font-mono truncate">{selectedApp.student?.email}</p>
                                                </div>
                                                <div className="bg-gray-900/30 p-4 rounded-2xl border border-gray-700/30">
                                                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Phone/Comms</p>
                                                    <p className="text-white text-sm font-medium">{selectedApp.phone || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column */}
                                    <div className="space-y-8">
                                        <div className="bg-gray-900/50 rounded-3xl p-6 border border-gray-700/50">
                                            <h3 className="text-xs font-black text-blue-500 uppercase tracking-[0.2em] mb-4">Targeted Analytics</h3>
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-gray-400 text-sm font-medium">Position Target</span>
                                                    <span className="text-white font-bold">{selectedApp.job?.title}</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-gray-400 text-sm font-medium">Organization</span>
                                                    <span className="text-white font-bold">{selectedApp.job?.company}</span>
                                                </div>
                                                <div className="flex items-center justify-between border-t border-gray-700 pt-4 mt-4">
                                                    <span className="text-gray-400 text-sm font-medium">Current Classification</span>
                                                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${getStatusStyle(selectedApp.status)}`}>
                                                        {selectedApp.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Asset Verification</h3>
                                            <a
                                                href={selectedApp.resume}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex items-center justify-between w-full p-5 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 hover:from-blue-600/30 hover:to-indigo-600/30 border border-blue-500/30 rounded-3xl transition-all group/resume"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-600/20 group-hover/resume:scale-110 transition-transform">
                                                        <FileText className="w-6 h-6 text-white" />
                                                    </div>
                                                    <div className="text-left">
                                                        <p className="text-white font-bold">Candidate Curriculum Vitae</p>
                                                        <p className="text-blue-400/60 text-[10px] uppercase font-black tracking-widest mt-0.5">External Resource Link</p>
                                                    </div>
                                                </div>
                                                <ChevronRight className="w-6 h-6 text-blue-400 group-hover/resume:translate-x-1 transition-transform" />
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                {/* Management Actions */}
                                <div className="mt-12 pt-8 border-t border-gray-700 grid grid-cols-2 md:grid-cols-4 gap-3">
                                    <button
                                        onClick={() => handleUpdateStatus(selectedApp._id, 'pending')}
                                        disabled={actionLoading || selectedApp.status === 'pending'}
                                        className="py-4 bg-amber-500/10 hover:bg-amber-500 text-amber-500 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest border border-amber-500/20 transition-all disabled:opacity-20 flex flex-col items-center gap-2"
                                    >
                                        <Clock className="w-5 h-5 mb-1" />
                                        Pending
                                    </button>
                                    <button
                                        onClick={() => handleUpdateStatus(selectedApp._id, 'interview')}
                                        disabled={actionLoading || selectedApp.status === 'interview'}
                                        className="py-4 bg-blue-500/10 hover:bg-blue-500 text-blue-500 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest border border-blue-500/20 transition-all disabled:opacity-20 flex flex-col items-center gap-2"
                                    >
                                        <Send className="w-5 h-5 mb-1" />
                                        Interview
                                    </button>
                                    <button
                                        onClick={() => handleUpdateStatus(selectedApp._id, 'hired')}
                                        disabled={actionLoading || selectedApp.status === 'hired'}
                                        className="py-4 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 transition-all disabled:opacity-20 flex flex-col items-center gap-2"
                                    >
                                        <CheckCircle className="w-5 h-5 mb-1" />
                                        Hire Candidate
                                    </button>
                                    <button
                                        onClick={() => handleUpdateStatus(selectedApp._id, 'rejected')}
                                        disabled={actionLoading || selectedApp.status === 'rejected'}
                                        className="py-4 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest border border-rose-500/20 transition-all disabled:opacity-20 flex flex-col items-center gap-2"
                                    >
                                        <XCircle className="w-5 h-5 mb-1" />
                                        Reject
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
                type={confirmModal.type}
            />
        </div>
    );
};

export default AdminJobApplications;
