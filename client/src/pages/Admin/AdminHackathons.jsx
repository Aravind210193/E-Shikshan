import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Edit, Trash2, Eye, Calendar, MapPin, Trophy, X } from "lucide-react";
import { toast } from "react-hot-toast";
import { adminHackathonAPI } from "../../services/adminApi";

const emptyForm = {
  title: "",
  tagline: "",
  organizer: "",
  description: "",
  overview: "",
  location: "Online",
  mode: "online",
  startDate: "",
  endDate: "",
  registrationCloses: "",
  submissionDeadline: "",
  prize: "",
  teamSize: "",
  payment: "",
  imageUrl: "",
  bgImage: "",
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
  const [stats, setStats] = useState({ total: 0, upcoming: 0, active: 0, closed: 0 });

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
      const [res, statsRes] = await Promise.all([
        adminHackathonAPI.getAll(params),
        adminHackathonAPI.getStats()
      ]);
      if (res.data.success) {
        setItems(res.data.data);
        setPage(res.data.page);
        setPages(res.data.pages);
      }
      if (statsRes.data.success) {
        setStats(statsRes.data.data);
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
      registrationCloses: item.registrationCloses ? item.registrationCloses.slice(0, 10) : "",
      submissionDeadline: item.submissionDeadline ? item.submissionDeadline.slice(0, 10) : "",
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Hackathons", value: stats.total, color: "bg-blue-500/10 text-blue-500", icon: Trophy },
          { label: "Active", value: stats.active, color: "bg-green-500/10 text-green-500", icon: Eye },
          { label: "Upcoming", value: stats.upcoming, color: "bg-amber-500/10 text-amber-500", icon: Calendar },
          { label: "Closed", value: stats.closed, color: "bg-rose-500/10 text-rose-500", icon: X },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-gray-800 p-6 rounded-2xl border border-gray-700 flex items-center justify-between shadow-lg"
          >
            <div>
              <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
            </div>
            <div className={`p-3 rounded-xl ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
          </motion.div>
        ))}
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
                <div className="flex items-center gap-2"><Calendar className="w-4 h-4" />{item.startDate?.slice(0, 10)} → {item.endDate?.slice(0, 10)}</div>
              </div>
              <div className="pt-3 border-t border-gray-700 flex items-center justify-between">
                <span className="text-xs text-gray-500">Prize: {item.prize || '—'}</span>
                <div className="flex gap-2">
                  <button onClick={() => openView(item)} className="p-2 hover:bg-gray-700 rounded-lg"><Eye className="w-4 h-4 text-blue-400" /></button>
                  <button onClick={() => openEdit(item)} className="p-2 hover:bg-gray-700 rounded-lg"><Edit className="w-4 h-4 text-green-400" /></button>
                  <button onClick={() => handleDelete(item._id)} className="p-2 hover:bg-gray-700 rounded-lg"><Trash2 className="w-4 h-4 text-red-400" /></button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button disabled={page <= 1} onClick={() => loadData(page - 1)} className="px-4 py-2 bg-gray-800 disabled:opacity-50 hover:bg-gray-700 text-white rounded-lg border border-gray-700">Prev</button>
          <span className="text-gray-400">Page {page} / {pages}</span>
          <button disabled={page >= pages} onClick={() => loadData(page + 1)} className="px-4 py-2 bg-gray-800 disabled:opacity-50 hover:bg-gray-700 text-white rounded-lg border border-gray-700">Next</button>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-gray-800 rounded-2xl border border-gray-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-5 flex items-center justify-between z-10">
                <h2 className="text-xl font-bold text-white">{modalMode === 'add' ? 'Add Hackathon' : modalMode === 'edit' ? 'Edit Hackathon' : 'Hackathon Details'}</h2>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-700 rounded-lg"><X className="w-5 h-5 text-gray-400" /></button>
              </div>

              <div className="p-6">
                {modalMode === 'view' ? (
                  <div className="space-y-6 text-gray-300">
                    {/* Header Info */}
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="w-full md:w-1/3">
                        {selected?.imageUrl ? (
                          <img src={selected.imageUrl} alt="Cover" className="w-full h-48 object-cover rounded-xl border border-gray-700" />
                        ) : (
                          <div className="w-full h-48 bg-gray-700 rounded-xl flex items-center justify-center text-gray-500">No Image</div>
                        )}
                        {selected?.bgImage && (
                          <div className="mt-2">
                            <p className="text-xs text-gray-500 mb-1">Background Image:</p>
                            <img src={selected.bgImage} alt="Background" className="w-full h-24 object-cover rounded-lg border border-gray-700 opacity-60" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 space-y-4">
                        <div>
                          <h3 className="text-2xl font-bold text-white">{selected?.title}</h3>
                          <p className="text-blue-400 font-medium">{selected?.tagline}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div><span className="text-gray-500 block">Organizer</span> <span className="text-white font-medium">{selected?.organizer}</span></div>
                          <div><span className="text-gray-500 block">Status</span> <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${selected?.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-300'}`}>{selected?.status}</span></div>
                          <div><span className="text-gray-500 block">Mode</span> <span className="text-white capitalize">{selected?.mode} ({selected?.location})</span></div>
                          <div><span className="text-gray-500 block">Team Size</span> <span className="text-white">{selected?.teamSize || 'N/A'}</span></div>
                          <div><span className="text-gray-500 block">Prize Pool</span> <span className="text-amber-400 font-bold">{selected?.prize}</span></div>
                          <div><span className="text-gray-500 block">Entry Fee</span> <span className="text-white">{selected?.payment || 'Free'}</span></div>
                        </div>

                        <div className="space-y-1 pt-2 border-t border-gray-700">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Registration:</span>
                            <span className="text-white">{selected?.startDate?.slice(0, 10)} - {selected?.registrationCloses?.slice(0, 10)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Event Date:</span>
                            <span className="text-white">{selected?.startDate?.slice(0, 10)} - {selected?.endDate?.slice(0, 10)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Overview & Description */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-700">
                      <div>
                        <h4 className="text-lg font-bold text-white mb-2">Overview</h4>
                        <p className="text-sm text-gray-300 whitespace-pre-line leading-relaxed">{selected?.overview}</p>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white mb-2">Description</h4>
                        <p className="text-sm text-gray-300 whitespace-pre-line leading-relaxed">{selected?.description}</p>
                      </div>
                    </div>

                    {/* Dynamic Sections */}
                    {(selected?.about?.length > 0 || selected?.challenges?.length > 0) && (
                      <div className="pt-4 border-t border-gray-700 space-y-6">
                        {selected?.about?.length > 0 && (
                          <div>
                            <h4 className="text-lg font-bold text-white mb-3">About / Themes</h4>
                            <div className="grid grid-cols-1 gap-3">
                              {selected.about.map((item, i) => (
                                <div key={i} className="bg-gray-700/30 p-3 rounded-lg border border-gray-700">
                                  <h5 className="font-bold text-white text-sm mb-1">{item.title}</h5>
                                  <p className="text-xs text-gray-400">{item.description}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {selected?.challenges?.length > 0 && (
                          <div>
                            <h4 className="text-lg font-bold text-white mb-3">Challenges & Tracks</h4>
                            <div className="grid grid-cols-1 gap-3">
                              {selected.challenges.map((item, i) => (
                                <div key={i} className="bg-gray-700/30 p-3 rounded-lg border border-gray-700">
                                  <h5 className="font-bold text-white text-sm mb-1">{item.title}</h5>
                                  <p className="text-xs text-gray-400">{item.description}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {selected?.whoCanParticipate?.length > 0 && (
                          <div>
                            <h4 className="text-lg font-bold text-white mb-3">Who Can Participate</h4>
                            <ul className="list-disc list-inside text-sm text-gray-300">
                              {selected.whoCanParticipate.map((item, i) => (
                                <li key={i}><span className="font-semibold text-white">{item.title}</span> - {item.description}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Links */}
                    <div className="pt-4 border-t border-gray-700">
                      <span className="text-gray-500 text-sm block mb-1">Application URL</span>
                      <a href={selected?.applyUrl} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline break-all block">{selected?.applyUrl}</a>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="md:col-span-2">
                      <label className="text-sm text-gray-400 font-medium">Title</label>
                      <input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-white focus:border-red-500 outline-none" placeholder="Hackathon Name" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm text-gray-400 font-medium">Tagline</label>
                      <input value={formData.tagline} onChange={(e) => setFormData({ ...formData, tagline: e.target.value })} className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-white focus:border-red-500 outline-none" placeholder="Catchy slogan" />
                    </div>

                    <div>
                      <label className="text-sm text-gray-400 font-medium">Organizer</label>
                      <input value={formData.organizer} onChange={(e) => setFormData({ ...formData, organizer: e.target.value })} className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-white focus:border-red-500 outline-none" />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 font-medium">Status</label>
                      <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-white focus:border-red-500 outline-none">
                        <option value="upcoming">Upcoming</option>
                        <option value="active">Active</option>
                        <option value="closed">Closed</option>
                        <option value="draft">Draft</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm text-gray-400 font-medium">Start Date</label>
                      <input type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-white focus:border-red-500 outline-none" />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 font-medium">End Date</label>
                      <input type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-white focus:border-red-500 outline-none" />
                    </div>

                    <div>
                      <label className="text-sm text-gray-400 font-medium">Registration Deadline</label>
                      <input type="date" value={formData.registrationCloses} onChange={(e) => setFormData({ ...formData, registrationCloses: e.target.value })} className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-white focus:border-red-500 outline-none" />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 font-medium">Mode</label>
                      <select value={formData.mode} onChange={(e) => setFormData({ ...formData, mode: e.target.value })} className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-white focus:border-red-500 outline-none">
                        <option value="online">Online</option>
                        <option value="offline">Offline</option>
                        <option value="hybrid">Hybrid</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm text-gray-400 font-medium">Location</label>
                      <input value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-white focus:border-red-500 outline-none" />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 font-medium">Team Size</label>
                      <input value={formData.teamSize} onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })} className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-white focus:border-red-500 outline-none" placeholder="e.g. 1-4 Members" />
                    </div>

                    <div>
                      <label className="text-sm text-gray-400 font-medium">Prize Pool</label>
                      <input value={formData.prize} onChange={(e) => setFormData({ ...formData, prize: e.target.value })} className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-white focus:border-red-500 outline-none" />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 font-medium">Entry Fee</label>
                      <input value={formData.payment} onChange={(e) => setFormData({ ...formData, payment: e.target.value })} className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-white focus:border-red-500 outline-none" placeholder="Free" />
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-sm text-gray-400 font-medium">Image URL</label>
                      <input value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-white focus:border-red-500 outline-none" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm text-gray-400 font-medium">Background Image URL</label>
                      <input value={formData.bgImage} onChange={(e) => setFormData({ ...formData, bgImage: e.target.value })} className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-white focus:border-red-500 outline-none" />
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-sm text-gray-400 font-medium">Apply URL</label>
                      <input value={formData.applyUrl} onChange={(e) => setFormData({ ...formData, applyUrl: e.target.value })} className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-white focus:border-red-500 outline-none" />
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-sm text-gray-400 font-medium">Overview (Short Summary)</label>
                      <textarea rows={3} value={formData.overview} onChange={(e) => setFormData({ ...formData, overview: e.target.value })} className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-white focus:border-red-500 outline-none" placeholder="Brief overview of the hackathon..." />
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-sm text-gray-400 font-medium">Full Description</label>
                      <textarea rows={6} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-white focus:border-red-500 outline-none" placeholder="Detailed content..." />
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-sm text-gray-400 font-medium">Tags (comma-separated)</label>
                      <input value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-white focus:border-red-500 outline-none" />
                    </div>

                    <div className="md:col-span-2 flex justify-end gap-3 pt-6 border-t border-gray-700">
                      <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 rounded-xl text-white font-medium transition-colors">Cancel</button>
                      <button type="submit" className="px-6 py-2.5 bg-red-600 hover:bg-red-700 rounded-xl text-white font-bold shadow-lg shadow-red-500/30 transition-all transform hover:scale-105">Save Hackathon</button>
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
