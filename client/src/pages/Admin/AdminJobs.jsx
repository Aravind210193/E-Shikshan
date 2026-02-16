import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Edit, Trash2, Eye, Briefcase, MapPin, DollarSign, Clock, CheckCircle, X, Save } from "lucide-react";
import { toast } from "react-hot-toast";
import { adminJobAPI } from "../../services/adminApi";
import ConfirmationModal from "../../components/Admin/ConfirmationModal";

// Helper Components for Modal
const DetailItem = ({ label, value, isLink }) => (
  <div className="space-y-1">
    <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">{label}</p>
    {isLink ? (
      <a href={value} target="_blank" rel="noreferrer" className="text-sm text-blue-400 hover:underline break-all block">
        {value || 'Not provided'}
      </a>
    ) : (
      <p className="text-sm text-white font-medium">{value || 'Not specified'}</p>
    )}
  </div>
);

const FormSection = ({ title, children }) => (
  <section className="space-y-4">
    <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] pb-2 border-b border-gray-700/50">{title}</h3>
    <div className="space-y-4">{children}</div>
  </section>
);

const FormInput = ({ label, value, onChange, type = "text", required = false, placeholder = "" }) => (
  <div>
    <label className="text-xs font-bold text-gray-400 mb-1.5 block uppercase tracking-wider">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      placeholder={placeholder}
      className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
    />
  </div>
);

