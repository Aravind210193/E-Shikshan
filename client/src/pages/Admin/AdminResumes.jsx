import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Edit, Trash2, Eye, Image as ImageIcon, Tags, X } from "lucide-react";
import { toast } from "react-hot-toast";
import { adminResumeAPI } from "../../services/adminApi";

const emptyForm = {
  name: "",
  description: "",
  previewImage: "",
  isActive: true,
  tags: "",
  sections: [],
};

const AdminResumes = () => {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
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
      if (activeFilter !== "all") params.active = activeFilter === 'true';
      const res = await adminResumeAPI.getAll(params);
      if (res.data.success) {
        setItems(res.data.data);
        setPage(res.data.page);
        setPages(res.data.pages);
      }
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to fetch resume templates");
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
      sections: item.sections || [],
    });
    setShowModal(true);
  };

  const openView = (item) => {
    setModalMode("view");
    setSelected(item);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this resume template?")) return;
    try {
      await adminResumeAPI.delete(id);
      toast.success("Deleted");
      loadData(page);
    } catch (e) {
      toast.error(e.response?.data?.message || "Delete failed");
    }
  };

  const addSection = () => {
    setFormData({
      ...formData,
      sections: [...formData.sections, { key: "section" + (formData.sections.length + 1), label: "New Section", fields: ["title", "subtitle", "description"], order: formData.sections.length }],
    });
  };

  const updateSection = (index, key, value) => {
    const sections = [...formData.sections];
    sections[index] = { ...sections[index], [key]: value };
    setFormData({ ...formData, sections });
  };

  const removeSection = (index) => {
    const sections = formData.sections.filter((_, i) => i !== index).map((s, i) => ({ ...s, order: i }));
    setFormData({ ...formData, sections });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      tags: formData.tags ? formData.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
    };
    try {
      if (modalMode === "add") {
        await adminResumeAPI.create(payload);
        toast.success("Created");
      } else if (modalMode === "edit" && selected) {
        await adminResumeAPI.update(selected._id, payload);
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
          <h1 className="text-3xl font-bold text-white mb-2">Resume Templates</h1>
          <p className="text-gray-400">Manage resume templates used by the Resume Builder</p>
        </div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={openAdd} className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold flex items-center gap-2 shadow-lg">
          <Plus className="w-5 h-5"/> Add Template
        </motion.button>
      </div>

      <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input type="text" placeholder="Search by name or tag" value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} onKeyDown={(e)=> e.key==='Enter' && loadData(1)} className="w-full pl-12 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 outline-none" />
          </div>
          <select value={activeFilter} onChange={(e)=>{setActiveFilter(e.target.value); loadData(1);}} className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 outline-none">
            <option value="all">All</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
          <button onClick={()=>loadData(1)} className="px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl text-white">Search</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <motion.div key={item._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
            <div className="h-40 bg-gray-700/50 flex items-center justify-center">
              {item.previewImage ? (
                <img src={item.previewImage} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="w-10 h-10 text-gray-500" />
              )}
            </div>
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold line-clamp-2">{item.name}</h3>
                <span className={`px-3 py-1 text-xs rounded-full ${item.isActive ? 'bg-green-600' : 'bg-gray-600'} text-white`}>{item.isActive ? 'Active' : 'Inactive'}</span>
              </div>
              <div className="text-sm text-gray-400 space-y-1">
                <div className="flex items-center gap-2"><Tags className="w-4 h-4" />{(item.tags||[]).slice(0,3).join(', ')}</div>
                <div className="text-gray-400 line-clamp-2">{item.description}</div>
              </div>
              <div className="pt-3 border-t border-gray-700 flex items-center justify-between">
                <span className="text-xs text-gray-500">Sections: {(item.sections||[]).length}</span>
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
                <h2 className="text-xl font-bold text-white">{modalMode === 'add' ? 'Add Template' : modalMode === 'edit' ? 'Edit Template' : 'Template Details'}</h2>
                <button onClick={()=>setShowModal(false)} className="p-2 hover:bg-gray-700 rounded-lg"><X className="w-5 h-5 text-gray-400"/></button>
              </div>

              <div className="p-5">
                {modalMode === 'view' ? (
                  <div className="space-y-3 text-gray-300">
                    <div><span className="text-gray-400 text-sm">Name</span><p className="text-white">{selected?.name}</p></div>
                    <div><span className="text-gray-400 text-sm">Active</span><p className="text-white">{selected?.isActive ? 'Yes' : 'No'}</p></div>
                    <div><span className="text-gray-400 text-sm">Tags</span><p className="text-white">{(selected?.tags||[]).join(', ')}</p></div>
                    <div><span className="text-gray-400 text-sm">Description</span><p className="text-white whitespace-pre-line">{selected?.description}</p></div>
                    <div>
                      <span className="text-gray-400 text-sm">Sections</span>
                      <ol className="list-decimal ml-5 text-white space-y-1">
                        {(selected?.sections||[]).map((s,i)=> (
                          <li key={i}>
                            <span className="font-medium">{s.label}</span> — <span className="text-gray-300">{(s.fields||[]).join(', ')}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-400">Name</label>
                        <input value={formData.name} onChange={(e)=>setFormData({...formData,name:e.target.value})} required className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white" />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">Active</label>
                        <select value={formData.isActive ? 'true' : 'false'} onChange={(e)=>setFormData({...formData,isActive:e.target.value==='true'})} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white">
                          <option value="true">Yes</option>
                          <option value="false">No</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-sm text-gray-400">Preview Image URL</label>
                        <input value={formData.previewImage} onChange={(e)=>setFormData({...formData,previewImage:e.target.value})} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white" />
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

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-white font-semibold">Sections</h3>
                        <button type="button" onClick={addSection} className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">Add Section</button>
                      </div>
                      {(formData.sections||[]).map((s, i) => (
                        <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-gray-800/60 border border-gray-700 rounded-xl p-3">
                          <div className="md:col-span-3">
                            <input placeholder="Key" value={s.key} onChange={(e)=>updateSection(i,'key',e.target.value)} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"/>
                          </div>
                          <div className="md:col-span-4">
                            <input placeholder="Label" value={s.label} onChange={(e)=>updateSection(i,'label',e.target.value)} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"/>
                          </div>
                          <div className="md:col-span-4">
                            <input placeholder="Fields (comma-separated)" value={(s.fields||[]).join(', ')} onChange={(e)=>updateSection(i,'fields', e.target.value.split(',').map(f=>f.trim()).filter(Boolean))} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"/>
                          </div>
                          <div className="md:col-span-1 flex items-center justify-end">
                            <button type="button" onClick={()=>removeSection(i)} className="p-2 hover:bg-gray-700 rounded-lg"><Trash2 className="w-4 h-4 text-red-400"/></button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button type="button" onClick={()=>setShowModal(false)} className="px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl text-white">Cancel</button>
                      <button type="submit" className="px-4 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-white">Save</button>
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

export default AdminResumes;
