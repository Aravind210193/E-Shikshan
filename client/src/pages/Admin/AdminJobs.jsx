import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Edit, Trash2, Eye, Briefcase, MapPin, DollarSign, Clock, CheckCircle, X, Save } from "lucide-react";
import { toast } from "react-hot-toast";
import { adminJobAPI } from "../../services/adminApi";

const AdminJobs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedJob, setSelectedJob] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    type: "Full-time",
    salary: "",
    status: "Active",
  });

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = {
        search: searchQuery || undefined,
        type: filterType !== 'all' ? filterType : undefined,
        page: 1,
        limit: 50,
      };
      const { data } = await adminJobAPI.getAll(params);
      setJobs(data?.jobs || []);
    } catch (e) {
      console.error(e);
      setError(e?.response?.data?.message || 'Failed to load jobs');
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         job.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === "all" || job.type === filterType;
    return matchesSearch && matchesFilter;
  });

  // CRUD Operations
  const handleAdd = () => {
    setModalMode("add");
    setFormData({ title: "", company: "", location: "", type: "Full-time", salary: "", status: "Active" });
    setShowModal(true);
  };

  const handleEdit = (job) => {
    setModalMode("edit");
    setSelectedJob(job);
    setFormData({ 
      title: job.title, 
      company: job.company, 
      location: job.location, 
      type: job.type, 
      salary: job.salary, 
      status: job.status 
    });
    setShowModal(true);
  };

  const handleView = (job) => {
    setModalMode("view");
    setSelectedJob(job);
    setShowModal(true);
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await adminJobAPI.delete(jobId);
      setJobs(jobs.filter(j => j._id !== jobId));
      toast.success("Job deleted successfully");
    } catch {
      toast.error("Failed to delete job");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === "add") {
        const { data } = await adminJobAPI.create(formData);
        setJobs([data.job, ...jobs]);
        toast.success("Job posted successfully");
      } else if (modalMode === "edit") {
        const { data } = await adminJobAPI.update(selectedJob._id, formData);
        setJobs(jobs.map(j => j._id === selectedJob._id ? data.job : j));
        toast.success("Job updated successfully");
      }
      setShowModal(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Operation failed');
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Job Management</h1>
          <p className="text-gray-400">Manage job postings and applications</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAdd}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold flex items-center gap-2 shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Post New Job
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[ 
          { label: "Total Jobs", value: jobs.length, color: "blue" },
          { label: "Active Jobs", value: jobs.filter(j => j.status === "Active").length, color: "green" },
          { label: "Pending Approval", value: jobs.filter(j => j.status === "Pending").length, color: "yellow" },
          { label: "Total Applicants", value: jobs.reduce((sum, j) => sum + (j.applicants || 0), 0), color: "purple" }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800 rounded-xl p-4 border border-gray-700"
          >
            <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
            <p className={`text-2xl font-bold ${
              stat.color === 'blue' ? 'text-blue-400' :
              stat.color === 'green' ? 'text-green-400' :
              stat.color === 'yellow' ? 'text-yellow-400' :
              'text-purple-400'
            }`}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search jobs or companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="all">All Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>
        </div>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-gray-400 text-center">Loading jobs...</div>
        ) : error ? (
          <div className="text-rose-400 text-center">{String(error)}</div>
        ) : filteredJobs.map((job, index) => (
          <motion.div
            key={job._id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-gray-800 rounded-2xl border border-gray-700 p-6 hover:border-blue-500/50 transition-all duration-300"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Job Info */}
              <div className="flex-1 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-1">{job.title}</h3>
                    <p className="text-gray-400">{job.company}</p>
                  </div>
                  <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    job.status === 'Active' 
                      ? 'bg-green-500/20 text-green-400' 
                      : job.status === 'Pending'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {job.status}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${job.source === 'admin' ? 'bg-purple-500/20 text-purple-300 border border-purple-400/30' : 'bg-blue-500/20 text-blue-300 border border-blue-400/30'}`}>
                    {job.source === 'admin' ? 'Admin Job' : 'Public Job'}
                  </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4" />
                    <span>{job.type}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    <span>{job.salary}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>Posted {new Date(job.posted || job.createdAt).toISOString().split('T')[0]}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-gray-700">
                  <CheckCircle className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-gray-300">
                    <span className="font-semibold text-blue-400">{job.applicants}</span> applicants
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex lg:flex-col gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleView(job)}
                  className="flex-1 lg:flex-none px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  View
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => job.source !== 'public' && handleEdit(job)}
                  disabled={job.source === 'public'}
                  title={job.source === 'public' ? 'Public jobs are read-only' : ''}
                  className={`flex-1 lg:flex-none px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${job.source==='public' ? 'bg-gray-800 text-gray-400 cursor-not-allowed' : 'bg-gray-700 hover:bg-gray-600 text-white'}`}
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => job.source !== 'public' && handleDelete(job._id)}
                  disabled={job.source === 'public'}
                  title={job.source === 'public' ? 'Public jobs are read-only' : ''}
                  className={`flex-1 lg:flex-none px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${job.source==='public' ? 'bg-gray-800 text-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 text-white'}`}
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2 pt-4">
        <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors border border-gray-700">
          Previous
        </button>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
          1
        </button>
        <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors border border-gray-700">
          2
        </button>
        <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors border border-gray-700">
          Next
        </button>
      </div>

      {/* Add/Edit/View Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-800 rounded-2xl border border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">
                  {modalMode === "add" ? "Post New Job" : modalMode === "edit" ? "Edit Job" : "Job Details"}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="p-6">
                {modalMode === "view" ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-400">Job Title</label>
                      <p className="text-white font-medium mt-1">{selectedJob?.title}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-400">Company</label>
                        <p className="text-white font-medium mt-1">{selectedJob?.company}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">Location</label>
                        <p className="text-white font-medium mt-1">{selectedJob?.location}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-400">Job Type</label>
                        <p className="text-white font-medium mt-1">{selectedJob?.type}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">Salary</label>
                        <p className="text-white font-medium mt-1">{selectedJob?.salary}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-400">Status</label>
                        <p className="text-white font-medium mt-1">{selectedJob?.status}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">Applicants</label>
                        <p className="text-white font-medium mt-1">{selectedJob?.applicants}</p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Posted Date</label>
                      <p className="text-white font-medium mt-1">{selectedJob?.posted}</p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Job Title *</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Enter job title"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">Company *</label>
                        <input
                          type="text"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          required
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
                          placeholder="Company name"
                        />
                      </div>

                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">Location *</label>
                        <input
                          type="text"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          required
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
                          placeholder="City/Remote"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">Job Type *</label>
                        <select
                          value={formData.type}
                          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                          <option value="Full-time">Full-time</option>
                          <option value="Part-time">Part-time</option>
                          <option value="Contract">Contract</option>
                          <option value="Internship">Internship</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">Salary *</label>
                        <input
                          type="text"
                          value={formData.salary}
                          onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                          required
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
                          placeholder="e.g., ₹8-12 LPA"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Status *</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500 outline-none"
                      >
                        <option value="Active">Active</option>
                        <option value="Pending">Pending</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2"
                      >
                        <Save className="w-5 h-5" />
                        {modalMode === "add" ? "Post Job" : "Update Job"}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={() => setShowModal(false)}
                        className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-semibold"
                      >
                        Cancel
                      </motion.button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminJobs;
