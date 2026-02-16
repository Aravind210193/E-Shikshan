import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader, FileCheck, X, Send, User, Award, Trophy, Users, Mail, Phone, Github, Globe, ExternalLink, Clock } from "lucide-react";
import { toast } from "react-hot-toast";
import { hackathonRegistrationAPI } from "../../services/api";

const AdminHackathonRegistrations = () => {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [selectedReg, setSelectedReg] = useState(null);
    const [activeQuickFilter, setActiveQuickFilter] = useState("all");
    const [updating, setUpdating] = useState(false);
    const [updateForm, setUpdateForm] = useState({ status: "", message: "" });

    useEffect(() => {
        fetchRegistrations();
    }, []);

    const fetchRegistrations = async () => {
        try {
            setLoading(true);
            const response = await hackathonRegistrationAPI.getInstructorRegistrations();
            setRegistrations(response.data.registrations || []);
        } catch (error) {
            console.error("Failed to fetch registrations:", error);
            toast.error("Failed to load registrations");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (e) => {
        if (e) e.preventDefault();
        if (!selectedReg) return;

        try {
            setUpdating(true);
            await hackathonRegistrationAPI.updateRegistrationStatus(selectedReg._id, updateForm);
            toast.success(`Registration status updated to ${updateForm.status}`);
            setSelectedReg(null);
            fetchRegistrations();
        } catch (error) {
            console.error("Status update error:", error);
            toast.error(error?.response?.data?.message || "Failed to update status");
        } finally {
            setUpdating(false);
        }
    };

    const openUpdateModal = (reg, status) => {
        setSelectedReg(reg);
        setUpdateForm({ status: status || reg.status, message: "" });
    };

    const filteredRegistrations = registrations.filter(reg => {
        const studentName = reg.userDetails?.name || reg.userId?.name || "";
        const hackTitle = reg.hackathonId?.title || "";
        const teamName = reg.teamName || "";

        const matchesSearch = studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            hackTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
            teamName.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = filterStatus === "all" || reg.status === filterStatus;

        // Quick Filters
        let matchesQuick = true;
        if (activeQuickFilter === 'pending') matchesQuick = reg.status === 'pending';
        else if (activeQuickFilter === 'team') matchesQuick = reg.teamSize > 1;
        else if (activeQuickFilter === 'solo') matchesQuick = reg.teamSize === 1;

        return matchesSearch && matchesStatus && matchesQuick;
    });

    return (
        <div className="p-6 space-y-6 bg-[#0f1117] min-h-screen text-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                        <Trophy className="text-rose-500 w-8 h-8" />
                        Hackathon Management
                    </h1>
                    <p className="text-gray-400">Review applications and manage participant status</p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div
                    onClick={() => setActiveQuickFilter("all")}
                    className={`bg-[#161923] border rounded-2xl p-5 flex items-center gap-5 cursor-pointer transition-all ${activeQuickFilter === 'all' ? 'border-rose-500 bg-rose-500/5 shadow-rose-500/10 shadow-lg' : 'border-gray-800 hover:border-gray-700'}`}
                >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${activeQuickFilter === 'all' ? 'bg-rose-500 text-white' : 'bg-rose-500/10 text-rose-500'}`}>
                        <Trophy size={24} />
                    </div>
                    <div>
                        <p className="text-white font-bold text-2xl">{registrations.length}</p>
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Total Registered</p>
                    </div>
                </div>
                <div
                    onClick={() => setActiveQuickFilter("pending")}
                    className={`bg-[#161923] border rounded-2xl p-5 flex items-center gap-5 cursor-pointer transition-all ${activeQuickFilter === 'pending' ? 'border-amber-500 bg-amber-500/5 shadow-amber-500/10 shadow-lg' : 'border-gray-800 hover:border-gray-700'}`}
                >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${activeQuickFilter === 'pending' ? 'bg-amber-500 text-white' : 'bg-amber-500/10 text-amber-500'}`}>
                        <Clock size={24} />
                    </div>
                    <div>
                        <p className="text-white font-bold text-2xl">{registrations.filter(r => r.status === 'pending').length}</p>
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Pending Review</p>
                    </div>
                </div>
                <div
                    onClick={() => setActiveQuickFilter("team")}
                    className={`bg-[#161923] border rounded-2xl p-5 flex items-center gap-5 cursor-pointer transition-all ${activeQuickFilter === 'team' ? 'border-blue-500 bg-blue-500/5 shadow-blue-500/10 shadow-lg' : 'border-gray-800 hover:border-gray-700'}`}
                >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${activeQuickFilter === 'team' ? 'bg-blue-500 text-white' : 'bg-blue-500/10 text-blue-500'}`}>
                        <Users size={24} />
                    </div>
                    <div>
                        <p className="text-white font-bold text-2xl">{registrations.filter(r => r.teamSize > 1).length}</p>
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Teams</p>
                    </div>
                </div>
                <div
                    onClick={() => setActiveQuickFilter("solo")}
                    className={`bg-[#161923] border rounded-2xl p-5 flex items-center gap-5 cursor-pointer transition-all ${activeQuickFilter === 'solo' ? 'border-indigo-500 bg-indigo-500/5 shadow-indigo-500/10 shadow-lg' : 'border-gray-800 hover:border-gray-700'}`}
                >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${activeQuickFilter === 'solo' ? 'bg-indigo-500 text-white' : 'bg-indigo-500/10 text-indigo-500'}`}>
                        <User size={24} />
                    </div>
                    <div>
                        <p className="text-white font-bold text-2xl">{registrations.filter(r => r.teamSize === 1).length}</p>
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Solo Players</p>
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
                            placeholder="Search by student, team, or hackathon..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-[#0f1117] border border-gray-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-rose-500/50 transition-all placeholder-gray-600"
                        />
                    </div>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-3 bg-[#0f1117] border border-gray-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-rose-500/50 cursor-pointer min-w-[160px]"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="further_round">Further Round</option>
                        <option value="waitlisted">Waitlisted</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>

                {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center gap-4">
                        <Loader className="w-10 h-10 text-rose-500 animate-spin" />
                        <p className="text-gray-500 font-medium animate-pulse">Fetching registrations...</p>
                    </div>
                ) : filteredRegistrations.length === 0 ? (
                    <div className="py-20 text-center">
                        <X size={48} className="mx-auto text-gray-700 mb-4 opacity-20" />
                        <p className="text-gray-400 text-lg font-medium">No registrations found</p>
                        <p className="text-gray-600 mt-1">Try adjusting your filters or search terms</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-[#0f1117] text-gray-400 text-xs font-black uppercase tracking-widest">
                                    <th className="px-6 py-4">Participant / Team</th>
                                    <th className="px-6 py-4">Hackathon</th>
                                    <th className="px-6 py-4">Project Idea</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800/50">
                                {filteredRegistrations.map((reg, index) => (
                                    <motion.tr
                                        key={reg._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.03 }}
                                        className="hover:bg-gray-800/20 transition-colors group"
                                    >
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 to-rose-700 flex items-center justify-center text-white font-bold shadow-lg shadow-rose-500/20">
                                                    {(reg.userDetails?.name || reg.userId?.name || '?').charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-white font-bold text-sm leading-tight">{reg.teamName || reg.userDetails?.name || reg.userId?.name}</p>
                                                    <p className="text-gray-500 text-xs mt-1 flex items-center gap-1">
                                                        {reg.teamSize > 1 ? (
                                                            <><Users size={12} className="text-blue-400" /> {reg.teamSize} Members</>
                                                        ) : (
                                                            <><User size={12} className="text-indigo-400" /> Solo Entry</>
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col">
                                                <span className="text-rose-400/80 text-[10px] font-bold uppercase tracking-tighter mb-0.5">Participating in</span>
                                                <span className="text-white font-semibold text-sm line-clamp-1">{reg.hackathonId?.title || 'Unknown Hackathon'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="max-w-[200px]">
                                                <p className="text-gray-300 font-medium text-sm line-clamp-1">{reg.projectTitle || 'N/A'}</p>
                                                <p className="text-gray-500 text-xs mt-1 line-clamp-1 italic">{reg.projectDescription || 'No description provided'}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${reg.status === 'approved' ? 'bg-green-500/10 text-green-400' :
                                                reg.status === 'rejected' ? 'bg-rose-500/10 text-rose-400' :
                                                    reg.status === 'waitlisted' ? 'bg-blue-500/10 text-blue-400' :
                                                        reg.status === 'shortlisted' ? 'bg-purple-500/10 text-purple-400' :
                                                            reg.status === 'further_round' ? 'bg-cyan-500/10 text-cyan-400' :
                                                                'bg-amber-500/10 text-amber-400 animate-pulse'
                                                }`}>
                                                {reg.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => openUpdateModal(reg)}
                                                className="bg-gray-800 hover:bg-rose-600 text-gray-300 hover:text-white px-4 py-2 rounded-lg text-xs font-bold transition-all border border-gray-700 hover:border-rose-500 active:scale-95"
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

            {/* Details & Status Update Modal */}
            <AnimatePresence>
                {selectedReg && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-[#161923] border border-gray-800 rounded-3xl w-full max-w-4xl shadow-2xl relative my-8"
                        >
                            <button
                                onClick={() => setSelectedReg(null)}
                                className="absolute top-6 right-6 p-2 bg-gray-800/50 hover:bg-rose-600/20 text-gray-500 hover:text-rose-500 rounded-xl transition-all z-10"
                            >
                                <X size={24} />
                            </button>

                            <div className="grid grid-cols-1 lg:grid-cols-5 h-full">
                                {/* Left Side: Details */}
                                <div className="lg:col-span-3 p-8 border-r border-gray-800/50 overflow-y-auto max-h-[85vh]">
                                    <div className="flex items-center gap-6 mb-8 border-b border-gray-800/50 pb-8">
                                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-700 flex items-center justify-center text-white text-3xl font-black shadow-2xl shadow-rose-500/30">
                                            {(selectedReg.userDetails?.name || '?').charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-1">
                                                <h2 className="text-2xl font-black text-white">{selectedReg.teamName || selectedReg.userDetails?.name}</h2>
                                            </div>
                                            <p className="text-gray-400 flex items-center gap-2">
                                                <Trophy size={16} className="text-rose-500" />
                                                {selectedReg.hackathonId?.title}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                        <div className="space-y-4">
                                            <div className="bg-[#0f1117] p-4 rounded-2xl border border-gray-800/50">
                                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                    <User size={14} className="text-rose-500" /> Participant Info
                                                </p>
                                                <div className="space-y-2">
                                                    <p className="text-white font-bold text-sm">{selectedReg.userDetails?.name}</p>
                                                    <p className="text-gray-400 text-xs flex items-center gap-2"><Mail size={12} /> {selectedReg.userDetails?.email}</p>
                                                    <p className="text-gray-400 text-xs flex items-center gap-2"><Phone size={12} /> {selectedReg.userDetails?.phone || 'N/A'}</p>
                                                </div>
                                            </div>

                                            <div className="bg-[#0f1117] p-4 rounded-2xl border border-gray-800/50">
                                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                    <Globe size={14} className="text-cyan-500" /> Social Links
                                                </p>
                                                <div className="space-y-3">
                                                    {selectedReg.githubUrl ? (
                                                        <a href={selectedReg.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-xs text-gray-300 hover:text-white transition-colors">
                                                            <div className="p-1.5 bg-gray-800 rounded-lg"><Github size={14} /></div>
                                                            GitHub Profile
                                                            <ExternalLink size={10} className="text-gray-600" />
                                                        </a>
                                                    ) : <p className="text-gray-600 text-[10px]">No GitHub provided</p>}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="bg-[#0f1117] p-4 rounded-2xl border border-gray-800/50">
                                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                    <Users size={14} className="text-blue-500" /> Team Dynamics
                                                </p>
                                                <p className="text-white font-bold text-sm mb-1">{selectedReg.teamName || 'Solo'}</p>
                                                <p className="text-gray-400 text-xs">{selectedReg.teamSize} Member(s)</p>
                                            </div>

                                            <div className="bg-[#0f1117] p-4 rounded-2xl border border-gray-800/50">
                                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                    <Award size={14} className="text-amber-500" /> Stack
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedReg.techStack?.map(tag => (
                                                        <span key={tag} className="px-2 py-1 bg-rose-500/10 text-rose-400 text-[10px] font-black rounded-lg border border-rose-500/20 uppercase">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-[#0f1117] p-6 rounded-2xl border border-gray-800/50">
                                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Project Concept</p>
                                        <h4 className="text-white font-black text-lg mb-2">{selectedReg.projectTitle || 'Untitled'}</h4>
                                        <p className="text-gray-400 text-sm leading-relaxed">{selectedReg.projectDescription}</p>
                                        {selectedReg.motivation && (
                                            <p className="mt-4 text-gray-300 text-sm italic border-l-2 border-rose-500/30 pl-4">{selectedReg.motivation}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Right Side: Actions */}
                                <div className="lg:col-span-2 p-8 bg-[#1a1e2b]/30">
                                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                        <FileCheck className="text-rose-500" />
                                        Update Status
                                    </h3>

                                    <form onSubmit={handleStatusUpdate} className="space-y-6">
                                        <div>
                                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2 block">New Status</label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {['pending', 'approved', 'shortlisted', 'further_round', 'waitlisted', 'rejected'].map((s) => (
                                                    <button
                                                        key={s}
                                                        type="button"
                                                        onClick={() => setUpdateForm({ ...updateForm, status: s })}
                                                        className={`py-2 px-3 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all ${updateForm.status === s
                                                                ? 'border-rose-500 bg-rose-500 text-white shadow-lg shadow-rose-500/20'
                                                                : 'border-gray-800 bg-[#0f1117] text-gray-500 hover:border-gray-700'
                                                            }`}
                                                    >
                                                        {s.replace('_', ' ')}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2 block">Instruction / Feedback</label>
                                            <textarea
                                                value={updateForm.message}
                                                onChange={(e) => setUpdateForm({ ...updateForm, message: e.target.value })}
                                                placeholder="Enter feedback or next steps for the student..."
                                                className="w-full h-32 bg-[#0f1117] border border-gray-800 rounded-2xl p-4 text-sm text-white resize-none outline-none focus:ring-2 focus:ring-rose-500/50 placeholder:text-gray-700"
                                            />
                                            <p className="text-[10px] text-gray-600 mt-2">This message will be sent to the student via email and notification.</p>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={updating || !updateForm.status}
                                            className="w-full bg-rose-600 hover:bg-rose-500 disabled:bg-gray-800 text-white font-black uppercase tracking-widest py-4 rounded-2xl transition-all shadow-xl shadow-rose-500/20 active:scale-95 flex items-center justify-center gap-2"
                                        >
                                            {updating ? (
                                                <><Loader className="w-4 h-4 animate-spin" /> Processing...</>
                                            ) : (
                                                <><Send className="w-4 h-4" /> Send Update</>
                                            )}
                                        </button>
                                    </form>

                                    <div className="mt-8 p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl">
                                        <p className="text-[10px] text-amber-500 font-bold leading-relaxed flex gap-2">
                                            <Clock size={14} className="flex-shrink-0" />
                                            Updating status will trigger an automated email to all team members and the lead participant.
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

export default AdminHackathonRegistrations;
