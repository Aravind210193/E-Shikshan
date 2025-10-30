import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Edit, Trash2, Eye, X, ToggleLeft, ToggleRight, Book, School, GraduationCap, HeartPulse } from "lucide-react";
import { toast } from "react-hot-toast";
import { adminEducationLevelAPI, adminBranchAPI } from "../../services/adminApi";

const emptyForm = {
  level: "",
  description: "",
  branches: [],
  isActive: true,
};

const AdminEducationLevels = () => {
  const [levels, setLevels] = useState([]);
  const [allBranches, setAllBranches] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selected, setSelected] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const getLevelIcon = (level) => {
    switch(level) {
      case '10th': return <Book className="h-5 w-5" />;
      case 'Intermediate': return <School className="h-5 w-5" />;
      case 'UG': return <GraduationCap className="h-5 w-5" />;
      case 'Medical': return <HeartPulse className="h-5 w-5" />;
      case 'PG': return <GraduationCap className="h-5 w-5" />;
      default: return <Book className="h-5 w-5" />;
    }
  };

  const loadLevels = async (p = 1) => {
    try {
      setLoading(true);
      const params = { page: p, limit: 12 };
      if (searchQuery) params.search = searchQuery;
      if (statusFilter === "active") params.isActive = true;
      if (statusFilter === "inactive") params.isActive = false;
      
      const res = await adminEducationLevelAPI.getAll(params);
      if (res.data.success) {
        setLevels(res.data.data);
        setPage(res.data.page);
        setPages(res.data.pages);
      }
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to fetch education levels");
    } finally {
      setLoading(false);
    }
  };

  const loadBranches = async () => {
    try {
      const res = await adminBranchAPI.getAll({ limit: 100 });
      if (res.data.success) {
        setAllBranches(res.data.data);
      }
    } catch (e) {
      console.error("Failed to load branches", e);
    }
  };

  useEffect(() => {
    loadLevels(1);
    loadBranches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openAdd = () => {
    setModalMode("add");
    setFormData(emptyForm);
    setShowModal(true);
  };

  const openEdit = (level) => {
    setModalMode("edit");
    setSelected(level);
    setFormData({
      level: level.level,
      description: level.description || "",
      branches: level.branches.map(b => b._id || b),
      isActive: level.isActive,
    });
    setShowModal(true);
  };

  const openView = (level) => {
    setModalMode("view");
    setSelected(level);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this education level? This cannot be undone.")) return;
    try {
      await adminEducationLevelAPI.delete(id);
      toast.success("Education level deleted");
      loadLevels(page);
    } catch (e) {
      toast.error(e.response?.data?.message || "Delete failed");
    }
  };

  const handleToggleStatus = async (level) => {
    try {
      await adminEducationLevelAPI.update(level._id, { isActive: !level.isActive });
      toast.success(`Level ${level.isActive ? 'deactivated' : 'activated'}`);
      loadLevels(page);
    } catch (e) {
      toast.error(e.response?.data?.message || "Status update failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === "add") {
        await adminEducationLevelAPI.create(formData);
        toast.success("Education level created");
      } else if (modalMode === "edit" && selected) {
        await adminEducationLevelAPI.update(selected._id, formData);
        toast.success("Education level updated");
      }
      setShowModal(false);
      loadLevels(page);
    } catch (e) {
      toast.error(e.response?.data?.message || "Save failed");
    }
  };

  const toggleBranch = (branchId) => {
    setFormData(prev => ({
      ...prev,
      branches: prev.branches.includes(branchId)
        ? prev.branches.filter(id => id !== branchId)
        : [...prev.branches, branchId]
    }));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Education Levels</h1>
          <p className="text-gray-400">Manage education levels (10th, Intermediate, UG, Medical, PG)</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }} 
          whileTap={{ scale: 0.95 }} 
          onClick={openAdd} 
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold flex items-center gap-2 shadow-lg"
        >
          <Plus className="w-5 h-5"/> Add Level
        </motion.button>
      </div>

      <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search education levels" 
              value={searchQuery} 
              onChange={(e)=>setSearchQuery(e.target.value)} 
              onKeyDown={(e)=> e.key==='Enter' && loadLevels(1)} 
              className="w-full pl-12 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 outline-none" 
            />
          </div>
          <select 
            value={statusFilter} 
            onChange={(e)=>{setStatusFilter(e.target.value); loadLevels(1);}} 
            className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button 
            onClick={()=>loadLevels(1)} 
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white font-semibold"
          >
            Search
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      ) : levels.length === 0 ? (
        <div className="text-center py-12 text-gray-400">No education levels found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {levels.map((level) => (
            <motion.div 
              key={level._id} 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden hover:border-indigo-500/50 transition-colors"
            >
              <div className="p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                      {getLevelIcon(level.level)}
                    </div>
                    <h3 className="text-white font-semibold text-lg">{level.level}</h3>
                  </div>
                  <button 
                    onClick={() => handleToggleStatus(level)}
                    className="ml-2"
                  >
                    {level.isActive ? (
                      <ToggleRight className="w-6 h-6 text-green-400" />
                    ) : (
                      <ToggleLeft className="w-6 h-6 text-gray-500" />
                    )}
                  </button>
                </div>
                
                {level.description && (
                  <p className="text-sm text-gray-400 line-clamp-2">{level.description}</p>
                )}
                
                <div className="text-sm text-gray-400">
                  <span className="font-semibold">{level.branches?.length || 0}</span> branches
                </div>
                
                <div className="pt-3 border-t border-gray-700 flex items-center justify-between">
                  <span className={`text-xs px-2 py-1 rounded-full ${level.isActive ? 'bg-green-500/20 text-green-400' : 'bg-gray-600/50 text-gray-400'}`}>
                    {level.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => openView(level)} 
                      className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4 text-blue-400"/>
                    </button>
                    <button 
                      onClick={() => openEdit(level)} 
                      className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4 text-green-400"/>
                    </button>
                    <button 
                      onClick={() => handleDelete(level._id)} 
                      className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-400"/>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {pages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button 
            disabled={page<=1} 
            onClick={()=>loadLevels(page-1)} 
            className="px-4 py-2 bg-gray-800 disabled:opacity-50 hover:bg-gray-700 text-white rounded-lg border border-gray-700"
          >
            Prev
          </button>
          <span className="text-gray-400">Page {page} / {pages}</span>
          <button 
            disabled={page>=pages} 
            onClick={()=>loadLevels(page+1)} 
            className="px-4 py-2 bg-gray-800 disabled:opacity-50 hover:bg-gray-700 text-white rounded-lg border border-gray-700"
          >
            Next
          </button>
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }} 
              className="bg-gray-800 rounded-2xl border border-gray-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-5 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">
                  {modalMode === 'add' ? 'Add Education Level' : modalMode === 'edit' ? 'Edit Education Level' : 'Education Level Details'}
                </h2>
                <button 
                  onClick={()=>setShowModal(false)} 
                  className="p-2 hover:bg-gray-700 rounded-lg"
                >
                  <X className="w-5 h-5 text-gray-400"/>
                </button>
              </div>

              <div className="p-6">
                {modalMode === 'view' ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-400">Level</label>
                      <div className="flex items-center gap-3 mt-1">
                        <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                          {getLevelIcon(selected?.level)}
                        </div>
                        <p className="text-white text-lg font-semibold">{selected?.level}</p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Description</label>
                      <p className="text-white">{selected?.description || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Branches ({selected?.branches?.length || 0})</label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {selected?.branches?.map((branch) => (
                          <span key={branch._id || branch} className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-lg text-sm">
                            {branch.title || branch}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Status</label>
                      <p className={`text-lg font-semibold ${selected?.isActive ? 'text-green-400' : 'text-gray-400'}`}>
                        {selected?.isActive ? 'Active' : 'Inactive'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Level <span className="text-red-400">*</span>
                      </label>
                      <select
                        required 
                        value={formData.level} 
                        onChange={(e)=>setFormData({...formData, level: e.target.value})} 
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                      >
                        <option value="">Select Level</option>
                        <option value="10th">10th</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="UG">UG (Under Graduate)</option>
                        <option value="Medical">Medical</option>
                        <option value="PG">PG (Post Graduate)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                      <textarea 
                        value={formData.description} 
                        onChange={(e)=>setFormData({...formData, description: e.target.value})} 
                        rows="3"
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 outline-none" 
                        placeholder="Brief description of this education level"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Branches</label>
                      <div className="max-h-60 overflow-y-auto bg-gray-700 rounded-xl border border-gray-600 p-3 space-y-2">
                        {allBranches.map((branch) => (
                          <label key={branch._id} className="flex items-center gap-3 p-2 hover:bg-gray-600 rounded-lg cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={formData.branches.includes(branch._id)} 
                              onChange={()=>toggleBranch(branch._id)}
                              className="w-5 h-5 text-indigo-600 bg-gray-800 border-gray-600 rounded focus:ring-indigo-500"
                            />
                            <span className="text-white">{branch.title}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        id="isActive"
                        checked={formData.isActive} 
                        onChange={(e)=>setFormData({...formData, isActive: e.target.checked})} 
                        className="w-5 h-5 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                      />
                      <label htmlFor="isActive" className="text-gray-300">Active</label>
                    </div>
                    
                    <div className="flex gap-3 pt-4">
                      <button 
                        type="button" 
                        onClick={()=>setShowModal(false)} 
                        className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-semibold"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold"
                      >
                        {modalMode === 'add' ? 'Create' : 'Update'}
                      </button>
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

export default AdminEducationLevels;
