import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Edit, Trash2, Eye, FileText, Link2, Tag, X } from "lucide-react";
import { toast } from "react-hot-toast";
import ConfirmationModal from "../../components/Admin/ConfirmationModal";
import semesterData from "../../data/semesterData.json";
import courseModulesData from "../../data/courseModulesData.json";
import semesterDataMedical from "../../data/semesterDataMedical.json";
import completeCseData from "../../data/complete_cse_data.json";

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
  const [allItems, setAllItems] = useState([]); // Store all processed items locally
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selected, setSelected] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Process and Normalize Data from JSONs on Mount
  useEffect(() => {
    const processed = [];
    let idCounter = 1;

    const addItem = (item) => {
      processed.push({
        _id: `local-${idCounter++}`,
        status: 'published',
        createdAt: new Date().toISOString(),
        ...item
      });
    };

    // 1. Semester Data (General)
    if (semesterData['10th-grade']) {
      const gd = semesterData['10th-grade'];
      Object.entries(gd.semesters || {}).forEach(([semKey, semVal]) => {
        (semVal.subjects || []).forEach(subj => {
          // Generic, NCERT, State
          ['10th-grade', 'ncert', 'state'].forEach(br => {
            const suffix = br === 'ncert' ? ' (NCERT)' : br === 'state' ? ' (State Board)' : '';
            addItem({ title: subj.name + suffix, type: 'subject', branch: br, semester: semKey, category: 'School', subject: subj.name });

            if (subj.units) {
              subj.units.forEach(unit => {
                if (unit.videos) unit.videos.forEach(v => addItem({ title: v.title + suffix, type: 'video', branch: br, semester: semKey, category: 'School', subject: subj.name, url: v.url }));
                if (unit.pdfs) unit.pdfs.forEach(p => addItem({ title: p.title + suffix, type: 'pdf', branch: br, semester: semKey, category: 'School', subject: subj.name, url: p.url }));
              });
            }
          });
        });
      });
    }

    // UG/PG/Intermediate from SemesterData
    if (semesterData.branches) {
      Object.entries(semesterData.branches).forEach(([brKey, brVal]) => {
        Object.entries(brVal.semesters || {}).forEach(([semKey, semVal]) => {
          (semVal.subjects || []).forEach(subj => {
            addItem({ title: subj.name, type: 'subject', branch: brKey, semester: semKey, category: 'UG', subject: subj.code });
            if (subj.units) {
              subj.units.forEach(unit => {
                if (unit.videos) unit.videos.forEach(v => addItem({ title: v.title, type: 'video', branch: brKey, semester: semKey, category: 'UG', subject: subj.code, url: v.url }));
                if (unit.pdfs) unit.pdfs.forEach(p => addItem({ title: p.title, type: 'pdf', branch: brKey, semester: semKey, category: 'UG', subject: subj.code, url: p.url }));
              });
            }
          });
        });
      });
    }

    // Medical Data
    if (semesterDataMedical.branches) {
      Object.entries(semesterDataMedical.branches).forEach(([brKey, brVal]) => {
        const brName = brKey; // e.g. mbbs-anatomy
        if (brVal.semesters) {
          Object.entries(brVal.semesters).forEach(([semKey, semVal]) => {
            (semVal.subjects || []).forEach(subj => {
              addItem({ title: subj.name, type: 'subject', branch: brName, semester: semKey, category: 'Medical', subject: subj.code });
              if (subj.videos) subj.videos.forEach(v => addItem({ title: v.title, type: 'video', branch: brName, semester: semKey, category: 'Medical', subject: subj.code, url: v.url }));
              if (subj.pdfs) subj.pdfs.forEach(p => addItem({ title: p.title, type: 'pdf', branch: brName, semester: semKey, category: 'Medical', subject: subj.code, url: p.url }));
            });
          });
        }
      });
    }

    // Course Modules Data
    const processModules = (cat, courses, brName) => {
      if (!courses) return;
      courses.forEach(c => {
        addItem({ title: c.title, type: 'subject', branch: brName, semester: '1', category: cat, subject: c.courseCode });
        if (c.modules) {
          c.modules.forEach(m => {
            if (m.videos) m.videos.forEach(v => addItem({ title: v.title, type: 'video', branch: brName, semester: '1', category: cat, subject: c.courseCode, url: v.url }));
            if (m.resources) m.resources.forEach(r => addItem({ title: r.title, type: 'pdf', branch: brName, semester: '1', category: cat, subject: c.courseCode, url: r.url }));
          });
        }
      });
    };

    if (courseModulesData.undergraduate) Object.entries(courseModulesData.undergraduate).forEach(([k, v]) => processModules('UG', v.courses, v.branch || k));
    if (courseModulesData.postgraduate) Object.entries(courseModulesData.postgraduate).forEach(([k, v]) => processModules('PG', v.courses, v.branch || k));
    if (courseModulesData.medical) Object.entries(courseModulesData.medical).forEach(([k, v]) => processModules('Medical', v.courses, v.branch || k));


    setAllItems(processed);
    setItems(processed.slice(0, 50)); // Initial load
  }, []);

  const loadData = (p = 1, cat, br, sem) => {
    setLoading(true);
    // Use passed args or fallback to state
    const c = cat !== undefined ? cat : filterLevel;
    const b = br !== undefined ? br : filterBranch;
    const s = sem !== undefined ? sem : filterSemester;

    let filtered = allItems;

    if (c) {
      if (c === '10th') filtered = filtered.filter(i => i.category === 'School');
      else if (c === 'medical') filtered = filtered.filter(i => i.category === 'Medical');
      else if (c === 'ug') filtered = filtered.filter(i => i.category === 'UG');
      else if (c === 'pg') filtered = filtered.filter(i => i.category === 'PG');
      else if (c === 'intermediate') filtered = filtered.filter(i => i.category === 'Intermediate');
    }

    if (b) {
      // specific branch filter
      // For 10th: ncert, state
      filtered = filtered.filter(i => i.branch && i.branch.toLowerCase().includes(b.toLowerCase()));
    }

    if (s) {
      filtered = filtered.filter(i => i.semester == s);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(i => i.title.toLowerCase().includes(q) || (i.subject && i.subject.toLowerCase().includes(q)));
    }

    setItems(filtered);
    setLoading(false);
  };

  const confirmDelete = (id) => {
    setItemToDelete(id);
    setShowConfirmDelete(true);
  };

  const handleDelete = () => {
    if (!itemToDelete) return;
    const newAll = allItems.filter(i => i._id !== itemToDelete);
    setAllItems(newAll);
    setItems(items.filter(i => i._id !== itemToDelete));
    toast.success("Deleted from view (local only)");
    setShowConfirmDelete(false);
    setItemToDelete(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (modalMode === 'add') {
      const newItem = {
        ...formData,
        _id: `local-new-${Date.now()}`,
        createdAt: new Date().toISOString()
      };
      setAllItems([newItem, ...allItems]);
      setItems([newItem, ...items]);
      toast.success("Added locally");
    } else {
      // Edit
      const updated = allItems.map(i => i._id === selected._id ? { ...i, ...formData } : i);
      setAllItems(updated);
      setItems(items.map(i => i._id === selected._id ? { ...i, ...formData } : i));
      toast.success("Updated locally");
    }
    setShowModal(false);
  };

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


  const [filterLevel, setFilterLevel] = useState("");
  const [filterBranch, setFilterBranch] = useState("");
  const [filterSemester, setFilterSemester] = useState("");
  const [filterSubject, setFilterSubject] = useState("");

  const updateFilter = (key, val) => {
    let newLevel = filterLevel;
    let newBranch = filterBranch;
    let newSem = filterSemester;
    let newSub = filterSubject;

    if (key === 'level') {
      newLevel = val;
      newBranch = ""; // Reset child
      newSem = "";
      newSub = "";
      setFilterLevel(val);
      setFilterBranch("");
      setFilterSemester("");
      setFilterSubject("");
    } else if (key === 'branch') {
      newBranch = val;
      newSem = "";
      newSub = "";
      setFilterBranch(val);
      setFilterSemester("");
      setFilterSubject("");
    } else if (key === 'semester') {
      newSem = val;
      setFilterSemester(val);
    }

    // Trigger load data with new params
    loadData(1, newLevel, newBranch, newSem);
  }

  const getBranches = () => {
    if (filterLevel === 'ug') return [
      { value: 'computer-science--engineering', label: 'CSE' },
      { value: 'electronics--communication', label: 'ECE' },
      { value: 'mechanical-engineering', label: 'Mech' },
      { value: 'civil-engineering', label: 'Civil' }
    ];
    if (filterLevel === 'pg') return [
      { value: 'mba', label: 'MBA' },
      { value: 'mtech', label: 'M.Tech' },
      { value: 'mtech-cse', label: 'M.Tech CSE' }
    ];
    if (filterLevel === 'medical') return [
      { value: 'mbbs-anatomy', label: 'MBBS - Anatomy' },
      { value: 'mbbs-physiology', label: 'MBBS - Physiology' },
      { value: 'mbbs-biochemistry', label: 'MBBS - Biochemistry' },
      { value: 'general-medicine', label: 'General Medicine' }
    ];
    if (filterLevel === 'intermediate') return [
      { value: 'mpc', label: 'MPC' },
      { value: 'bipc', label: 'BiPC' }
    ];
    if (filterLevel === '10th') return [
      { value: 'ncert', label: 'NCERT' },
      { value: 'state', label: 'State Board' }
    ];
    return [];
  };

  const getSemesters = () => {
    if (filterLevel === 'ug') return ['1', '2', '3', '4', '5', '6', '7', '8'];
    if (filterLevel === 'pg') return ['1', '2', '3', '4'];
    if (filterLevel === 'medical') return ['1', '2', '3', '4'];
    if (filterLevel === 'intermediate') return ['1', '2'];
    if (filterLevel === '10th') return ['1', '2']; // Terms
    return [];
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Content</h1>
          <p className="text-gray-400">Manage PDFs, videos, articles, and links</p>
        </div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={openAdd} className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold flex items-center gap-2 shadow-lg">
          <Plus className="w-5 h-5" /> Add Content
        </motion.button>
      </div>

      <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
        <div className="flex flex-col md:flex-row gap-4 items-center flex-wrap">
          <div className="flex-1 relative min-w-[200px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && loadData(1, filterLevel, filterBranch, filterSemester)} className="w-full pl-12 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-teal-500 outline-none" />
          </div>

          {/* Level Filter */}
          <select value={filterLevel} onChange={(e) => updateFilter('level', e.target.value)} className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-teal-500 outline-none">
            <option value="">All Levels</option>
            <option value="10th">10th Grade</option>
            <option value="intermediate">Intermediate</option>
            <option value="ug">UG (Engineering)</option>
            <option value="pg">PG (M.Tech/MBA)</option>
            <option value="medical">Medical (MBBS)</option>
          </select>

          {/* Dynamic Branch Filter */}
          {getBranches().length > 0 && (
            <select value={filterBranch} onChange={(e) => updateFilter('branch', e.target.value)} className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-teal-500 outline-none">
              <option value="">{filterLevel === '10th' ? 'All Boards' : 'All Branches'}</option>
              {getBranches().map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
            </select>
          )}

          {/* Dynamic Semester Filter */}
          {(filterBranch || filterLevel === '10th') && getSemesters().length > 0 && (
            <select value={filterSemester} onChange={(e) => updateFilter('semester', e.target.value)} className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-teal-500 outline-none">
              <option value="">All Semesters</option>
              {getSemesters().map(s => <option key={s} value={s}>Sem {s}</option>)}
            </select>
          )}

          <button onClick={() => loadData(1, filterLevel, filterBranch, filterSemester)} className="px-4 py-3 bg-teal-600 hover:bg-teal-700 rounded-xl text-white font-bold">Filter</button>
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

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-700">
                <button onClick={() => openView(item)} className="p-2 hover:bg-gray-700 rounded-lg text-blue-400"><Eye className="w-4 h-4" /></button>
                <button onClick={() => openEdit(item)} className="p-2 hover:bg-gray-700 rounded-lg text-yellow-400"><Edit className="w-4 h-4" /></button>
                <button onClick={() => confirmDelete(item._id)} className="p-2 hover:bg-gray-700 rounded-lg text-red-400"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {items.length === 0 && !loading && (
        <div className="text-center py-12 text-gray-400">No content found</div>
      )}

      {/* Modal and other UI elements remain the same */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-gray-800 rounded-2xl border border-gray-700 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              {/* ... modal content ... */}
              <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-5 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">{modalMode === 'add' ? 'Add Content' : modalMode === 'edit' ? 'Edit Content' : 'Content Details'}</h2>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-700 rounded-lg"><X className="w-5 h-5 text-gray-400" /></button>
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
                    <div><span className="text-gray-400 text-sm">Tags</span><p className="text-white">{(selected?.tags || []).join(', ')}</p></div>
                    <div><span className="text-gray-400 text-sm">Description</span><p className="text-white whitespace-pre-line">{selected?.description}</p></div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Form fields same as before but removed handleSubmit dependency heavily on API */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-400">Title</label>
                        <input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white" />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">Type</label>
                        <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white">
                          <option value="pdf">PDF</option>
                          <option value="video">Video</option>
                          <option value="article">Article</option>
                          <option value="link">Link</option>
                          <option value="subject">Subject</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">Branch</label>
                        <input value={formData.branch} onChange={(e) => setFormData({ ...formData, branch: e.target.value })} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white" />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">Semester</label>
                        <input value={formData.semester} onChange={(e) => setFormData({ ...formData, semester: e.target.value })} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white" />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">Subject</label>
                        <input value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white" />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">Category</label>
                        <input value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-sm text-gray-400">URL</label>
                        <input value={formData.url} onChange={(e) => setFormData({ ...formData, url: e.target.value })} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-sm text-gray-400">Tags (comma-separated)</label>
                        <input value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-sm text-gray-400">Description</label>
                        <textarea rows={4} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white" />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button type="button" onClick={() => setShowModal(false)} className="px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl text-white">Cancel</button>
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

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        onConfirm={handleDelete}
        title="Delete Content"
        message="Are you sure you want to delete this content? This action will remove it from your current view (local only, not saved to backend)."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};


export default AdminContent;
