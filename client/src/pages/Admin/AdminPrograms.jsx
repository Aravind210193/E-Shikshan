import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Edit, Trash2, Eye, X, BookMarked } from "lucide-react";
import { toast } from "react-hot-toast";
import { adminProgramAPI } from "../../services/adminApi";

const emptyForm = {
  programKey: "",
  name: "",
  semesters: {},
};

const AdminPrograms = () => {
  const [programs, setPrograms] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selected, setSelected] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const loadPrograms = async (p = 1) => {
    try {
      setLoading(true);
      const params = { page: p, limit: 12 };
      if (searchQuery) params.search = searchQuery;
      
      const res = await adminProgramAPI.getAll(params);
      if (res.data.success) {
        setPrograms(res.data.data);
        setPage(res.data.page);
        setPages(res.data.pages);
      }
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to fetch programs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrograms(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openAdd = () => {
    setModalMode("add");
    setFormData(emptyForm);
    setShowModal(true);
  };

  const openEdit = (program) => {
    setModalMode("edit");
    setSelected(program);
    setFormData({
      programKey: program.programKey,
      name: program.name,
      semesters: program.semesters || {},
    });
    setShowModal(true);
  };

  const openView = (program) => {
    setModalMode("view");
    setSelected(program);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this program? This cannot be undone.")) return;
    try {
      await adminProgramAPI.delete(id);
      toast.success("Program deleted");
      loadPrograms(page);
    } catch (e) {
      toast.error(e.response?.data?.message || "Delete failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === "add") {
        await adminProgramAPI.create(formData);
        toast.success("Program created");
      } else if (modalMode === "edit" && selected) {
        await adminProgramAPI.update(selected._id, formData);
        toast.success("Program updated");
      }
      setShowModal(false);
      loadPrograms(page);
    } catch (e) {
      toast.error(e.response?.data?.message || "Save failed");
    }
  };

  const getSemesterCount = (semesters) => {
    if (!semesters) return 0;
    return Object.keys(semesters).length;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Programs</h1>
          <p className="text-gray-400">Manage academic programs and semester data</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }} 
          whileTap={{ scale: 0.95 }} 
          onClick={openAdd} 
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold flex items-center gap-2 shadow-lg"
        >
          <Plus className="w-5 h-5"/> Add Program
        </motion.button>
      </div>

      <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search programs" 
              value={searchQuery} 
              onChange={(e)=>setSearchQuery(e.target.value)} 
              onKeyDown={(e)=> e.key==='Enter' && loadPrograms(1)} 
              className="w-full pl-12 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none" 
            />
          </div>
          <button 
            onClick={()=>loadPrograms(1)} 
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-semibold"
          >
            Search
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      ) : programs.length === 0 ? (
        <div className="text-center py-12 text-gray-400">No programs found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program) => (
            <motion.div 
              key={program._id} 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden hover:border-blue-500/50 transition-colors"
            >
              <div className="p-5 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                    <BookMarked className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-lg">{program.name}</h3>
                    <p className="text-sm text-gray-400">{program.programKey}</p>
                  </div>
                </div>
                
                <div className="text-sm text-gray-400">
                  <span className="font-semibold">{getSemesterCount(program.semesters)}</span> semesters
                </div>
                
                <div className="pt-3 border-t border-gray-700 flex items-center justify-end gap-2">
                  <button 
                    onClick={() => openView(program)} 
                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4 text-blue-400"/>
                  </button>
                  <button 
                    onClick={() => openEdit(program)} 
                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4 text-green-400"/>
                  </button>
                  <button 
                    onClick={() => handleDelete(program._id)} 
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
            onClick={()=>loadPrograms(page-1)} 
            className="px-4 py-2 bg-gray-800 disabled:opacity-50 hover:bg-gray-700 text-white rounded-lg border border-gray-700"
          >
            Prev
          </button>
          <span className="text-gray-400">Page {page} / {pages}</span>
          <button 
            disabled={page>=pages} 
            onClick={()=>loadPrograms(page+1)} 
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
                  {modalMode === 'add' ? 'Add Program' : modalMode === 'edit' ? 'Edit Program' : 'Program Details'}
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
                      <label className="text-sm text-gray-400">Program Key</label>
                      <p className="text-white text-lg font-mono bg-gray-700 px-3 py-2 rounded-lg">{selected?.programKey}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Program Name</label>
                      <p className="text-white text-lg font-semibold">{selected?.name}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Semesters ({getSemesterCount(selected?.semesters)})</label>
                      <div className="mt-2 space-y-2 max-h-96 overflow-y-auto">
                        {selected?.semesters && Object.entries(selected.semesters).map(([key, data]) => (
                          <div key={key} className="p-3 bg-gray-700 rounded-lg">
                            <p className="text-white font-semibold mb-2">{key}</p>
                            <pre className="text-xs text-gray-300 overflow-x-auto">
                              {JSON.stringify(data, null, 2)}
                            </pre>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Program Key <span className="text-red-400">*</span>
                      </label>
                      <input 
                        type="text" 
                        required 
                        value={formData.programKey} 
                        onChange={(e)=>setFormData({...formData, programKey: e.target.value})} 
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white font-mono focus:ring-2 focus:ring-blue-500 outline-none" 
                        placeholder="e.g., btech_cse"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Program Name <span className="text-red-400">*</span>
                      </label>
                      <input 
                        type="text" 
                        required 
                        value={formData.name} 
                        onChange={(e)=>setFormData({...formData, name: e.target.value})} 
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500 outline-none" 
                        placeholder="e.g., B.Tech Computer Science & Engineering"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Semester Data (JSON)
                      </label>
                      <textarea 
                        value={JSON.stringify(formData.semesters, null, 2)} 
                        onChange={(e)=>{
                          try {
                            const parsed = JSON.parse(e.target.value);
                            setFormData({...formData, semesters: parsed});
                          } catch (err) {
                            // Invalid JSON, ignore
                          }
                        }} 
                        rows="12"
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                        placeholder='{"1": {"subjects": [...]}}'
                      />
                      <p className="text-xs text-gray-400 mt-1">Enter semester data in JSON format</p>
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
                        className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold"
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

export default AdminPrograms;
