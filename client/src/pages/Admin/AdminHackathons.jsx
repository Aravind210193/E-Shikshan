import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Edit, Trash2, Eye, Calendar, MapPin, Trophy, X } from "lucide-react";
import { toast } from "react-hot-toast";
import { adminHackathonAPI } from "../../services/adminApi";

const emptyForm = {
  title: "",
  organizer: "",
  description: "",
  location: "Online",
  mode: "online",
  startDate: "",
  endDate: "",
  prize: "",
  imageUrl: "",
  applyUrl: "",
  tags: "",
  status: "upcoming",
};

const AdminHackathons = () => {
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
      const res = await adminHackathonAPI.getAll(params);
      if (res.data.success) {
        setItems(res.data.data);
        setPage(res.data.page);
        setPages(res.data.pages);
      }
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to fetch hackathons");
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
      startDate: item.startDate ? item.startDate.slice(0, 10) : "",
      endDate: item.endDate ? item.endDate.slice(0, 10) : "",
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
    if (!window.confirm("Delete this hackathon?")) return;
    try {
      await adminHackathonAPI.delete(id);
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
      tags: formData.tags
        ? formData.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : [],
    };
    try {
      if (modalMode === "add") {
        await adminHackathonAPI.create(payload);
        toast.success("Created");
      } else if (modalMode === "edit" && selected) {
        await adminHackathonAPI.update(selected._id, payload);
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
          <h1 className="text-3xl font-bold text-white mb-2">Hackathons</h1>
          <p className="text-gray-400">Manage hackathon listings</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={openAdd}
          className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold flex items-center gap-2 shadow-lg"
        >
          <Plus className="w-5 h-5" /> Add Hackathon
        </motion.button>
      </div>

      <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by title, organizer, location"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && loadData(1)}
              className="w-full pl-12 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); loadData(1); }}
            className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-red-500 outline-none"
          >
            <option value="all">All Status</option>
            <option value="upcoming">Upcoming</option>
            <option value="active">Active</option>
            <option value="closed">Closed</option>
            <option value="draft">Draft</option>
          </select>
          <button onClick={() => loadData(1)} className="px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl text-white">Search</button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <motion.div key={item._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
            <div className="h-40 bg-gray-700/50 relative">
              {item.imageUrl && <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />}
              <div className="absolute top-3 right-3">
                <span className="px-3 py-1 text-xs rounded-full bg-white/20 text-white backdrop-blur">
                  {item.status}
                </span>
              </div>
            </div>
            <div className="p-5 space-y-3">
              <h3 className="text-white font-semibold line-clamp-2">{item.title}</h3>
              <div className="text-sm text-gray-400 space-y-1">
                <div className="flex items-center gap-2"><Trophy className="w-4 h-4" />{item.organizer || 'Organizer'}</div>
                <div className="flex items-center gap-2"><MapPin className="w-4 h-4" />{item.location} · {item.mode}</div>
                <div className="flex items-center gap-2"><Calendar className="w-4 h-4" />{item.startDate?.slice(0,10)} → {item.endDate?.slice(0,10)}</div>
              </div>
              <div className="pt-3 border-t border-gray-700 flex items-center justify-between">
                <span className="text-xs text-gray-500">Prize: {item.prize || '—'}</span>
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

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button disabled={page<=1} onClick={() => loadData(page-1)} className="px-4 py-2 bg-gray-800 disabled:opacity-50 hover:bg-gray-700 text-white rounded-lg border border-gray-700">Prev</button>
          <span className="text-gray-400">Page {page} / {pages}</span>
          <button disabled={page>=pages} onClick={() => loadData(page+1)} className="px-4 py-2 bg-gray-800 disabled:opacity-50 hover:bg-gray-700 text-white rounded-lg border border-gray-700">Next</button>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-gray-800 rounded-2xl border border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-5 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">{modalMode === 'add' ? 'Add Hackathon' : modalMode === 'edit' ? 'Edit Hackathon' : 'Hackathon Details'}</h2>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-700 rounded-lg"><X className="w-5 h-5 text-gray-400"/></button>
              </div>

              <div className="p-5">
                {modalMode === 'view' ? (
                  <div className="space-y-3 text-gray-300">
                    <div><span className="text-gray-400 text-sm">Title</span><p className="text-white">{selected?.title}</p></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><span className="text-gray-400 text-sm">Organizer</span><p className="text-white">{selected?.organizer}</p></div>
                      <div><span className="text-gray-400 text-sm">Status</span><p className="text-white">{selected?.status}</p></div>
                      <div><span className="text-gray-400 text-sm">Start</span><p className="text-white">{selected?.startDate?.slice(0,10)}</p></div>
                      <div><span className="text-gray-400 text-sm">End</span><p className="text-white">{selected?.endDate?.slice(0,10)}</p></div>
                      <div><span className="text-gray-400 text-sm">Location</span><p className="text-white">{selected?.location} · {selected?.mode}</p></div>
                      <div><span className="text-gray-400 text-sm">Prize</span><p className="text-white">{selected?.prize}</p></div>
                    </div>
                    <div><span className="text-gray-400 text-sm">Apply URL</span><p className="text-blue-400 break-all">{selected?.applyUrl}</p></div>
                    <div><span className="text-gray-400 text-sm">Tags</span><p className="text-white">{(selected?.tags||[]).join(', ')}</p></div>
                    <div><span className="text-gray-400 text-sm">Description</span><p className="text-white whitespace-pre-line">{selected?.description}</p></div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="text-sm text-gray-400">Title</label>
                      <input value={formData.title} onChange={(e)=>setFormData({...formData,title:e.target.value})} required className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white" />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Organizer</label>
                      <input value={formData.organizer} onChange={(e)=>setFormData({...formData,organizer:e.target.value})} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white" />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Status</label>
                      <select value={formData.status} onChange={(e)=>setFormData({...formData,status:e.target.value})} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white">
                        <option value="upcoming">Upcoming</option>
                        <option value="active">Active</option>
                        <option value="closed">Closed</option>
                        <option value="draft">Draft</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Start Date</label>
                      <input type="date" value={formData.startDate} onChange={(e)=>setFormData({...formData,startDate:e.target.value})} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white" />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">End Date</label>
                      <input type="date" value={formData.endDate} onChange={(e)=>setFormData({...formData,endDate:e.target.value})} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white" />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Location</label>
                      <input value={formData.location} onChange={(e)=>setFormData({...formData,location:e.target.value})} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white" />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Mode</label>
                      <select value={formData.mode} onChange={(e)=>setFormData({...formData,mode:e.target.value})} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white">
                        <option value="online">Online</option>
                        <option value="offline">Offline</option>
                        <option value="hybrid">Hybrid</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Prize</label>
                      <input value={formData.prize} onChange={(e)=>setFormData({...formData,prize:e.target.value})} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm text-gray-400">Apply URL</label>
                      <input value={formData.applyUrl} onChange={(e)=>setFormData({...formData,applyUrl:e.target.value})} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm text-gray-400">Image URL</label>
                      <input value={formData.imageUrl} onChange={(e)=>setFormData({...formData,imageUrl:e.target.value})} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm text-gray-400">Tags (comma-separated)</label>
                      <input value={formData.tags} onChange={(e)=>setFormData({...formData,tags:e.target.value})} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm text-gray-400">Description</label>
                      <textarea rows={4} value={formData.description} onChange={(e)=>setFormData({...formData,description:e.target.value})} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white" />
                    </div>
                    <div className="md:col-span-2 flex justify-end gap-2">
                      <button type="button" onClick={()=>setShowModal(false)} className="px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl text-white">Cancel</button>
                      <button type="submit" className="px-4 py-3 bg-red-600 hover:bg-red-700 rounded-xl text-white">Save</button>
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

export default AdminHackathons;
