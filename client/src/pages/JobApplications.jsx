import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Clock, CheckCircle, XCircle, Loader2, ExternalLink } from 'lucide-react';
import { jobsAPI } from '../services/api';
import { toast } from 'react-hot-toast';

const JobApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const response = await jobsAPI.getMyApplications();
            // Check if response.data is the array directly or inside a property
            const apps = Array.isArray(response.data) ? response.data : (response.data?.applications || []);
            setApplications(apps);
        } catch (error) {
            console.error('Fetch applications error:', error);
            toast.error('Failed to load applications');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const getStatusStyles = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
            case 'shortlisted':
                return 'bg-green-500/10 text-green-400 border-green-500/20';
            case 'rejected':
                return 'bg-red-500/10 text-red-400 border-red-500/20';
            case 'accepted':
                return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            default:
                return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
        }
    };

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Job Applications</h1>
                <p className="text-gray-400">Track your career progress and application status</p>
            </div>

            {loading ? (
                <div className="flex items-center justify-center p-20">
                    <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                </div>
            ) : applications.length === 0 ? (
                <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-12 text-center">
                    <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Briefcase className="w-8 h-8 text-gray-500" />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">No applications yet</h2>
                    <p className="text-gray-400 mb-6">You haven't applied for any jobs yet. Start exploring opportunities!</p>
                    <button
                        onClick={() => window.location.href = '/jobs'}
                        className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all"
                    >
                        Browse Jobs
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {applications.map((app, index) => (
                        <motion.div
                            key={app._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6 hover:border-indigo-500/50 transition-all group"
                        >
                            <div className="flex flex-col md:flex-row justify-between gap-4">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-xl font-bold text-white">{app.job?.title || 'Unknown Role'}</h3>
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusStyles(app.status)}`}>
                                            {app.status}
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                                        <div className="flex items-center gap-1">
                                            <Briefcase className="w-4 h-4 text-indigo-400" />
                                            <span>{app.job?.company}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <MapPin className="w-4 h-4 text-indigo-400" />
                                            <span>{app.job?.location}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-4 h-4 text-indigo-400" />
                                            <span>Applied {new Date(app.appliedAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 self-start md:self-center">
                                    <button
                                        onClick={() => window.location.href = `/jobs/${app.job?._id}`}
                                        className="p-3 bg-gray-700/50 hover:bg-gray-700 text-white rounded-xl transition-all"
                                        title="View Job"
                                    >
                                        <ExternalLink className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default JobApplications;
