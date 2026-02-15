import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Edit, Trash2, Eye, X, Link2, ToggleLeft, ToggleRight } from "lucide-react";
import { toast } from "react-hot-toast";
import { adminBranchAPI } from "../../services/adminApi";

const emptyForm = {
  title: "",
  link: "",
  description: "",
  isActive: true,
};

const AdminBranches = () => {
  const [branches, setBranches] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selected, setSelected] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const loadBranches = async (p = 1) => {
    try {
      setLoading(true);
      const params = { page: p, limit: 12 };
      if (searchQuery) params.search = searchQuery;
      if (statusFilter === "active") params.isActive = true;
      if (statusFilter === "inactive") params.isActive = false;
      
      const res = await adminBranchAPI.getAll(params);
      if (res.data.success) {
        setBranches(res.data.data);
        setPage(res.data.page);
        setPages(res.data.pages);
      }
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to fetch branches");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBranches(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openAdd = () => {
    setModalMode("add");
    setFormData(emptyForm);
    setShowModal(true);
  };

  const openEdit = (branch) => {
    setModalMode("edit");
    setSelected(branch);
    setFormData({
      title: branch.title,
      link: branch.link || "",
      description: branch.description || "",
      isActive: branch.isActive,
    });
    setShowModal(true);
  };

  const openView = (branch) => {
    setModalMode("view");
    setSelected(branch);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this branch? This cannot be undone.")) return;
    try {
      await adminBranchAPI.delete(id);
      toast.success("Branch deleted");
      loadBranches(page);
    } catch (e) {
      toast.error(e.response?.data?.message || "Delete failed");
    }
  };

  const handleToggleStatus = async (branch) => {
    try {
      await adminBranchAPI.toggleStatus(branch._id);
      toast.success(`Branch ${branch.isActive ? 'deactivated' : 'activated'}`);
      loadBranches(page);
    } catch (e) {
      toast.error(e.response?.data?.message || "Status update failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === "add") {
        await adminBranchAPI.create(formData);
        toast.success("Branch created");
      } else if (modalMode === "edit" && selected) {
        await adminBranchAPI.update(selected._id, formData);
        toast.success("Branch updated");
      }
      setShowModal(false);
      loadBranches(page);
    } catch (e) {
      toast.error(e.response?.data?.message || "Save failed");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Branches</h1>
          <p className="text-gray-400">Manage academic branches across all education levels</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }} 
          whileTap={{ scale: 0.95 }} 
          onClick={openAdd} 
          className="px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-semibold flex items-center gap-2 shadow-lg"
        >
          <Plus className="w-5 h-5"/> Add Branch
        </motion.button>
      </div>

      <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search branches by title" 
              value={searchQuery} 
              onChange={(e)=>setSearchQuery(e.target.value)} 
              onKeyDown={(e)=> e.key==='Enter' && loadBranches(1)} 
              className="w-full pl-12 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-violet-500 outline-none" 
            />
          </div>
          <select 
            value={statusFilter} 
            onChange={(e)=>{setStatusFilter(e.target.value); loadBranches(1);}} 
            className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-violet-500 outline-none"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button 
            onClick={()=>loadBranches(1)} 
            className="px-6 py-3 bg-violet-600 hover:bg-violet-700 rounded-xl text-white font-semibold"
          >
            Search
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      ) : branches.length === 0 ? (
        <div className="text-center py-12 text-gray-400">No branches found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {branches.map((branch) => (
            <motion.div 
              key={branch._id} 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden hover:border-violet-500/50 transition-colors"
            >
              <div className="p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="text-white font-semibold text-lg flex-1">{branch.title}</h3>
                  <button 
                    onClick={() => handleToggleStatus(branch)}
                    className="ml-2"
                  >
                    {branch.isActive ? (
                      <ToggleRight className="w-6 h-6 text-green-400" />
                    ) : (
                      <ToggleLeft className="w-6 h-6 text-gray-500" />
                    )}
                  </button>
                </div>
                
                {branch.description && (
                  <p className="text-sm text-gray-400 line-clamp-2">{branch.description}</p>
                )}
                
                {branch.link && (
                  <div className="flex items-center gap-2 text-sm">
                    <Link2 className="w-4 h-4 text-violet-400" />
                    <a 
                      href={branch.link} 
                      className="text-violet-400 hover:text-violet-300 truncate" 
                      target="_blank" 
                      rel="noreferrer"
                    >
                      {branch.link}
                    </a>
                  </div>
                )}
                
                <div className="pt-3 border-t border-gray-700 flex items-center justify-between">
                  <span className={`text-xs px-2 py-1 rounded-full ${branch.isActive ? 'bg-green-500/20 text-green-400' : 'bg-gray-600/50 text-gray-400'}`}>
                    {branch.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => openView(branch)} 
                      className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4 text-blue-400"/>
                    </button>
                    <button 
                      onClick={() => openEdit(branch)} 
                      className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4 text-green-400"/>
                    </button>
                    <button 
                      onClick={() => handleDelete(branch._id)} 
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
            onClick={()=>loadBranches(page-1)} 
            className="px-4 py-2 bg-gray-800 disabled:opacity-50 hover:bg-gray-700 text-white rounded-lg border border-gray-700"
          >
            Prev
          </button>
          <span className="text-gray-400">Page {page} / {pages}</span>
          <button 
            disabled={page>=pages} 
            onClick={()=>loadBranches(page+1)} 
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
              className="bg-gray-800 rounded-2xl border border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-5 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">
                  {modalMode === 'add' ? 'Add Branch' : modalMode === 'edit' ? 'Edit Branch' : 'Branch Details'}
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
                      <label className="text-sm text-gray-400">Title</label>
                      <p className="text-white text-lg font-semibold">{selected?.title}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Link</label>
                      <p className="text-white">{selected?.link || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Description</label>
                      <p className="text-white">{selected?.description || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Status</label>
                      <p className={`text-lg font-semibold ${selected?.isActive ? 'text-green-400' : 'text-gray-400'}`}>
                        {selected?.isActive ? 'Active' : 'Inactive'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Created</label>
                      <p className="text-white">{new Date(selected?.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Title <span className="text-red-400">*</span>
                      </label>
                      <input 
                        type="text" 
                        required 
                        value={formData.title} 
                        onChange={(e)=>setFormData({...formData, title: e.target.value})} 
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-violet-500 outline-none" 
                        placeholder="e.g., Computer Science & Engineering"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Link</label>
                      <input 
                        type="text" 
                        value={formData.link} 
                        onChange={(e)=>setFormData({...formData, link: e.target.value})} 
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-violet-500 outline-none" 
                        placeholder="/branches/cse"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                      <textarea 
                        value={formData.description} 
                        onChange={(e)=>setFormData({...formData, description: e.target.value})} 
                        rows="3"
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-violet-500 outline-none" 
                        placeholder="Brief description of this branch"
                      />
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        id="isActive"
                        checked={formData.isActive} 
                        onChange={(e)=>setFormData({...formData, isActive: e.target.checked})} 
                        className="w-5 h-5 text-violet-600 bg-gray-700 border-gray-600 rounded focus:ring-violet-500"
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
                        className="flex-1 px-4 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-semibold"
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

export default AdminBranches;
