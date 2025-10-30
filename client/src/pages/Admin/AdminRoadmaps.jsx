import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Edit, Trash2, Eye, Layers, List, X } from "lucide-react";
import { toast } from "react-hot-toast";
import { adminRoadmapAPI } from "../../services/adminApi";

const emptyForm = {
  title: "",
  category: "",
  level: "Beginner",
  thumbnail: "",
  status: "active",
  tags: "",
  steps: [],
};

const AdminRoadmaps = () => {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selected, setSelected] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const loadData = async (p = 1) => {
    try {
      setLoading(true);
      const params = { page: p, limit: 12 };
      if (searchQuery) params.search = searchQuery;
      if (statusFilter !== "all") params.status = statusFilter;
      const res = await adminRoadmapAPI.getAll(params);
      if (res.data.success) {
        setItems(res.data.data);
        setPage(res.data.page);
        setPages(res.data.pages);
      }
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to fetch roadmaps");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openAdd = () => {
    setModalMode("add");
    setFormData(emptyForm);
    setShowModal(true);
  };

  const openEdit = (item) => {
    setModalMode("edit");
    setSelected(item);
    setFormData({
      ...emptyForm,
      ...item,
      tags: (item.tags || []).join(", "),
      steps: item.steps || [],
    });
    setShowModal(true);
  };

  const openView = (item) => {
    setModalMode("view");
    setSelected(item);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this roadmap?")) return;
    try {
      await adminRoadmapAPI.delete(id);
      toast.success("Deleted");
      loadData(page);
    } catch (e) {
      toast.error(e.response?.data?.message || "Delete failed");
    }
  };

  const addStep = () => {
    setFormData({
      ...formData,
      steps: [...formData.steps, { title: "", description: "", resources: [], order: formData.steps.length }],
    });
  };

  const updateStep = (index, key, value) => {
    const steps = [...formData.steps];
    steps[index] = { ...steps[index], [key]: value };
    setFormData({ ...formData, steps });
  };

  const removeStep = (index) => {
    const steps = formData.steps.filter((_, i) => i !== index).map((s, i) => ({ ...s, order: i }));
    setFormData({ ...formData, steps });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      tags: formData.tags ? formData.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
    };
    try {
      if (modalMode === "add") {
        await adminRoadmapAPI.create(payload);
        toast.success("Created");
      } else if (modalMode === "edit" && selected) {
        await adminRoadmapAPI.update(selected._id, payload);
        toast.success("Updated");
      }
      setShowModal(false);
      loadData(page);
    } catch (e) {
      toast.error(e.response?.data?.message || "Save failed");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Roadmaps</h1>
          <p className="text-gray-400">Manage learning roadmaps</p>
        </div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={openAdd} className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold flex items-center gap-2 shadow-lg">
          <Plus className="w-5 h-5"/> Add Roadmap
        </motion.button>
      </div>

      <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input type="text" placeholder="Search by title or category" value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} onKeyDown={(e)=> e.key==='Enter' && loadData(1)} className="w-full pl-12 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 outline-none" />
          </div>
          <select value={statusFilter} onChange={(e)=>{setStatusFilter(e.target.value); loadData(1);}} className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-purple-500 outline-none">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
          <button onClick={()=>loadData(1)} className="px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl text-white">Search</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <motion.div key={item._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
            <div className="h-40 bg-gray-700/50 relative">
              {item.thumbnail && <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />}
              <div className="absolute top-3 right-3">
                <span className="px-3 py-1 text-xs rounded-full bg-white/20 text-white backdrop-blur">{item.status}</span>
              </div>
            </div>
            <div className="p-5 space-y-3">
              <h3 className="text-white font-semibold line-clamp-2">{item.title}</h3>
              <div className="text-sm text-gray-400 space-y-1">
                <div className="flex items-center gap-2"><Layers className="w-4 h-4" />{item.category || 'General'} · {item.level}</div>
                <div className="flex items-center gap-2"><List className="w-4 h-4" />{(item.steps||[]).length} steps</div>
              </div>
              <div className="pt-3 border-t border-gray-700 flex items-center justify-between">
                <span className="text-xs text-gray-500">Tags: {(item.tags||[]).slice(0,3).join(', ')}</span>
                <div className="flex gap-2">
                  <button onClick={() => openView(item)} className="p-2 hover:bg-gray-700 rounded-lg"><Eye className="w-4 h-4 text-blue-400"/></button>
                  <button onClick={() => openEdit(item)} className="p-2 hover:bg-gray-700 rounded-lg"><Edit className="w-4 h-4 text-green-400"/></button>
                  <button onClick={() => handleDelete(item._id)} className="p-2 hover:bg-gray-700 rounded-lg"><Trash2 className="w-4 h-4 text-red-400"/></button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {pages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button disabled={page<=1} onClick={()=>loadData(page-1)} className="px-4 py-2 bg-gray-800 disabled:opacity-50 hover:bg-gray-700 text-white rounded-lg border border-gray-700">Prev</button>
          <span className="text-gray-400">Page {page} / {pages}</span>
          <button disabled={page>=pages} onClick={()=>loadData(page+1)} className="px-4 py-2 bg-gray-800 disabled:opacity-50 hover:bg-gray-700 text-white rounded-lg border border-gray-700">Next</button>
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-gray-800 rounded-2xl border border-gray-700 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-5 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">{modalMode === 'add' ? 'Add Roadmap' : modalMode === 'edit' ? 'Edit Roadmap' : 'Roadmap Details'}</h2>
                <button onClick={()=>setShowModal(false)} className="p-2 hover:bg-gray-700 rounded-lg"><X className="w-5 h-5 text-gray-400"/></button>
              </div>
              <div className="p-5">
                {modalMode === 'view' ? (
                  <div className="space-y-3 text-gray-300">
                    <div><span className="text-gray-400 text-sm">Title</span><p className="text-white">{selected?.title}</p></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><span className="text-gray-400 text-sm">Category</span><p className="text-white">{selected?.category}</p></div>
                      <div><span className="text-gray-400 text-sm">Level</span><p className="text-white">{selected?.level}</p></div>
                      <div><span className="text-gray-400 text-sm">Status</span><p className="text-white">{selected?.status}</p></div>
                      <div><span className="text-gray-400 text-sm">Tags</span><p className="text-white">{(selected?.tags||[]).join(', ')}</p></div>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Steps</span>
                      <ol className="list-decimal ml-5 text-white space-y-1">
                        {(selected?.steps||[]).map((s,i)=> (
                          <li key={i}>
                            <span className="font-medium">{s.title}</span> — <span className="text-gray-300">{s.description}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-400">Title</label>
                        <input value={formData.title} onChange={(e)=>setFormData({...formData,title:e.target.value})} required className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white" />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">Category</label>
                        <input value={formData.category} onChange={(e)=>setFormData({...formData,category:e.target.value})} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white" />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">Level</label>
                        <select value={formData.level} onChange={(e)=>setFormData({...formData,level:e.target.value})} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white">
                          <option>Beginner</option>
                          <option>Intermediate</option>
                          <option>Advanced</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">Status</label>
                        <select value={formData.status} onChange={(e)=>setFormData({...formData,status:e.target.value})} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white">
                          <option value="active">Active</option>
                          <option value="draft">Draft</option>
                          <option value="archived">Archived</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-sm text-gray-400">Thumbnail URL</label>
                        <input value={formData.thumbnail} onChange={(e)=>setFormData({...formData,thumbnail:e.target.value})} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-sm text-gray-400">Tags (comma-separated)</label>
                        <input value={formData.tags} onChange={(e)=>setFormData({...formData,tags:e.target.value})} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white" />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-white font-semibold">Steps</h3>
                        <button type="button" onClick={addStep} className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">Add Step</button>
                      </div>
                      {(formData.steps||[]).map((s, i) => (
                        <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-gray-800/60 border border-gray-700 rounded-xl p-3">
                          <div className="md:col-span-5">
                            <input placeholder="Step title" value={s.title} onChange={(e)=>updateStep(i,'title',e.target.value)} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"/>
                          </div>
                          <div className="md:col-span-6">
                            <input placeholder="Description" value={s.description} onChange={(e)=>updateStep(i,'description',e.target.value)} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"/>
                          </div>
                          <div className="md:col-span-1 flex items-center justify-end">
                            <button type="button" onClick={()=>removeStep(i)} className="p-2 hover:bg-gray-700 rounded-lg"><Trash2 className="w-4 h-4 text-red-400"/></button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button type="button" onClick={()=>setShowModal(false)} className="px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl text-white">Cancel</button>
                      <button type="submit" className="px-4 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl text-white">Save</button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {loading && <div className="text-center text-gray-400">Loading...</div>}
    </div>
  );
};

export default AdminRoadmaps;
