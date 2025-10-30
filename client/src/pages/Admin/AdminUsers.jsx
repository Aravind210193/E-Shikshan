import React, { useEffect, useState } from "react";
import { Search, Eye, CheckCircle, XCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import { adminAPI } from "../../services/api";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState(""); // '', 'student', 'faculty', 'admin'

  const [detailsModal, setDetailsModal] = useState({ open: false, data: null });

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, roleFilter]);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError("");
    try {
      const params = { page, limit };
      if (searchQuery) params.search = searchQuery;
      if (roleFilter) params.role = roleFilter;

      const res = await adminAPI.getAllUsers(params);
      setUsers(res.data.users || []);
      const p = res.data.pagination || {};
      setPages(p.pages || 1);
      setTotal(p.total || 0);
    } catch (err) {
      console.error("Failed to fetch users", err);
      setError("Failed to load users from server");
      toast.error("Failed to load users from server");
    } finally {
      setIsLoading(false);
    }
  };

  const searchNow = () => {
    setPage(1);
    fetchUsers();
  };

  const openUserDetails = async (userId) => {
    try {
      const res = await adminAPI.getUserById(userId);
      setDetailsModal({ open: true, data: res.data });
    } catch (err) {
      console.error("Failed to fetch user details", err);
      toast.error("Failed to load user details");
    }
  };

  return (
    <div>
      {/* ...existing code before modal... */}
      {/* Example: List of users, search bar, etc. */}
      {/* Modal rendering block, ensure all fragments are wrapped and closed properly */}
      {/* Replace the following with your actual modal logic, this is a template fix: */}
      {showModal && (
        <div>
          <AnimatePresence>
            <motion.div>
              <div>
                <form>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Enter email address"
                  />
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Role *</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="Student">Student</option>
                      <option value="Premium">Premium</option>
                      <option value="Instructor">Instructor</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Status *</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2"
                    >
                      <Save className="w-5 h-5" />
                      {modalMode === "add" ? "Add User" : "Update User"}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-semibold"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}
      {/* ...existing code after modal... */}
    </div>
  );
};

export default AdminUsers;
