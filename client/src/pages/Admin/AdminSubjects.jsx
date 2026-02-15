import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Edit, Trash2, Eye, X, BookOpen, Filter } from "lucide-react";
import { toast } from "react-hot-toast";
import { adminSubjectAPI, adminBranchAPI } from "../../services/adminApi";

const emptyForm = {
  branch: "",
  semester: "",
  subjects: [],
};

const emptySubject = {
  name: "",
  link: "",
};

const AdminSubjects = () => {
  const [subjectGroups, setSubjectGroups] = useState([]);
  const [allBranches, setAllBranches] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [branchFilter, setBranchFilter] = useState("all");
  const [semesterFilter, setSemesterFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selected, setSelected] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const loadSubjectGroups = async (p = 1) => {
    try {
      setLoading(true);
      const params = { page: p, limit: 12 };
      if (searchQuery) params.search = searchQuery;
      if (branchFilter !== "all") params.branch = branchFilter;
      if (semesterFilter !== "all") params.semester = semesterFilter;
      
      const res = await adminSubjectAPI.getAll(params);
      if (res.data.success) {
        setSubjectGroups(res.data.data);
        setPage(res.data.page);
        setPages(res.data.pages);
      }
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to fetch subjects");
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
    loadSubjectGroups(1);
    loadBranches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openAdd = () => {
    setModalMode("add");
    setFormData({ ...emptyForm, subjects: [{ ...emptySubject }] });
    setShowModal(true);
  };

  const openEdit = (group) => {
    setModalMode("edit");
    setSelected(group);
    setFormData({
      branch: group.branch?._id || group.branch,
      semester: group.semester,
      subjects: group.subjects.map(s => ({ name: s.name, link: s.link || "" })),
    });
    setShowModal(true);
  };

  const openView = (group) => {
    setModalMode("view");
    setSelected(group);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this subject group? This cannot be undone.")) return;
    try {
      await adminSubjectAPI.delete(id);
      toast.success("Subject group deleted");
      loadSubjectGroups(page);
    } catch (e) {
      toast.error(e.response?.data?.message || "Delete failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      subjects: formData.subjects.filter(s => s.name.trim()),
    };
    try {
      if (modalMode === "add") {
        await adminSubjectAPI.create(payload);
        toast.success("Subject group created");
      } else if (modalMode === "edit" && selected) {
        await adminSubjectAPI.update(selected._id, payload);
        toast.success("Subject group updated");
      }
      setShowModal(false);
      loadSubjectGroups(page);
    } catch (e) {
      toast.error(e.response?.data?.message || "Save failed");
    }
  };

  const addSubject = () => {
    setFormData(prev => ({
      ...prev,
      subjects: [...prev.subjects, { ...emptySubject }]
    }));
  };

  const removeSubject = (index) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.filter((_, i) => i !== index)
    }));
  };

  const updateSubject = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.map((s, i) => 
        i === index ? { ...s, [field]: value } : s
      )
    }));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Subjects</h1>
          <p className="text-gray-400">Manage subjects for each branch and semester</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }} 
          whileTap={{ scale: 0.95 }} 
          onClick={openAdd} 
          className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold flex items-center gap-2 shadow-lg"
        >
          <Plus className="w-5 h-5"/> Add Subject Group
        </motion.button>
      </div>

      <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search subjects" 
              value={searchQuery} 
              onChange={(e)=>setSearchQuery(e.target.value)} 
              onKeyDown={(e)=> e.key==='Enter' && loadSubjectGroups(1)} 
              className="w-full pl-12 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-teal-500 outline-none" 
            />
          </div>
          <select 
            value={branchFilter} 
            onChange={(e)=>{setBranchFilter(e.target.value); loadSubjectGroups(1);}} 
            className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-teal-500 outline-none"
          >
            <option value="all">All Branches</option>
            {allBranches.map(branch => (
              <option key={branch._id} value={branch.title}>{branch.title}</option>
            ))}
          </select>
          <select 
            value={semesterFilter} 
            onChange={(e)=>{setSemesterFilter(e.target.value); loadSubjectGroups(1);}} 
            className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-teal-500 outline-none"
          >
            <option value="all">All Semesters</option>
            {[1,2,3,4,5,6,7,8].map(sem => (
              <option key={sem} value={sem}>Semester {sem}</option>
            ))}
          </select>
          <button 
            onClick={()=>loadSubjectGroups(1)} 
            className="px-6 py-3 bg-teal-600 hover:bg-teal-700 rounded-xl text-white font-semibold"
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      ) : subjectGroups.length === 0 ? (
        <div className="text-center py-12 text-gray-400">No subject groups found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjectGroups.map((group) => (
            <motion.div 
              key={group._id} 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden hover:border-teal-500/50 transition-colors"
            >
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-teal-500/20 rounded-lg text-teal-400">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-lg">
                      {group.branch?.title || group.branch}
                    </h3>
                    <p className="text-sm text-gray-400">Semester {group.semester}</p>
                  </div>
                </div>
                
                <div className="text-sm text-gray-400">
                  <span className="font-semibold">{group.subjects?.length || 0}</span> subjects
                </div>
                
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {group.subjects?.slice(0, 5).map((subject, idx) => (
                    <div key={idx} className="text-sm text-gray-300 truncate">
                      • {subject.name}
                    </div>
                  ))}
                  {group.subjects?.length > 5 && (
                    <div className="text-sm text-teal-400">
                      +{group.subjects.length - 5} more
                    </div>
                  )}
                </div>
                
                <div className="pt-3 border-t border-gray-700 flex items-center justify-end gap-2">
                  <button 
                    onClick={() => openView(group)} 
                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4 text-blue-400"/>
                  </button>
                  <button 
                    onClick={() => openEdit(group)} 
                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4 text-green-400"/>
                  </button>
                  <button 
                    onClick={() => handleDelete(group._id)} 
                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-400"/>
                  </button>
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
            onClick={()=>loadSubjectGroups(page-1)} 
            className="px-4 py-2 bg-gray-800 disabled:opacity-50 hover:bg-gray-700 text-white rounded-lg border border-gray-700"
          >
            Prev
          </button>
          <span className="text-gray-400">Page {page} / {pages}</span>
          <button 
            disabled={page>=pages} 
            onClick={()=>loadSubjectGroups(page+1)} 
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
                  {modalMode === 'add' ? 'Add Subject Group' : modalMode === 'edit' ? 'Edit Subject Group' : 'Subject Group Details'}
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
                      <label className="text-sm text-gray-400">Branch</label>
                      <p className="text-white text-lg font-semibold">{selected?.branch?.title || selected?.branch}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Semester</label>
                      <p className="text-white text-lg font-semibold">Semester {selected?.semester}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Subjects ({selected?.subjects?.length || 0})</label>
                      <div className="mt-2 space-y-2">
                        {selected?.subjects?.map((subject, idx) => (
                          <div key={idx} className="p-3 bg-gray-700 rounded-lg">
                            <p className="text-white font-semibold">{subject.name}</p>
                            {subject.link && (
                              <a href={subject.link} className="text-teal-400 text-sm hover:underline" target="_blank" rel="noreferrer">
                                {subject.link}
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Branch <span className="text-red-400">*</span>
                        </label>
                        <select
                          required 
                          value={formData.branch} 
                          onChange={(e)=>setFormData({...formData, branch: e.target.value})} 
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-teal-500 outline-none"
                        >
                          <option value="">Select Branch</option>
                          {allBranches.map(branch => (
                            <option key={branch._id} value={branch._id}>{branch.title}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Semester <span className="text-red-400">*</span>
                        </label>
                        <select
                          required 
                          value={formData.semester} 
                          onChange={(e)=>setFormData({...formData, semester: e.target.value})} 
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-teal-500 outline-none"
                        >
                          <option value="">Select Semester</option>
                          {[1,2,3,4,5,6,7,8].map(sem => (
                            <option key={sem} value={sem}>Semester {sem}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-300">
                          Subjects <span className="text-red-400">*</span>
                        </label>
                        <button 
                          type="button"
                          onClick={addSubject}
                          className="text-teal-400 hover:text-teal-300 text-sm flex items-center gap-1"
                        >
                          <Plus className="w-4 h-4" /> Add Subject
                        </button>
                      </div>
                      
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {formData.subjects.map((subject, idx) => (
                          <div key={idx} className="p-3 bg-gray-700 rounded-lg space-y-2">
                            <div className="flex items-start gap-2">
                              <input 
                                type="text" 
                                required
                                value={subject.name} 
                                onChange={(e)=>updateSubject(idx, 'name', e.target.value)} 
                                placeholder="Subject name"
                                className="flex-1 px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:ring-2 focus:ring-teal-500 outline-none text-sm" 
                              />
                              <button 
                                type="button"
                                onClick={()=>removeSubject(idx)}
                                className="p-2 text-red-400 hover:bg-gray-600 rounded-lg"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <input 
                              type="text" 
                              value={subject.link} 
                              onChange={(e)=>updateSubject(idx, 'link', e.target.value)} 
                              placeholder="Link (optional)"
                              className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:ring-2 focus:ring-teal-500 outline-none text-sm" 
                            />
                          </div>
                        ))}
                      </div>
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
                        className="flex-1 px-4 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold"
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

export default AdminSubjects;