const FormSelect = ({ label, value, options, onChange }) => (
  <div>
    <label className="text-xs font-bold text-gray-400 mb-1.5 block uppercase tracking-wider">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer"
    >
      {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </div>
);

const FormTextarea = ({ label, value, onChange, required = false, placeholder = "", height = "h-24" }) => (
  <div>
    <label className="text-xs font-bold text-gray-400 mb-1.5 block uppercase tracking-wider">{label}</label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      placeholder={placeholder}
      className={`w-full ${height} px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none`}
    />
  </div>
);

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
    description: "",
    about: "",
    responsibilities: "", // will handle as newline separated string for input
    requirements: "", // maps to curriculum
    logo: "",
    category: "",
    skills: "",
    duration: "",
    startDate: "",
    timePerWeek: "",
    mode: "Remote",
    credential: "",
    experienceLevel: "",
    openings: 1,
    companyWebsite: "",
    applyUrl: "",
    salaryMin: 0,
    salaryMax: 0,
    currency: "INR",
    benefits: "",
    howto: ""
  });

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);

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
    setFormData({
      title: "", company: "", location: "", type: "Full-time", salary: "", status: "Active",
      description: "", about: "", responsibilities: "", requirements: "", logo: "",
      category: "", skills: "", duration: "", startDate: "", timePerWeek: "",
      mode: "Remote", credential: "", experienceLevel: "", openings: 1,
      companyWebsite: "", applyUrl: "", salaryMin: 0, salaryMax: 0, currency: "INR",
      benefits: "", howto: ""
    });
    setShowModal(true);
  };

  const handleEdit = (job) => {
    setModalMode("edit");
    setSelectedJob(job);
    setFormData({
      title: job.title || "",
      company: job.company || "",
      location: job.location || "",
      type: job.type || "Full-time",
      salary: job.salary || "",
      status: job.status || "Active",
      description: job.description || "",
      about: job.about || "",
      responsibilities: Array.isArray(job.responsibilities) ? job.responsibilities.join('\n') : job.responsibilities || "",
      requirements: Array.isArray(job.requirements) ? job.requirements.join('\n') : job.requirements || "",
      logo: job.logo || "",
      category: job.category || "",
      skills: Array.isArray(job.skills) ? job.skills.join(', ') : job.skills || "",
      duration: job.duration || "",
      startDate: job.startDate || "",
      timePerWeek: job.timePerWeek || "",
      mode: job.mode || "Remote",
      credential: job.credential || "",
      experienceLevel: job.experienceLevel || "",
      openings: job.openings || 1,
      companyWebsite: job.companyWebsite || "",
      applyUrl: job.applyUrl || "",
      salaryMin: job.salaryMin || 0,
      salaryMax: job.salaryMax || 0,
      currency: job.currency || "INR",
      benefits: Array.isArray(job.benefits) ? job.benefits.join('\n') : job.benefits || "",
      howto: Array.isArray(job.howto) ? job.howto.join('\n') : job.howto || ""
    });
    setShowModal(true);
  };

  const handleView = (job) => {
    setModalMode("view");
    setSelectedJob(job);
    setShowModal(true);
  };

  const confirmDelete = (jobId) => {
    setJobToDelete(jobId);
    setShowConfirmDelete(true);
  };

  const handleDelete = async () => {
    if (!jobToDelete) return;
    try {
      await adminJobAPI.delete(jobToDelete);
      setJobs(jobs.filter(j => j._id !== jobToDelete));
      toast.success("Job deleted successfully");
    } catch {
      toast.error("Failed to delete job");
    } finally {
      setShowConfirmDelete(false);
      setJobToDelete(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Process array fields
      const processedData = {
        ...formData,
        responsibilities: formData.responsibilities.split('\n').filter(line => line.trim()),
        requirements: formData.requirements.split('\n').filter(line => line.trim()),
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
        benefits: formData.benefits.split('\n').filter(line => line.trim()),
        howto: formData.howto.split('\n').filter(line => line.trim())
      };

      if (modalMode === "add") {
        const { data } = await adminJobAPI.create(processedData);
        setJobs([data.job, ...jobs]);
        toast.success("Job posted successfully");
      } else if (modalMode === "edit") {
        const { data } = await adminJobAPI.update(selectedJob._id, processedData);
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
            <p className={`text-2xl font-bold ${stat.color === 'blue' ? 'text-blue-400' :
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
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${job.status === 'Active'
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
                  className={`flex-1 lg:flex-none px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${job.source === 'public' ? 'bg-gray-800 text-gray-400 cursor-not-allowed' : 'bg-gray-700 hover:bg-gray-600 text-white'}`}
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => job.source !== 'public' && confirmDelete(job._id)}
                  disabled={job.source === 'public'}
                  title={job.source === 'public' ? 'Public jobs are read-only' : ''}
                  className={`flex-1 lg:flex-none px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${job.source === 'public' ? 'bg-gray-800 text-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 text-white'}`}
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
              className="bg-gray-800 rounded-2xl border border-gray-700 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
            >
              <div className="bg-gray-800 border-b border-gray-700 p-6 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-600/20 rounded-lg">
                    <Briefcase className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white leading-none">
                      {modalMode === "add" ? "Post New Job" : modalMode === "edit" ? "Edit Job" : "Job Details"}
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">
                      {modalMode === "view" ? "Full details as shown on website" : "Complete all relevant fields for the listing"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-700 rounded-xl transition-colors group"
                >
                  <X className="w-6 h-6 text-gray-400 group-hover:text-white" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-8 scrollbar-thin scrollbar-thumb-gray-700">
                {modalMode === "view" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* View mode details */}
                    <div className="space-y-6">
                      <section>
                        <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-4">Basic Information</h3>
                        <div className="bg-gray-900/50 rounded-2xl p-5 border border-gray-700 space-y-4">
                          <DetailItem label="Job Title" value={selectedJob?.title} />
                          <DetailItem label="Company" value={selectedJob?.company} />
                          <DetailItem label="Category" value={selectedJob?.category} />
                          <div className="grid grid-cols-2 gap-4">
                            <DetailItem label="Location" value={selectedJob?.location} />
                            <DetailItem label="Mode" value={selectedJob?.mode} />
                          </div>
                        </div>
                      </section>

                      <section>
                        <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-4">Compensation & Role</h3>
                        <div className="bg-gray-900/50 rounded-2xl p-5 border border-gray-700 space-y-4">
                          <DetailItem label="Salary Range" value={selectedJob?.salary} />
                          <div className="grid grid-cols-2 gap-4">
                            <DetailItem label="Experience" value={selectedJob?.experienceLevel} />
                            <DetailItem label="Type" value={selectedJob?.type} />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <DetailItem label="Duration" value={selectedJob?.duration} />
                            <DetailItem label="Openings" value={selectedJob?.openings} />
                          </div>
                        </div>
                      </section>

                      <section>
                        <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-4">Skills & Requirements</h3>
                        <div className="bg-gray-900/50 rounded-2xl p-5 border border-gray-700">
                          <div className="flex flex-wrap gap-2">
                            {selectedJob?.skills && (Array.isArray(selectedJob.skills) ? selectedJob.skills : selectedJob.skills.split(',')).map((skill, i) => (
                              <span key={i} className="px-3 py-1 bg-blue-600/10 text-blue-300 border border-blue-500/20 rounded-full text-xs">
                                {skill.trim()}
                              </span>
                            ))}
                          </div>
                          <div className="mt-4 space-y-2">
                            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Key Requirements</p>
                            <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                              {(selectedJob?.requirements || []).map((req, i) => <li key={i}>{req}</li>)}
                            </ul>
                          </div>
                        </div>
                      </section>
                    </div>

                    <div className="space-y-6">
                      <section>
                        <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-4">About the Role</h3>
                        <div className="bg-gray-900/50 rounded-2xl p-5 border border-gray-700">
                          <p className="text-sm text-gray-300 leading-relaxed italic mb-4">"{selectedJob?.about}"</p>
                          <div className="space-y-2">
                            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Main Responsibilities</p>
                            <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                              {(selectedJob?.responsibilities || []).map((res, i) => <li key={i}>{res}</li>)}
                            </ul>
                          </div>
                        </div>
                      </section>

                      <section>
                        <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-4">Links & Media</h3>
                        <div className="bg-gray-900/50 rounded-2xl p-5 border border-gray-700 space-y-4">
                          <DetailItem label="Apply URL" value={selectedJob?.applyUrl} isLink />
                          <DetailItem label="Company Website" value={selectedJob?.companyWebsite} isLink />
                          <DetailItem label="Logo URL" value={selectedJob?.logo} isLink />
                        </div>
                      </section>

                      {selectedJob?.benefits?.length > 0 && (
                        <section>
                          <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-4">Perks & Benefits</h3>
                          <div className="grid grid-cols-2 gap-2">
                            {selectedJob.benefits.map((benefit, i) => (
                              <div key={i} className="flex items-center gap-2 p-2 bg-green-500/5 border border-green-500/10 rounded-lg">
                                <CheckCircle className="w-3 h-3 text-green-400" />
                                <span className="text-xs text-gray-300">{benefit}</span>
                              </div>
                            ))}
                          </div>
                        </section>
                      )}
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-8 pb-4">
                    {/* Basic Info */}
                    <FormSection title="Core Information">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput label="Job Title *" value={formData.title} onChange={(val) => setFormData({ ...formData, title: val })} required />
                        <FormInput label="Company Name *" value={formData.company} onChange={(val) => setFormData({ ...formData, company: val })} required />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput label="Category" value={formData.category} placeholder="e.g. Engineering, Design" onChange={(val) => setFormData({ ...formData, category: val })} />
                        <FormInput label="Logo URL" value={formData.logo} placeholder="Clearbit logo used if empty" onChange={(val) => setFormData({ ...formData, logo: val })} />
                      </div>
                    </FormSection>

                    {/* Logistics */}
                    <FormSection title="Logistics & Compensation">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormInput label="Location *" value={formData.location} onChange={(val) => setFormData({ ...formData, location: val })} required />
                        <FormSelect label="Work Mode" value={formData.mode} options={['Remote', 'On-site', 'Hybrid']} onChange={(val) => setFormData({ ...formData, mode: val })} />
                        <FormSelect label="Job Type" value={formData.type} options={['Full-time', 'Part-time', 'Contract', 'Internship']} onChange={(val) => setFormData({ ...formData, type: val })} />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormInput label="Salary Display *" value={formData.salary} placeholder="e.g. ₹8-12 LPA" onChange={(val) => setFormData({ ...formData, salary: val })} required />
                        <FormInput label="Duration" value={formData.duration} placeholder="e.g. 6 Months" onChange={(val) => setFormData({ ...formData, duration: val })} />
                        <FormInput label="Experience" value={formData.experienceLevel} placeholder="e.g. 2+ Years" onChange={(val) => setFormData({ ...formData, experienceLevel: val })} />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <FormInput label="Min Salary" type="number" value={formData.salaryMin} onChange={(val) => setFormData({ ...formData, salaryMin: val })} />
                        <FormInput label="Max Salary" type="number" value={formData.salaryMax} onChange={(val) => setFormData({ ...formData, salaryMax: val })} />
                        <FormInput label="Openings" type="number" value={formData.openings} onChange={(val) => setFormData({ ...formData, openings: val })} />
                        <FormSelect label="Status" value={formData.status} options={['Active', 'Pending', 'Closed']} onChange={(val) => setFormData({ ...formData, status: val })} />
                      </div>
                    </FormSection>

                    {/* Content */}
                    <FormSection title="Detailed Content">
                      <FormTextarea label="Short Tagline/About *" value={formData.about} placeholder="Briefly describe the significance of this role..." onChange={(val) => setFormData({ ...formData, about: val })} required height="h-20" />
                      <FormTextarea label="Full Description" value={formData.description} placeholder="Detailed role description..." onChange={(val) => setFormData({ ...formData, description: val })} height="h-32" />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormTextarea label="Responsibilities (one per line) *" value={formData.responsibilities} placeholder="Leading the frontend team..." onChange={(val) => setFormData({ ...formData, responsibilities: val })} required height="h-32" />
                        <FormTextarea label="Requirements (one per line) *" value={formData.requirements} placeholder="Expertise in React & Node.js..." onChange={(val) => setFormData({ ...formData, requirements: val })} required height="h-32" />
                      </div>
                      <FormInput label="Required Skills (comma separated) *" value={formData.skills} placeholder="React, Node.js, AWS..." onChange={(val) => setFormData({ ...formData, skills: val })} required />
                    </FormSection>

                    {/* External */}
                    <FormSection title="Links & Extras">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput label="Apply URL *" value={formData.applyUrl} onChange={(val) => setFormData({ ...formData, applyUrl: val })} required />
                        <FormInput label="Company Website" value={formData.companyWebsite} onChange={(val) => setFormData({ ...formData, companyWebsite: val })} />
                      </div>
                      <FormTextarea label="Benefits (one per line)" value={formData.benefits} placeholder="Health Insurance..." onChange={(val) => setFormData({ ...formData, benefits: val })} height="h-24" />
                      <FormTextarea label="How to Apply Steps (one per line)" value={formData.howto} placeholder="Submit resume -> Technical round..." onChange={(val) => setFormData({ ...formData, howto: val })} height="h-24" />
                    </FormSection>

                    <div className="flex gap-4 pt-6 border-t border-gray-700">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="flex-1 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20"
                      >
                        <Save className="w-5 h-5" />
                        {modalMode === "add" ? "Post Job Listing" : "Update Listing"}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={() => setShowModal(false)}
                        className="px-8 py-4 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-bold transition-colors"
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

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        onConfirm={handleDelete}
        title="Delete Job"
        message="Are you sure you want to delete this job posting? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

// End of AdminJobs component

export default AdminJobs;
