import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Edit, Trash2, Eye, FileText, Link2, Tag, X } from "lucide-react";
import { toast } from "react-hot-toast";
import { adminContentAPI } from "../../services/adminApi";

const emptyForm = {
  title: "",
  type: "pdf",
  branch: "",
  subject: "",
  semester: "",
  category: "",
  url: "",
  description: "",
  tags: "",
  status: "draft",
};

const AdminContent = () => {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
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
      if (typeFilter !== "all") params.type = typeFilter;
      const res = await adminContentAPI.getAll(params);
      if (res.data.success) {
        setItems(res.data.data);
        setPage(res.data.page);
        setPages(res.data.pages);
      }
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to fetch content");
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
    });
    setShowModal(true);
  };

  const openView = (item) => {
    setModalMode("view");
    setSelected(item);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this content?")) return;
    try {
      await adminContentAPI.delete(id);
      toast.success("Deleted");
      loadData(page);
    } catch (e) {
      toast.error(e.response?.data?.message || "Delete failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      tags: formData.tags ? formData.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
    };
    try {
      if (modalMode === "add") {
        await adminContentAPI.create(payload);
        toast.success("Created");
      } else if (modalMode === "edit" && selected) {
        await adminContentAPI.update(selected._id, payload);
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
          <h1 className="text-3xl font-bold text-white mb-2">Content</h1>
          <p className="text-gray-400">Manage PDFs, videos, articles, and links</p>
        </div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={openAdd} className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold flex items-center gap-2 shadow-lg">
          <Plus className="w-5 h-5"/> Add Content
        </motion.button>
      </div>

      <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input type="text" placeholder="Search by title, subject, branch" value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} onKeyDown={(e)=> e.key==='Enter' && loadData(1)} className="w-full pl-12 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-teal-500 outline-none" />
          </div>
          <select value={typeFilter} onChange={(e)=>{setTypeFilter(e.target.value); loadData(1);}} className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-teal-500 outline-none">
            <option value="all">All Types</option>
            <option value="pdf">PDF</option>
            <option value="video">Video</option>
            <option value="article">Article</option>
            <option value="link">Link</option>
            <option value="subject">Subject</option>
          </select>
          <select value={statusFilter} onChange={(e)=>{setStatusFilter(e.target.value); loadData(1);}} className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-teal-500 outline-none">
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
          <button onClick={()=>loadData(1)} className="px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl text-white">Search</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <motion.div key={item._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold line-clamp-2">{item.title}</h3>
                <span className="px-3 py-1 text-xs rounded-full bg-white/10 text-white">{item.type}</span>
              </div>
              <div className="text-sm text-gray-400 space-y-1">
                <div className="flex items-center gap-2"><Tag className="w-4 h-4" />{item.category || 'General'}</div>
                <div className="flex items-center gap-2"><FileText className="w-4 h-4" />{item.branch} {item.semester ? `· Sem ${item.semester}` : ''} {item.subject ? `· ${item.subject}` : ''}</div>
                {item.url && <div className="flex items-center gap-2"><Link2 className="w-4 h-4" /><a href={item.url} className="text-blue-400 break-all" target="_blank" rel="noreferrer">{item.url}</a></div>}
              </div>
              <div className="pt-3 border-t border-gray-700 flex items-center justify-between">
                <span className="text-xs text-gray-500">{item.status}</span>
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
                <h2 className="text-xl font-bold text-white">{modalMode === 'add' ? 'Add Content' : modalMode === 'edit' ? 'Edit Content' : 'Content Details'}</h2>
                <button onClick={()=>setShowModal(false)} className="p-2 hover:bg-gray-700 rounded-lg"><X className="w-5 h-5 text-gray-400"/></button>
              </div>

              <div className="p-5">
                {modalMode === 'view' ? (
                  <div className="space-y-3 text-gray-300">
                    <div><span className="text-gray-400 text-sm">Title</span><p className="text-white">{selected?.title}</p></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><span className="text-gray-400 text-sm">Type</span><p className="text-white">{selected?.type}</p></div>
                      <div><span className="text-gray-400 text-sm">Status</span><p className="text-white">{selected?.status}</p></div>
                      <div><span className="text-gray-400 text-sm">Branch</span><p className="text-white">{selected?.branch}</p></div>
                      <div><span className="text-gray-400 text-sm">Semester</span><p className="text-white">{selected?.semester}</p></div>
                      <div><span className="text-gray-400 text-sm">Subject</span><p className="text-white">{selected?.subject}</p></div>
                      <div><span className="text-gray-400 text-sm">Category</span><p className="text-white">{selected?.category}</p></div>
                    </div>
                    {selected?.url && <div><span className="text-gray-400 text-sm">URL</span><p className="text-blue-400 break-all">{selected?.url}</p></div>}
                    <div><span className="text-gray-400 text-sm">Tags</span><p className="text-white">{(selected?.tags||[]).join(', ')}</p></div>
                    <div><span className="text-gray-400 text-sm">Description</span><p className="text-white whitespace-pre-line">{selected?.description}</p></div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-400">Title</label>
                        <input value={formData.title} onChange={(e)=>setFormData({...formData,title:e.target.value})} required className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white" />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">Type</label>
                        <select value={formData.type} onChange={(e)=>setFormData({...formData,type:e.target.value})} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white">
                          <option value="pdf">PDF</option>
                          <option value="video">Video</option>
                          <option value="article">Article</option>
                          <option value="link">Link</option>
                          <option value="subject">Subject</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">Branch</label>
                        <input value={formData.branch} onChange={(e)=>setFormData({...formData,branch:e.target.value})} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white" />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">Semester</label>
                        <input value={formData.semester} onChange={(e)=>setFormData({...formData,semester:e.target.value})} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white" />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">Subject</label>
                        <input value={formData.subject} onChange={(e)=>setFormData({...formData,subject:e.target.value})} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white" />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">Category</label>
                        <input value={formData.category} onChange={(e)=>setFormData({...formData,category:e.target.value})} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-sm text-gray-400">URL</label>
                        <input value={formData.url} onChange={(e)=>setFormData({...formData,url:e.target.value})} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-sm text-gray-400">Tags (comma-separated)</label>
                        <input value={formData.tags} onChange={(e)=>setFormData({...formData,tags:e.target.value})} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-sm text-gray-400">Description</label>
                        <textarea rows={4} value={formData.description} onChange={(e)=>setFormData({...formData,description:e.target.value})} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white" />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button type="button" onClick={()=>setShowModal(false)} className="px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl text-white">Cancel</button>
                      <button type="submit" className="px-4 py-3 bg-teal-600 hover:bg-teal-700 rounded-xl text-white">Save</button>
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

export default AdminContent;
