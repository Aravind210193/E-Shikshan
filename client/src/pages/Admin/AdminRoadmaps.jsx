import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Edit, Trash2, Eye, Map, Star, Users, BookOpen, Clock, CheckCircle, X, Save, Layers, Sparkles, TrendingUp, ChevronRight, FileText, Image as ImageIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import { adminRoadmapAPI } from "../../services/adminApi";
import ConfirmationModal from "../../components/Admin/ConfirmationModal";

const AdminRoadmaps = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);

  const emptyForm = {
    id: "",
    title: "",
    category: "",
    tagline: "",
    image: "",
    duration: "",
    difficulty: "Beginner",
    popularity: "Popular",
    description: "",
    status: "active",
    path: []
  };

  const [formData, setFormData] = useState(emptyForm);

  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);

  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [roadmapToDelete, setRoadmapToDelete] = useState(null);

  const fetchRoadmaps = async () => {
    try {
      setLoading(true);
      const params = {
        search: searchQuery || undefined,
        category: filterCategory !== 'all' ? filterCategory : undefined,
        page: 1,
        limit: 100,
      };
      const response = await adminRoadmapAPI.getAll(params);
      const data = response.data;
      setRoadmaps(data?.data || []);

      // Extract unique categories for filter
      if (data?.data) {
        const uniqueCats = [...new Set(data.data.map(r => r.category))];
        setCategories(uniqueCats);
      }
    } catch (e) {
      console.error(e);
      setError(e?.response?.data?.message || 'Failed to load roadmaps');
      toast.error('Failed to load roadmaps');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmaps();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // CRUD Operations
  const handleAdd = () => {
    setModalMode("add");
    setFormData(emptyForm);
    setShowModal(true);
  };

  const handleEdit = (roadmap) => {
    setModalMode("edit");
    setSelectedRoadmap(roadmap);
    setFormData({
      id: roadmap.id,
      title: roadmap.title,
      category: roadmap.category,
      tagline: roadmap.tagline || "",
      image: roadmap.image || "",
      duration: roadmap.duration || "",
      difficulty: roadmap.difficulty || "Beginner",
      popularity: roadmap.popularity || "Popular",
      description: roadmap.description || "",
      status: roadmap.status || "active",
      path: roadmap.path || []
    });
    setShowModal(true);
  };

  const handleView = (roadmap) => {
    setModalMode("view");
    setSelectedRoadmap(roadmap);
    setShowModal(true);
  };

  const confirmDelete = (roadmapId) => {
    setRoadmapToDelete(roadmapId);
    setShowConfirmDelete(true);
  };

  const handleDelete = async () => {
    if (!roadmapToDelete) return;
    try {
      await adminRoadmapAPI.delete(roadmapToDelete);
      setRoadmaps(roadmaps.filter(r => r._id !== roadmapToDelete));
      toast.success("Roadmap deleted successfully");
    } catch {
      toast.error("Failed to delete roadmap");
    } finally {
      setShowConfirmDelete(false);
      setRoadmapToDelete(null);
    }
  };

  const handleAddStep = () => {
    setFormData({
      ...formData,
      path: [
        ...formData.path,
        {
          title: "",
          description: "",
          topics: [],
          resources: [],
          project: "",
          projectId: ""
        }
      ]
    });
  };

  const handleRemoveStep = (index) => {
    const newPath = [...formData.path];
    newPath.splice(index, 1);
    setFormData({ ...formData, path: newPath });
  };

  const handleStepChange = (index, field, value) => {
    const newPath = [...formData.path];
    if (field === 'topics' || field === 'resources') {
      // Allow the user to type freely, we'll convert to array when they stop typing or on submit
      // But for better UX during typing, we store it as a string locally if it's currently focused?
      // No, let's just use string to array conversion.
      newPath[index][field] = value.split(',').map(item => item.trim());
    } else {
      newPath[index][field] = value;
    }
    setFormData({ ...formData, path: newPath });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Clean up path steps (filter out empty topics/resources)
      const cleanedPath = formData.path.map(step => ({
        ...step,
        topics: step.topics.filter(t => t !== ""),
        resources: step.resources.filter(r => r !== "")
      }));

      const payload = { ...formData, path: cleanedPath };

      if (modalMode === "add") {
        await adminRoadmapAPI.create(payload);
        toast.success("Roadmap created successfully");
      } else if (modalMode === "edit") {
        await adminRoadmapAPI.update(selectedRoadmap._id, payload);
        toast.success("Roadmap updated successfully");
      }
      fetchRoadmaps();
      setShowModal(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Operation failed');
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Map className="text-purple-500" />
            Roadmap Management
          </h1>
          <p className="text-gray-400">Manage curated learning paths for the Ornate Platform</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAdd}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-purple-500/20 transition-all"
        >
          <Plus className="w-5 h-5" />
          Create Roadmap
        </motion.button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total", value: roadmaps.length, color: "blue", icon: Layers },
          { label: "Active", value: roadmaps.filter(r => r.status === "active").length, color: "green", icon: CheckCircle },
          { label: "Drafts", value: roadmaps.filter(r => r.status === "draft").length, color: "yellow", icon: FileText },
          { label: "Popular", value: roadmaps.filter(r => (r.enrolled || 0) > 1000).length, color: "purple", icon: TrendingUp }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800 border border-gray-700 rounded-2xl p-4 flex items-center gap-4"
          >
            <div className={`p-3 rounded-xl bg-${stat.color}-500/10 text-${stat.color}-400`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-bold text-white tracking-tight">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search roadmaps by title, category, or ID..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <button
              onClick={fetchRoadmaps}
              className="px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-colors font-medium"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Roadmaps Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400 font-medium">Fetching Roadmaps...</p>
        </div>
      ) : roadmaps.length === 0 ? (
        <div className="bg-gray-800 border-2 border-dashed border-gray-700 rounded-3xl p-20 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-700/50 rounded-full mb-6">
            <Map size={40} className="text-gray-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">No Roadmaps Found</h2>
          <p className="text-gray-400 max-w-sm mx-auto mb-8">Start by creating your first educational roadmap or adjust your filters.</p>
          <button onClick={handleAdd} className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition-all transform hover:scale-105">
            Get Started
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roadmaps
            .filter(r => {
              const query = searchQuery.toLowerCase();
              return r.title.toLowerCase().includes(query) ||
                r.category.toLowerCase().includes(query) ||
                r.id.toLowerCase().includes(query);
            })
            .filter(r => filterCategory === 'all' || r.category === filterCategory)
            .map((roadmap, idx) => (
              <motion.div
                key={roadmap._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden group hover:border-purple-500/40 transition-all duration-300 flex flex-col shadow-lg hover:shadow-purple-500/5"
              >
                <div className="relative h-40 bg-gray-900 group-hover:bg-gray-900/80 transition-background overflow-hidden">
                  {roadmap.image ? (
                    <img src={roadmap.image} alt={roadmap.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500 scale-100 group-hover:scale-110" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-700">
                      <ImageIcon size={48} strokeWidth={1} />
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="px-2 py-1 bg-purple-600 text-white text-[10px] font-bold rounded uppercase tracking-widest shadow-lg">
                      {roadmap.category}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${roadmap.status === 'active' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'}`}>
                      {roadmap.status}
                    </div>
                  </div>
                </div>

                <div className="p-5 flex-1 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors line-clamp-1">{roadmap.title}</h3>
                    <p className="text-gray-500 text-[10px] font-mono mt-1 tracking-tighter uppercase">{roadmap.id}</p>
                  </div>

                  <p className="text-gray-400 text-sm line-clamp-2 min-h-[40px] italic">
                    "{roadmap.tagline || 'No tagline set for this roadmap.'}"
                  </p>

                  <div className="pt-4 border-t border-gray-700 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock size={14} className="text-purple-500" />
                        <span>{roadmap.duration || 'Flexible'}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Layers size={14} className="text-blue-500" />
                        <span>{roadmap.path?.length || 0} Steps</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-yellow-500">
                      <Star size={14} fill="currentColor" />
                      <span>{(roadmap.rating || 4.5).toFixed(1)}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-900/30 border-t border-gray-700 flex items-center gap-2">
                  <button
                    onClick={() => handleView(roadmap)}
                    className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <Eye size={16} />
                    Review
                  </button>
                  <button
                    onClick={() => handleEdit(roadmap)}
                    className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-bold transition-all shadow-lg shadow-purple-600/10 flex items-center justify-center gap-2"
                  >
                    <Edit size={16} />
                    Configure
                  </button>
                  <button
                    onClick={() => confirmDelete(roadmap._id)}
                    className="p-2 bg-rose-600/10 hover:bg-rose-600 text-rose-500 hover:text-white rounded-lg transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
        </div>
      )}

      {/* Detail/Editor Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-gray-800 border border-gray-700 rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl shadow-purple-500/10"
            >
              <div className="p-6 border-b border-gray-700 flex items-center justify-between bg-gray-900/50 backdrop-blur-xl">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-600 rounded-2xl shadow-lg shadow-purple-600/20">
                    {modalMode === 'add' ? <Plus size={24} className="text-white" /> : modalMode === 'edit' ? <Edit size={24} className="text-white" /> : <Eye size={24} className="text-white" />}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">
                      {modalMode === 'add' ? 'Create New Journey' : modalMode === 'edit' ? 'Modify Configuration' : 'Roadmap Overview'}
                    </h2>
                    <p className="text-gray-500 text-sm">{modalMode === 'view' ? 'Reviewing architectural details' : 'Drafting learning architecture'}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-3 bg-gray-800 hover:bg-rose-500 text-gray-400 hover:text-white rounded-2xl transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                {modalMode === 'view' ? (
                  <div className="space-y-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                      <div className="lg:col-span-4 space-y-6">
                        <div className="aspect-square bg-gray-900 rounded-3xl border border-gray-700 overflow-hidden shadow-inner">
                          {selectedRoadmap?.image ? (
                            <img src={selectedRoadmap.image} alt={selectedRoadmap.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-800 uppercase font-black tracking-tighter text-6xl select-none">
                              {selectedRoadmap?.title?.substring(0, 2)}
                            </div>
                          )}
                        </div>
                        <div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-4 space-y-4">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500 font-medium">Difficulty</span>
                            <span className="text-white font-bold">{selectedRoadmap?.difficulty}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500 font-medium">Duration</span>
                            <span className="text-white font-bold">{selectedRoadmap?.duration}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500 font-medium">Popularity</span>
                            <span className="text-white font-bold">{selectedRoadmap?.popularity}</span>
                          </div>
                        </div>
                      </div>

                      <div className="lg:col-span-8 space-y-8">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="px-3 py-1 bg-purple-600/20 text-purple-400 text-[10px] font-bold rounded-lg border border-purple-500/20 uppercase tracking-widest">
                              {selectedRoadmap?.category}
                            </span>
                          </div>
                          <h1 className="text-4xl font-extrabold text-white tracking-tight leading-none mb-4">{selectedRoadmap?.title}</h1>
                          <p className="text-xl text-purple-300 italic font-medium">"{selectedRoadmap?.tagline}"</p>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-600 uppercase tracking-widest">Objective</label>
                          <p className="text-gray-300 leading-relaxed text-lg">{selectedRoadmap?.description || 'Build core professional skills through this structured curriculum.'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-10 border-t border-gray-700">
                      <div className="flex items-center justify-between mb-8">
                        <div>
                          <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                            <Layers className="text-purple-500" />
                            Curriculum Steps
                          </h3>
                          <p className="text-gray-500 text-sm mt-1">Structured learning segments for the journey</p>
                        </div>
                      </div>

                      <div className="space-y-12 relative before:absolute before:left-6 before:top-4 before:bottom-4 before:w-[2px] before:bg-gradient-to-b before:from-purple-500 before:via-blue-500 before:to-transparent">
                        {(selectedRoadmap?.path || []).map((step, idx) => (
                          <div key={idx} className="relative pl-16 group">
                            <div className="absolute left-0 top-0 w-12 h-12 bg-gray-900 border border-purple-500/50 rounded-2xl flex items-center justify-center text-xl font-black text-white shadow-[0_0_15px_rgba(168,85,247,0.15)] group-hover:scale-110 group-hover:bg-purple-600 transition-all duration-300 z-10">
                              {idx + 1}
                            </div>
                            <div className="bg-gray-900/50 border border-gray-700/50 rounded-3xl p-6 hover:border-purple-500/30 transition-all duration-300">
                              <h4 className="text-xl font-bold text-white mb-2">{step.title}</h4>
                              <p className="text-gray-400 mb-6">{step.description}</p>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                  <label className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Core Topics</label>
                                  <div className="flex flex-wrap gap-2">
                                    {step.topics?.map((topic, i) => (
                                      <span key={i} className="px-3 py-1 bg-gray-800 text-gray-300 text-xs rounded-lg border border-gray-700">
                                        {topic}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                {step.project && (
                                  <div className="space-y-3">
                                    <label className="text-[10px] font-bold text-blue-900 uppercase tracking-widest">Milestone Project</label>
                                    <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
                                      <div className="flex items-center gap-2 text-blue-400 mb-2">
                                        <Sparkles size={14} />
                                        <span className="text-xs font-bold uppercase tracking-tight">Requirement</span>
                                      </div>
                                      <p className="text-gray-300 text-sm leading-relaxed font-medium">{step.project}</p>
                                      {step.projectId && <span className="block mt-2 text-[10px] bg-blue-500/20 text-blue-300 px-2 py-1 rounded inline-block font-mono">ID: {step.projectId}</span>}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-12">
                    {/* Basic Info Section */}
                    <section className="space-y-6">
                      <div className="flex items-center gap-3 pb-2 border-b border-gray-700/50">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                          <FileText size={18} />
                        </div>
                        <h3 className="text-lg font-bold text-white uppercase tracking-wider text-sm">Core Configuration</h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 space-y-6">
                          <div>
                            <label className="text-xs font-bold text-gray-500 mb-2 block uppercase tracking-loose">Roadmap Nomenclature *</label>
                            <input
                              type="text"
                              required
                              value={formData.title}
                              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                              className="w-full px-5 py-4 bg-gray-900 border border-gray-700 rounded-2xl text-white font-bold text-xl outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-gray-700 shadow-inner"
                              placeholder="e.g., Fullstack Systems Engineer"
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="text-xs font-bold text-gray-500 mb-2 block uppercase tracking-loose">Identifier Slug *</label>
                              <input
                                type="text"
                                required
                                value={formData.id}
                                onChange={(e) => setFormData({ ...formData, id: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                                className="w-full px-5 py-4 bg-gray-900 border border-gray-700 rounded-2xl text-purple-400 font-mono text-sm outline-none focus:ring-2 focus:ring-purple-500 transition-all shadow-inner"
                                placeholder="fullstack-engineer"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-bold text-gray-500 mb-2 block uppercase tracking-loose">Discipline Category *</label>
                              <input
                                type="text"
                                required
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-5 py-4 bg-gray-900 border border-gray-700 rounded-2xl text-white font-bold outline-none focus:ring-2 focus:ring-purple-500 transition-all shadow-inner"
                                placeholder="Software Engineering"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-6">
                          <div>
                            <label className="text-xs font-bold text-gray-500 mb-2 block uppercase tracking-loose">Hero Visualization (URL)</label>
                            <div className="relative">
                              <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                              <input
                                type="text"
                                value={formData.image}
                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                className="w-full pl-12 pr-5 py-4 bg-gray-900 border border-gray-700 rounded-2xl text-white text-sm outline-none focus:ring-2 focus:ring-purple-500 transition-all shadow-inner"
                                placeholder="/path/to/image.png"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-xs font-bold text-gray-500 mb-2 block uppercase tracking-loose">Status</label>
                              <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full px-4 py-4 bg-gray-900 border border-gray-700 rounded-2xl text-white text-sm font-bold outline-none focus:ring-2 focus:ring-purple-500 transition-all cursor-pointer"
                              >
                                <option value="active">Active</option>
                                <option value="draft">Draft</option>
                                <option value="archived">Archived</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-xs font-bold text-gray-500 mb-2 block uppercase tracking-loose">Difficulty</label>
                              <select
                                value={formData.difficulty}
                                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                                className="w-full px-4 py-4 bg-gray-900 border border-gray-700 rounded-2xl text-white text-sm font-bold outline-none focus:ring-2 focus:ring-purple-500 transition-all cursor-pointer"
                              >
                                <option value="Beginner">Beginner</option>
                                <option value="Beginner-Friendly">Beginner-Friendly</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="text-xs font-bold text-gray-500 mb-2 block uppercase tracking-loose">Marketing Tagline</label>
                          <input
                            type="text"
                            value={formData.tagline}
                            onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                            className="w-full px-5 py-4 bg-gray-900 border border-gray-700 rounded-2xl text-gray-300 italic outline-none focus:ring-2 focus:ring-purple-500 transition-all shadow-inner"
                            placeholder="Unlock the secrets of backend wizardry..."
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-bold text-gray-500 mb-2 block uppercase tracking-loose">Duration Est.</label>
                            <div className="relative">
                              <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
                              <input
                                type="text"
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                className="w-full pl-12 pr-5 py-4 bg-gray-900 border border-gray-700 rounded-2xl text-white text-sm outline-none focus:ring-2 focus:ring-purple-500 transition-all shadow-inner"
                                placeholder="12-16 weeks"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-xs font-bold text-gray-500 mb-2 block uppercase tracking-loose">Social Popularity</label>
                            <div className="relative">
                              <TrendingUp className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
                              <input
                                type="text"
                                value={formData.popularity}
                                onChange={(e) => setFormData({ ...formData, popularity: e.target.value })}
                                className="w-full pl-12 pr-5 py-4 bg-gray-900 border border-gray-700 rounded-2xl text-white text-sm outline-none focus:ring-2 focus:ring-purple-500 transition-all shadow-inner"
                                placeholder="Extreme Popular"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-gray-500 mb-2 block uppercase tracking-loose">Curriculum Description</label>
                        <textarea
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          className="w-full px-5 py-4 bg-gray-900 border border-gray-700 rounded-2xl text-gray-300 min-h-[120px] outline-none focus:ring-2 focus:ring-purple-500 transition-all shadow-inner leading-relaxed"
                          placeholder="Provide a detailed overview of what students will achieve upon completion..."
                        />
                      </div>
                    </section>

                    {/* Path Section */}
                    <section className="space-y-8 pt-6">
                      <div className="flex items-center justify-between pb-2 border-b border-gray-700/50">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
                            <Layers size={18} />
                          </div>
                          <h3 className="text-lg font-bold text-white uppercase tracking-wider text-sm">Learning Path Architecture</h3>
                        </div>
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleAddStep}
                          className="px-4 py-2 bg-gray-900 hover:bg-purple-600 text-gray-400 hover:text-white rounded-xl text-xs font-bold uppercase transition-all flex items-center gap-2 border border-gray-700"
                        >
                          <Plus size={14} />
                          Append Module
                        </motion.button>
                      </div>

                      <div className="grid grid-cols-1 gap-8">
                        {formData.path.map((step, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="relative bg-gray-900/40 border border-gray-700/50 rounded-3xl p-8 group/step"
                          >
                            <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-gray-800 border-2 border-purple-500 rounded-full flex items-center justify-center text-xs font-black text-white z-10 shadow-lg">
                              {idx + 1}
                            </div>

                            <button
                              type="button"
                              onClick={() => handleRemoveStep(idx)}
                              className="absolute -top-3 -right-3 p-2 bg-gray-800 hover:bg-rose-600 text-gray-500 hover:text-white rounded-xl opacity-0 group-hover/step:opacity-100 transition-all shadow-xl border border-gray-700"
                            >
                              <X size={16} />
                            </button>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                              <div className="space-y-6">
                                <div>
                                  <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-2 block">Module Title</label>
                                  <input
                                    type="text"
                                    value={step.title}
                                    onChange={(e) => handleStepChange(idx, 'title', e.target.value)}
                                    className="w-full bg-transparent border-b-2 border-gray-800 py-2 text-white font-black text-xl outline-none focus:border-purple-600 transition-all"
                                    placeholder="Enter module name"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-2 block">Instructional Overview</label>
                                  <textarea
                                    value={step.description}
                                    onChange={(e) => handleStepChange(idx, 'description', e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-900/80 border border-gray-800 rounded-2xl text-gray-400 text-sm outline-none focus:border-purple-500 transition-all min-h-[80px]"
                                    placeholder="Define the scope of this module..."
                                  />
                                </div>
                              </div>

                              <div className="space-y-6">
                                <div>
                                  <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-2 block">Curriculum Tags (Delimited by Comma)</label>
                                  <input
                                    type="text"
                                    value={step.topics.join(', ')}
                                    onChange={(e) => handleStepChange(idx, 'topics', e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-900/80 border border-gray-800 rounded-2xl text-gray-300 text-sm font-mono outline-none focus:border-purple-500 transition-all"
                                    placeholder="React, Hooks, State, Effects..."
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] font-black text-blue-900 uppercase tracking-widest mb-2 block">Applied Milestone Project</label>
                                  <div className="relative">
                                    <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-900" size={16} />
                                    <input
                                      type="text"
                                      value={step.project}
                                      onChange={(e) => handleStepChange(idx, 'project', e.target.value)}
                                      className="w-full pl-12 pr-4 py-3 bg-blue-500/5 border border-blue-500/10 rounded-2xl text-blue-300 text-sm font-bold outline-none focus:border-blue-500/30 transition-all shadow-inner"
                                      placeholder="Final Deliverable..."
                                    />
                                  </div>
                                </div>
                                <div>
                                  <label className="text-[10px] font-black text-blue-900 uppercase tracking-widest mb-2 block">Project ID (Unique Slug)</label>
                                  <input
                                    type="text"
                                    value={step.projectId || ''}
                                    onChange={(e) => handleStepChange(idx, 'projectId', e.target.value)}
                                    className="w-full px-4 py-3 bg-blue-500/5 border border-blue-500/10 rounded-2xl text-blue-300 text-sm font-mono outline-none focus:border-blue-500/30 transition-all shadow-inner"
                                    placeholder="e.g. basic-calculator-v1"
                                  />
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}

                        {formData.path.length === 0 && (
                          <div className="py-16 bg-gray-900/20 border-2 border-dashed border-gray-800 rounded-3xl flex flex-col items-center justify-center text-center">
                            <Layers size={48} className="text-gray-800 mb-4" />
                            <p className="text-gray-600 font-medium italic">Empty Journey Architecture.<br />Append modules to define the learning trajectory.</p>
                          </div>
                        )}
                      </div>
                    </section>

                    {/* Bottom Action Bar (Fixed substitute) */}
                    <div className="pt-10 border-t border-gray-700 flex flex-col md:flex-row gap-4">
                      <motion.button
                        whileHover={{ scale: 1.02, backgroundColor: '#7c3aed' }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="flex-[2] py-5 bg-purple-600 text-white rounded-3xl font-black text-xl tracking-tight uppercase flex items-center justify-center gap-3 shadow-2xl shadow-purple-600/20 transition-all"
                      >
                        <Save size={24} />
                        {modalMode === 'add' ? 'Commit Journey' : 'Overwrite Config'}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={() => setShowModal(false)}
                        className="flex-1 py-5 bg-gray-900 hover:bg-gray-800 text-gray-500 hover:text-white rounded-3xl font-black text-xl tracking-tight uppercase flex items-center justify-center transition-all border border-gray-700"
                      >
                        Abort
                      </motion.button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmationModal
        isOpen={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        onConfirm={handleDelete}
        title="Permanently Delete Roadmap?"
        message="This will immediately terminate all access to this learning path and purge its structural metadata from the database. This action is final and irreversible."
        confirmText="Final Delete"
        cancelText="Preserve Config"
        type="danger"
      />
    </div>
  );
};

export default AdminRoadmaps;
