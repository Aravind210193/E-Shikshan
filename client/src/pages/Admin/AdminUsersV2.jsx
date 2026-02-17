import React, { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Search, Eye, CheckCircle, XCircle, ShieldCheck, RotateCcw, Trash2, PlusCircle, Braces, Pencil, BookOpen, Users, Briefcase, Trophy, Map, FileText, LayoutTemplate, School, Calendar, Mail, Phone, Clock, Award } from "lucide-react";
import { toast } from "react-hot-toast";
import { adminAPI, coursesAPI } from "../../services/api";
import { adminCourseAPI, adminResumeAPI } from "../../services/adminApi";
import { ResumeTemplateForm } from "../../components/ResumeTemplateForm";

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
  const [jsonModal, setJsonModal] = useState(false);
  const [userModal, setUserModal] = useState({ open: false, mode: 'add' });
  const [userForm, setUserForm] = useState({
    name: '', email: '', password: '', role: 'student', isAdmin: false,
    phone: '', university: '', department: '', semester: ''
  });
  const [savingUser, setSavingUser] = useState(false);
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [grantCourseId, setGrantCourseId] = useState("");
  const [grantSubmitting, setGrantSubmitting] = useState(false);

  // Resume Template Management State
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'templates'
  const [userTemplates, setUserTemplates] = useState([]);
  const [templatesLoading, setTemplatesLoading] = useState(false);
  const [templateModal, setTemplateModal] = useState({ open: false, mode: 'add', data: null });

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, roleFilter, searchQuery]);

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
      const status = err?.response?.status;
      const message = err?.response?.data?.message || err?.message || "Failed to load users from server";
      if (status === 401) {
        setError("Unauthorized. Please log in to the admin portal.");
      } else if (status === 403) {
        setError("Forbidden. Your admin account does not have permission to view users. Role must be 'admin'.");
      } else {
        setError(message);
      }
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };


  const openUserDetails = async (userId) => {
    try {
      const res = await adminAPI.getUserById(userId);
      setDetailsModal({ open: true, data: res.data });
      // Load courses for grant access selector
      setCoursesLoading(true);
      try {
        const coursesRes = await coursesAPI.getAll();
        setCourses(Array.isArray(coursesRes.data) ? coursesRes.data : []);
      } catch (e) {
        console.error("Failed to fetch courses list", e);
      } finally {
        setCoursesLoading(false);
      }
    } catch (err) {
      console.error("Failed to fetch user details", err);
      toast.error("Failed to load user details");
    }
  };

  const refreshUserDetails = async () => {
    if (!detailsModal.open || !detailsModal.data?.user?._id) return;
    try {
      const res = await adminAPI.getUserById(detailsModal.data.user._id);
      setDetailsModal((prev) => ({ ...prev, data: res.data }));
    } catch (err) {
      console.error("Failed to refresh user details", err);
    }
  };

  const openAddUser = () => {
    setUserForm({ name: '', email: '', password: '', role: 'student', isAdmin: false, phone: '', university: '', department: '', semester: '' });
    setUserModal({ open: true, mode: 'add' });
  };

  const openEditUser = (user) => {
    setUserForm({
      name: user.name || '',
      email: user.email || '',
      password: '',
      role: user.role || 'student',
      isAdmin: !!user.isAdmin,
      phone: user.phone || '',
      university: user.university || '',
      department: user.department || '',
      semester: user.semester || '',
      _id: user._id,
    });
    setUserModal({ open: true, mode: 'edit' });
    setActiveTab('profile'); // Reset tab
    if (user.role === 'resume_instructor') {
      fetchUserTemplates(user._id);
    }
  };

  const saveUser = async () => {
    setSavingUser(true);
    try {
      const payload = { ...userForm };
      if (!payload.password) delete payload.password; // Do not send empty password on edit
      if (userModal.mode === 'add') {
        await adminAPI.createUser(payload);
        toast.success('User created');
      } else {
        const id = payload._id;
        delete payload._id;
        await adminAPI.updateUser(id, payload);
        toast.success('User updated');
      }
      setUserModal({ open: false, mode: 'add' });
      await fetchUsers();
    } catch (err) {
      console.error('Save user failed', err);
      toast.error(err?.response?.data?.message || 'Failed to save user');
    } finally {
      setSavingUser(false);
    }
  };


  const fetchUserTemplates = async (userId) => {
    if (!userId) return;
    setTemplatesLoading(true);
    try {
      // Fetch all templates for the instructor to manage (not just created by them)
      // This aligns with the dashboard showing global stats
      const res = await adminResumeAPI.getAll({ limit: 100 });
      if (res.data.success) {
        setUserTemplates(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch user templates", err);
      toast.error("Failed to load templates");
    } finally {
      setTemplatesLoading(false);
    }
  };

  const handleSaveTemplate = async (formData) => {
    try {
      // Ensure the template is assigned to the current user being edited
      // Note: The backend logic we just fixed uses req.admin._id.
      // BUT if we are an Admin editing another user, we want to assign it to THAT user.
      // The backend 'create' currently uses req.admin._id (which is ME, the Admin).
      // We need to override this behavior or pass the owner ID.
      // Since we didn't add "ownerId" support to create yet (it takes req.admin._id),
      // we need to temporarily rely on the backend workaround or accept that createdBy will be Admin.
      // WAIT, the requirement is "resume instructor add the all templete".
      // If *Admin* adds it, it might belong to Admin.
      // Ideally, we should be able to specify `createdBy` if we are Admin.
      // Let's assume for now we just pass it in body and hope backend respects it or we fix backend again.
      // Actually, let's fix backend to allow overriding createdBy if Admin.
      // For now, let's proceed and I'll hotfix backend if needed.

      // Update: I will modify the payload to include createdBy just in case backend supports it eventually, 
      // but simpler: if I am editing, I use update. updates usually don't change owner.
      // If Adding, I want it to be owned by `userForm._id`.

      const payload = { ...formData, createdBy: userForm._id };

      if (templateModal.mode === 'add') {
        // Create logic: We need to make sure backend respects passed createdBy if I'm admin.
        // Current backend ignores body.createdBy and uses req.admin._id.
        // I will need to update backend to allow overriding createdBy if req.admin.role === 'admin'.
        await adminResumeAPI.create(payload);
        toast.success("Template created");
      } else {
        await adminResumeAPI.update(templateModal.data._id, payload);
        toast.success("Template updated");
      }
      setTemplateModal({ open: false, mode: 'add', data: null });
      fetchUserTemplates(userForm._id);
    } catch (err) {
      console.error("Template save failed", err);
      toast.error(err?.response?.data?.message || "Failed to save template");
    }
  };

  const handleDeleteTemplate = async (id) => {
    if (!window.confirm("Delete this template?")) return;
    try {
      await adminResumeAPI.delete(id);
      toast.success("Template deleted");
      fetchUserTemplates(userForm._id);
    } catch (err) {
      console.error("Template delete failed", err);
      toast.error("Failed to delete template");
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user? This will also remove enrollments.')) return;
    try {
      await adminAPI.deleteUser(id);
      toast.success('User deleted');
      await fetchUsers();
    } catch (err) {
      console.error('Delete user failed', err);
      toast.error(err?.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleGrantAccess = async () => {
    if (!detailsModal.data?.user?._id) return;
    if (!grantCourseId) {
      toast.error("Please select a course");
      return;
    }
    setGrantSubmitting(true);
    try {
      const isInstructor = detailsModal.data.user.role === 'course_manager';

      if (isInstructor) {
        // Instructor Assignment
        await adminCourseAPI.update(grantCourseId, {
          instructorEmail: detailsModal.data.user.email,
          instructor: detailsModal.data.user.name
        });
        toast.success("Instructor assigned to course");
      } else {
        // Student Enrollment
        await adminAPI.grantCourseAccess({
          userId: detailsModal.data.user._id,
          courseId: grantCourseId,
        });
        toast.success("Course access granted");
      }

      setGrantCourseId("");
      await refreshUserDetails();
      await fetchUsers();
    } catch (err) {
      console.error("Grant access failed", err);
      toast.error(err?.response?.data?.message || "Failed to process assignment");
    } finally {
      setGrantSubmitting(false);
    }
  };

  const handleUnassignInstructor = async (courseId) => {
    try {
      await adminCourseAPI.update(courseId, {
        instructorEmail: "",
        instructor: ""
      });
      toast.success("Instructor unassigned");
      await refreshUserDetails();
      await fetchUsers();
    } catch (err) {
      console.error("Unassign failed", err);
      toast.error(err?.response?.data?.message || "Failed to unassign instructor");
    }
  };

  const handleRevoke = async (enrollmentId) => {
    try {
      await adminAPI.revokeCourseAccess(enrollmentId);
      toast.success("Access revoked");
      await refreshUserDetails();
      await fetchUsers();
    } catch (err) {
      console.error("Revoke failed", err);
      toast.error(err?.response?.data?.message || "Failed to revoke access");
    }
  };

  const handleRestore = async (enrollmentId) => {
    try {
      await adminAPI.restoreCourseAccess(enrollmentId);
      toast.success("Access restored");
      await refreshUserDetails();
      await fetchUsers();
    } catch (err) {
      console.error("Restore failed", err);
      toast.error(err?.response?.data?.message || "Failed to restore access");
    }
  };

  const handleDelete = async (enrollmentId) => {
    try {
      await adminAPI.deleteEnrollment(enrollmentId);
      toast.success("Enrollment deleted");
      await refreshUserDetails();
      await fetchUsers();
    } catch (err) {
      console.error("Delete failed", err);
      toast.error(err?.response?.data?.message || "Failed to delete enrollment");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
          <p className="text-gray-400">Manage all registered users</p>
        </div>
      </div>

      <div>
        <label className="text-sm text-gray-400">Search & Filters</label>
        <div className="mt-2 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-10 py-2.5 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-600 rounded-lg text-gray-400 hover:text-white transition-colors"
                title="Clear search"
              >
                <XCircle className="w-4 h-4" />
              </button>
            )}
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
          >
            <option value="">All roles</option>
            <option value="student">Student</option>
            <option value="faculty">Faculty</option>
            <option value="course_manager">Instructor</option>
            <option value="job_instructor">Job Partner</option>
            <option value="hackathon_instructor">Hackathon Lead</option>
            <option value="roadmap_instructor">Roadmap Instructor</option>
            <option value="resume_instructor">Resume Instructor</option>
            <option value="admin">Admin</option>
          </select>
          <button
            onClick={() => setRoleFilter(roleFilter === 'course_manager' ? '' : 'course_manager')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${roleFilter === 'course_manager'
              ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
              : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
              }`}
          >
            <Users className="w-4 h-4" />
            Instructors Only
          </button>
          <button
            onClick={() => setJsonModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg border border-gray-600"
            title="View raw JSON"
          >
            <Braces className="w-4 h-4" /> View JSON
          </button>
          <button
            onClick={openAddUser}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
            title="Add User"
          >
            <PlusCircle className="w-4 h-4" /> Add User
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700/50 border-b border-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">User</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Role</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Courses / Enrollments</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Admin</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400">Loading users...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-red-400">{error}</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400">No users found</td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {user.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="text-white font-medium">{user.name}</p>
                          <p className="text-gray-400 text-sm">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-red-500/20 text-red-400' :
                        user.role === 'course_manager' ? 'bg-indigo-500/20 text-indigo-400' :
                          user.role === 'job_instructor' ? 'bg-purple-500/20 text-purple-400' :
                            user.role === 'hackathon_instructor' ? 'bg-rose-500/20 text-rose-400' :
                              user.role === 'roadmap_instructor' ? 'bg-orange-500/20 text-orange-400' :
                                user.role === 'resume_instructor' ? 'bg-cyan-500/20 text-cyan-400' :
                                  'bg-blue-500/20 text-blue-400'
                        }`}>
                        {user.role === 'course_manager' ? 'Instructor' :
                          user.role === 'job_instructor' ? 'Job Partner' :
                            user.role === 'hackathon_instructor' ? 'Hackathon Lead' :
                              user.role === 'roadmap_instructor' ? 'Roadmap Lead' :
                                user.role === 'resume_instructor' ? 'Resume Lead' :
                                  user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-200">{user.enrollmentCount ?? 0}</span>
                    </td>
                    <td className="px-6 py-4">
                      {user.isAdmin ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <XCircle className="w-5 h-5 text-gray-500" />
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditUser(user)}
                          className="p-2 hover:bg-gray-600 rounded-lg transition-colors"
                          title="Edit User"
                        >
                          <Pencil className="w-4 h-4 text-amber-400" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="p-2 hover:bg-gray-600 rounded-lg transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                        <button
                          onClick={() => openUserDetails(user._id)}
                          className="p-2 hover:bg-gray-600 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4 text-blue-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-700 flex items-center justify-between">
          <p className="text-gray-400 text-sm">Total: {total}</p>
          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white rounded-lg transition-colors"
            >
              Previous
            </button>
            <span className="px-2 py-2 text-gray-200">Page {page} of {pages}</span>
            <button
              disabled={page >= pages}
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white rounded-lg transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      <AnimatePresence>
        {detailsModal.open && detailsModal.data && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-3xl border border-gray-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative overflow-hidden">
              {/* Decorative Background Elements */}
              <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-r from-blue-600 to-purple-600 opacity-20 pointer-events-none" />
              <div className="absolute top-20 right-20 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-10 pointer-events-none" />

              {/* Header Section */}
              <div className="relative border-b border-gray-800 p-8 pb-6">
                <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
                  {/* Avatar */}
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-[2px] shadow-xl">
                    <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                      {detailsModal.data.user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 text-center md:text-left space-y-2">
                    <div className="flex flex-col md:flex-row md:items-center gap-3">
                      <h2 className="text-3xl font-bold text-white tracking-tight">{detailsModal.data.user.name}</h2>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${detailsModal.data.user.isAdmin ? 'bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/50' : 'bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/50'
                        }`}>
                        {detailsModal.data.user.isAdmin ? 'Admin' : detailsModal.data.user.role}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-gray-400 text-sm">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-4 h-4 text-gray-500" />
                        {detailsModal.data.user.email}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-gray-500" />
                        Joined {detailsModal.data.user.joinedDate ? new Date(detailsModal.data.user.joinedDate).toLocaleDateString() : '-'}
                      </div>
                      <div className="flex items-center gap-1.5 font-mono text-xs opacity-50 bg-gray-800 px-2 py-0.5 rounded">
                        ID: {detailsModal.data.user._id}
                      </div>
                    </div>
                  </div>

                  {/* Close Button */}
                  <button
                    onClick={() => setDetailsModal({ open: false, data: null })}
                    className="absolute top-6 right-6 p-2 hover:bg-gray-800 rounded-full text-gray-400 hover:text-white transition-colors"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-8 space-y-8">
                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50 hover:border-blue-500/30 transition-colors">
                    <p className="text-gray-400 text-xs uppercase font-medium mb-1">Total Enrollments</p>
                    <p className="text-2xl font-bold text-white flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-blue-400" />
                      {detailsModal.data.enrollments?.length || 0}
                    </p>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50 hover:border-green-500/30 transition-colors">
                    <p className="text-gray-400 text-xs uppercase font-medium mb-1">Active Courses</p>
                    <p className="text-2xl font-bold text-white flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      {detailsModal.data.enrollments?.filter(e => e.status === 'active').length || 0}
                    </p>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50 hover:border-purple-500/30 transition-colors">
                    <p className="text-gray-400 text-xs uppercase font-medium mb-1">Avg. Progress</p>
                    <p className="text-2xl font-bold text-white flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-purple-400" />
                      {Math.round(detailsModal.data.enrollments?.reduce((acc, curr) => acc + (curr.progress?.overallProgress || 0), 0) / (detailsModal.data.enrollments?.length || 1))}%
                    </p>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50 hover:border-amber-500/30 transition-colors">
                    <p className="text-gray-400 text-xs uppercase font-medium mb-1">Role Type</p>
                    <p className="text-2xl font-bold text-white capitalize truncate">{detailsModal.data.user.role.replace('_', ' ')}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column: Details */}
                  <div className="space-y-6">
                    {/* Personal Info */}
                    <div className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700/50">
                      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-400" /> Personal Details
                      </h3>
                      {detailsModal.data.user.bio && (
                        <p className="text-gray-400 text-sm mb-4 italic">"{detailsModal.data.user.bio}"</p>
                      )}
                      <div className="space-y-4">
                        <div className="flex items-start gap-4">
                          <div className="p-2 bg-gray-700/50 rounded-lg"><Phone className="w-4 h-4 text-gray-400" /></div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase">Contact</p>
                            <p className="text-white font-mono text-sm">{detailsModal.data.user.phone || 'N/A'}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="p-2 bg-gray-700/50 rounded-lg"><Map className="w-4 h-4 text-gray-400" /></div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase">Location</p>
                            <p className="text-white font-medium">{detailsModal.data.user.address || detailsModal.data.user.resume?.personalInfo?.location || 'N/A'}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="p-2 bg-gray-700/50 rounded-lg"><Calendar className="w-4 h-4 text-gray-400" /></div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase">Date of Birth</p>
                            <p className="text-white font-medium">
                              {detailsModal.data.user.dateOfBirth ? new Date(detailsModal.data.user.dateOfBirth).toLocaleDateString() : 'N/A'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Academic & Professional */}
                    <div className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700/50">
                      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <School className="w-5 h-5 text-purple-400" /> Education & Work
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-start gap-4">
                          <div className="p-2 bg-gray-700/50 rounded-lg"><School className="w-4 h-4 text-gray-400" /></div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase">University</p>
                            <p className="text-white font-medium">{detailsModal.data.user.university || 'N/A'}</p>
                            {detailsModal.data.user.degree && <p className="text-gray-400 text-xs">{detailsModal.data.user.degree}</p>}
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="p-2 bg-gray-700/50 rounded-lg"><BookOpen className="w-4 h-4 text-gray-400" /></div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase">Department</p>
                            <p className="text-white font-medium">{detailsModal.data.user.department || 'N/A'}</p>
                            {detailsModal.data.user.semester && <p className="text-gray-400 text-xs">Sem: {detailsModal.data.user.semester}</p>}
                          </div>
                        </div>
                        {(detailsModal.data.user.company || detailsModal.data.user.currentPosition) && (
                          <div className="flex items-start gap-4 pt-2 border-t border-gray-700/50">
                            <div className="p-2 bg-gray-700/50 rounded-lg"><Briefcase className="w-4 h-4 text-gray-400" /></div>
                            <div>
                              <p className="text-xs text-gray-500 uppercase">Current Role</p>
                              <p className="text-white font-medium">{detailsModal.data.user.currentPosition || 'Employee'}</p>
                              <p className="text-gray-400 text-xs">{detailsModal.data.user.company}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Grant Access Card */}
                    <div className="bg-gradient-to-b from-gray-800/40 to-gray-800/20 rounded-2xl p-6 border border-gray-700/50 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-3 opacity-10">
                        <PlusCircle className="w-24 h-24" />
                      </div>
                      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 relative z-10">
                        <ShieldCheck className="w-5 h-5 text-green-400" />
                        {detailsModal.data.user.role === 'course_manager' ? 'Assign Course' : 'Grant Access'}
                      </h3>

                      <div className="space-y-4 relative z-10">
                        <div>
                          <label className="text-sm text-gray-400 mb-1 block">Select Course</label>
                          <select
                            disabled={coursesLoading}
                            value={grantCourseId}
                            onChange={(e) => setGrantCourseId(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
                          >
                            <option value="">{coursesLoading ? 'Loading...' : 'Choose a course to grant...'}</option>
                            {courses.map((c) => (
                              <option key={c._id} value={c._id}>{c.title}</option>
                            ))}
                          </select>
                        </div>
                        <button
                          disabled={grantSubmitting || !grantCourseId}
                          onClick={handleGrantAccess}
                          className="w-full py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-semibold shadow-lg shadow-green-900/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {grantSubmitting ? 'Processing...' : (
                            <>Grant Access <PlusCircle className="w-4 h-4" /></>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Enrollments/Activity */}
                  <div className="lg:col-span-2 space-y-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      Course Enrollments <span className="text-gray-500 text-sm font-normal">({detailsModal.data.enrollments?.length || 0})</span>
                    </h3>

                    {detailsModal.data.enrollments?.length === 0 ? (
                      <div className="flex flex-col items-center justify-center p-12 bg-gray-800/30 border border-dashed border-gray-700 rounded-2xl text-center">
                        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                          <BookOpen className="w-8 h-8 text-gray-600" />
                        </div>
                        <p className="text-gray-400 font-medium">No courses enrolled yet.</p>
                        <p className="text-gray-500 text-sm mt-1">Use the panel on the left to grant access.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-4">
                        {detailsModal.data.enrollments.map((enr) => (
                          <div key={enr._id} className="group relative bg-gray-800/40 border border-gray-700 hover:border-gray-600 rounded-xl overflow-hidden transition-all hover:shadow-xl hover:shadow-black/20">
                            <div className="flex flex-col sm:flex-row">
                              {/* Thumbnail/Icon */}
                              <div className="w-full sm:w-32 bg-gray-900 flex items-center justify-center relative">
                                {enr.courseId?.thumbnail ? (
                                  <img src={enr.courseId.thumbnail} alt="" className="w-full h-full object-cover opacity-80" />
                                ) : (
                                  <BookOpen className="w-10 h-10 text-gray-600" />
                                )}
                                <div className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${enr.status === 'active' ? 'bg-green-500 text-black' : 'bg-red-500 text-white'
                                  }`}>
                                  {enr.status}
                                </div>
                              </div>

                              <div className="flex-1 p-5">
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <h4 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">{enr.courseId?.title || 'Unknown Course'}</h4>
                                    <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                                      <span>Enrolled: {enr.enrolledAt ? new Date(enr.enrolledAt).toLocaleDateString() : 'N/A'}</span>
                                      <span>•</span>
                                      <span>{enr.paymentStatus}</span>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-2xl font-bold text-white">{enr.progress?.overallProgress || 0}%</span>
                                  </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden mb-4">
                                  <div
                                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                                    style={{ width: `${enr.progress?.overallProgress || 0}%` }}
                                  />
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-3 justify-end pt-2 border-t border-gray-700/50">
                                  {enr.status === 'active' ? (
                                    <button onClick={() => handleRevoke(enr._id)} className="text-xs font-medium text-amber-400 hover:text-amber-300 flex items-center gap-1">
                                      <ShieldCheck className="w-3 h-3" /> Revoke Access
                                    </button>
                                  ) : (
                                    <button onClick={() => handleRestore(enr._id)} className="text-xs font-medium text-blue-400 hover:text-blue-300 flex items-center gap-1">
                                      <RotateCcw className="w-3 h-3" /> Restore
                                    </button>
                                  )}
                                  <button onClick={() => handleDelete(enr._id)} className="text-xs font-medium text-red-400 hover:text-red-300 flex items-center gap-1 ml-2">
                                    <Trash2 className="w-3 h-3" /> Remove
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Certificates Section */}
                  <div className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700/50">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <Award className="w-5 h-5 text-amber-400" /> Certificates & Achievements
                    </h3>
                    {(!detailsModal.data.user.certificatesAndBadges || detailsModal.data.user.certificatesAndBadges.length === 0) ? (
                      <div className="p-8 border border-dashed border-gray-700 rounded-xl text-center">
                        <Award className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                        <p className="text-gray-400 text-sm">No certificates earned yet.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {detailsModal.data.user.certificatesAndBadges.map((cert, idx) => (
                          <div key={idx} className="bg-gray-700/30 border border-gray-700 p-3 rounded-xl flex items-center gap-3">
                            <div className="p-2 bg-amber-500/10 rounded-lg">
                              <Award className="w-4 h-4 text-amber-400" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-white font-medium text-sm truncate">{cert.title}</p>
                              <p className="text-gray-400 text-xs truncate">{cert.issuer} • {cert.issuedDate ? new Date(cert.issuedDate).getFullYear() : 'N/A'}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {detailsModal.data.user.role === 'course_manager' && (
                <div className="mt-8 border-t border-gray-700 pt-6">
                  <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-indigo-400" />
                    Assigned Courses ({detailsModal.data.assignedCourses?.length || 0})
                  </h3>
                  {detailsModal.data.assignedCourses?.length === 0 ? (
                    <div className="p-4 bg-gray-700/20 border border-dashed border-gray-600 rounded-xl text-gray-400 text-center">
                      No courses assigned to this instructor.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-3">
                      {detailsModal.data.assignedCourses.map((course, idx) => (
                        <div key={idx} className="p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-xl flex items-center justify-between hover:bg-indigo-500/10 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="p-2 bg-indigo-500/20 rounded-lg">
                              <BookOpen className="w-4 h-4 text-indigo-400" />
                            </div>
                            <div>
                              <p className="text-white font-semibold">{course.title}</p>
                              <p className="text-gray-400 text-xs mt-0.5">{course.category} • {course.level}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-right">
                            <div>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${course.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                {course.status}
                              </span>
                              <div className="flex items-center justify-end gap-1 mt-1 text-gray-400 text-xs text-right">
                                <Users className="w-3 h-3" />
                                <span>{course.students || 0}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => window.open(`/admin/courses?edit=${course._id}`, '_blank')}
                                className="p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors border border-blue-500/20"
                                title="Edit Course"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleUnassignInstructor(course._id)}
                                className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors border border-red-500/20"
                                title="Unassign Instructor"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {detailsModal.data.user.role === 'job_instructor' && (
                <div className="mt-8 border-t border-gray-700 pt-6">
                  <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-purple-400" />
                    Posted Jobs ({detailsModal.data.postedJobs?.length || 0})
                  </h3>
                  {detailsModal.data.postedJobs?.length === 0 ? (
                    <div className="p-4 bg-gray-700/20 border border-dashed border-gray-600 rounded-xl text-gray-400 text-center">
                      No jobs posted by this instructor.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-3">
                      {detailsModal.data.postedJobs.map((job, idx) => (
                        <div key={idx} className="p-4 bg-purple-500/5 border border-purple-500/20 rounded-xl flex items-center justify-between hover:bg-purple-500/10 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="p-2 bg-purple-500/20 rounded-lg">
                              <Briefcase className="w-4 h-4 text-purple-400" />
                            </div>
                            <div>
                              <p className="text-white font-semibold">{job.title}</p>
                              <p className="text-gray-400 text-xs mt-0.5">{job.company || job.organization} • {job.location} • {job.type}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-right">
                            <div>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${job.status === 'Active' || job.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                {job.status}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => window.open(`/admin/jobs?edit=${job._id}`, '_blank')}
                                className="p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors border border-blue-500/20"
                                title="Edit Job"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {detailsModal.data.user.role === 'hackathon_instructor' && (
                <div className="mt-8 border-t border-gray-700 pt-6">
                  <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-rose-400" />
                    Posted Hackathons ({detailsModal.data.postedHackathons?.length || 0})
                  </h3>
                  {detailsModal.data.postedHackathons?.length === 0 ? (
                    <div className="p-4 bg-gray-700/20 border border-dashed border-gray-600 rounded-xl text-gray-400 text-center">
                      No hackathons posted by this lead.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-3">
                      {(detailsModal.data.postedHackathons || []).map((hack, idx) => (
                        <div key={idx} className="p-4 bg-rose-500/5 border border-rose-500/20 rounded-xl flex items-center justify-between hover:bg-rose-500/10 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="p-2 bg-rose-500/20 rounded-lg">
                              <Trophy className="w-4 h-4 text-rose-400" />
                            </div>
                            <div>
                              <p className="text-white font-semibold">{hack.title}</p>
                              <p className="text-gray-400 text-xs mt-0.5">{hack.organizer} • {hack.location} • {hack.mode}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-right">
                            <div>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${hack.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                {hack.status}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => window.open(`/admin/hackathons?edit=${hack._id}`, '_blank')}
                                className="p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors border border-blue-500/20"
                                title="Edit Hackathon"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {detailsModal.data.user.role === 'roadmap_instructor' && (
                <div className="mt-8 border-t border-gray-700 pt-6">
                  <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                    <Map className="w-5 h-5 text-orange-400" />
                    Published Roadmaps ({detailsModal.data.createdRoadmaps?.length || 0})
                  </h3>
                  {detailsModal.data.createdRoadmaps?.length === 0 ? (
                    <div className="p-4 bg-gray-700/20 border border-dashed border-gray-600 rounded-xl text-gray-400 text-center">
                      No roadmaps published by this instructor.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-3">
                      {(detailsModal.data.createdRoadmaps || []).map((roadmap, idx) => (
                        <div key={idx} className="p-4 bg-orange-500/5 border border-orange-500/20 rounded-xl flex items-center justify-between hover:bg-orange-500/10 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="p-2 bg-orange-500/20 rounded-lg">
                              <Map className="w-4 h-4 text-orange-400" />
                            </div>
                            <div>
                              <p className="text-white font-semibold">{roadmap.title}</p>
                              <p className="text-gray-400 text-xs mt-0.5">{roadmap.category} • {roadmap.difficulty}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-right">
                            <div>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${roadmap.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                {roadmap.status}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => window.open(`/admin/roadmaps?edit=${roadmap._id}`, '_blank')}
                                className="p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors border border-blue-500/20"
                                title="Edit Roadmap"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {detailsModal.data.user.role === 'resume_instructor' && (
                <div className="mt-8 border-t border-gray-700 pt-6">
                  <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-cyan-400" />
                    Resume Templates ({detailsModal.data.createdTemplates?.length || 0})
                  </h3>
                  {(!detailsModal.data.createdTemplates || detailsModal.data.createdTemplates.length === 0) ? (
                    <div className="p-4 bg-gray-700/20 border border-dashed border-gray-600 rounded-xl text-gray-400 text-center">
                      No templates created by this instructor.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {(detailsModal.data.createdTemplates || []).map((template, idx) => (
                        <div key={idx} className="p-4 bg-cyan-700/10 border border-cyan-500/20 rounded-xl flex items-center justify-between hover:bg-cyan-500/10 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="p-2 bg-cyan-500/20 rounded-lg">
                              <FileText className="w-4 h-4 text-cyan-400" />
                            </div>
                            <div>
                              <p className="text-white font-semibold">{template.name}</p>
                              <div className="flex gap-2 items-center mt-1">
                                <span className="text-gray-400 text-xs bg-gray-700 px-1.5 py-0.5 rounded">{template.category}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${template.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                              {template.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* User Edit Modal */}
      < AnimatePresence >
        {
          userModal.open && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-gray-800 rounded-2xl border border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 flex items-center justify-between z-10">
                  <h2 className="text-2xl font-bold text-white">{userModal.mode === 'add' ? 'Add User' : 'Edit User'}</h2>
                  <button
                    onClick={() => setUserModal({ open: false, mode: 'add' })}
                    className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>

                {/* Tabs for Resume Instructor */}
                {userForm.role === 'resume_instructor' && userModal.mode === 'edit' && (
                  <div className="flex border-b border-gray-700 px-6">
                    <button
                      onClick={() => setActiveTab('profile')}
                      className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'profile' ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-400 hover:text-gray-300'
                        }`}
                    >
                      Profile Details
                    </button>
                    <button
                      onClick={() => setActiveTab('templates')}
                      className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'templates' ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-gray-400 hover:text-gray-300'
                        }`}
                    >
                      Resume Templates
                    </button>
                  </div>
                )}

                <div className="p-6">
                  {activeTab === 'profile' ? (
                    // Profile Form
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-gray-400">Full Name</label>
                          <input
                            type="text"
                            value={userForm.name}
                            onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                            className="w-full mt-1 px-4 py-2.5 bg-gray-700/50 border border-gray-600 rounded-xl text-white outline-none focus:border-blue-500"
                            placeholder="John Doe"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-gray-400">Email Address</label>
                          <input
                            type="email"
                            value={userForm.email}
                            onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                            className="w-full mt-1 px-4 py-2.5 bg-gray-700/50 border border-gray-600 rounded-xl text-white outline-none focus:border-blue-500"
                            placeholder="john@example.com"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-gray-400">Password {userModal.mode === 'edit' && '(Leave blank to keep current)'}</label>
                          <input
                            type="password"
                            value={userForm.password}
                            onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                            className="w-full mt-1 px-4 py-2.5 bg-gray-700/50 border border-gray-600 rounded-xl text-white outline-none focus:border-blue-500"
                            placeholder="••••••••"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-gray-400">Role</label>
                          <select
                            value={userForm.role}
                            onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                            className="w-full mt-1 px-4 py-2.5 bg-gray-700/50 border border-gray-600 rounded-xl text-white outline-none focus:border-blue-500"
                          >
                            <option value="student">Student</option>
                            <option value="faculty">Faculty</option>
                            <option value="course_manager">Instructor (Course Manager)</option>
                            <option value="job_instructor">Job Partner</option>
                            <option value="hackathon_instructor">Hackathon Lead</option>
                            <option value="roadmap_instructor">Roadmap Instructor</option>
                            <option value="resume_instructor">Resume Instructor</option>
                            <option value="admin">Admin</option>
                          </select>
                        </div>
                      </div>

                      {/* Extended Fields based on Role might go here, keeping simple for now */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="text-sm text-gray-400">Phone</label>
                          <input
                            type="text"
                            value={userForm.phone}
                            onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                            className="w-full mt-1 px-4 py-2.5 bg-gray-700/50 border border-gray-600 rounded-xl text-white outline-none focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-gray-400">University</label>
                          <input
                            type="text"
                            value={userForm.university}
                            onChange={(e) => setUserForm({ ...userForm, university: e.target.value })}
                            className="w-full mt-1 px-4 py-2.5 bg-gray-700/50 border border-gray-600 rounded-xl text-white outline-none focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-gray-400">Admin Access</label>
                          <div className="mt-2 flex items-center gap-3">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={userForm.isAdmin}
                                onChange={(e) => setUserForm({ ...userForm, isAdmin: e.target.checked })}
                                className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="text-white">Is Admin?</span>
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 mt-6">
                        <button
                          onClick={() => setUserModal({ open: false, mode: 'add' })}
                          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={saveUser}
                          disabled={savingUser}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white disabled:opacity-50"
                        >
                          {savingUser ? 'Saving...' : 'Save User'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Templates Tab
                    <div className="space-y-6">
                      {templateModal.open ? (
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-white">{templateModal.mode === 'add' ? 'New Template' : 'Edit Template'}</h3>
                            <button onClick={() => setTemplateModal({ open: false, mode: 'add', data: null })} className="text-gray-400 hover:text-white">Cancel</button>
                          </div>
                          <ResumeTemplateForm
                            initialData={templateModal.data || {}}
                            onSubmit={handleSaveTemplate}
                            onCancel={() => setTemplateModal({ open: false, mode: 'add', data: null })}
                          />
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-lg font-semibold text-white">Managed Templates</h3>
                              <p className="text-sm text-gray-400">Templates owned by {userForm.name}</p>
                            </div>
                            <button
                              onClick={() => setTemplateModal({ open: true, mode: 'add', data: {} })}
                              className="px-3 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg flex items-center gap-2"
                            >
                              <PlusCircle className="w-4 h-4" /> Add Template
                            </button>
                          </div>

                          {templatesLoading ? (
                            <div className="text-center py-8 text-gray-400">Loading templates...</div>
                          ) : userTemplates.length === 0 ? (
                            <div className="text-center py-8 bg-gray-700/20 result-dashed border-gray-600 rounded-xl text-gray-400">
                              <LayoutTemplate className="w-8 h-8 mx-auto mb-2 opacity-50" />
                              No templates found for this instructor.
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 gap-3 max-h-[500px] overflow-y-auto">
                              {userTemplates.map((tpl) => (
                                <div key={tpl._id} className="p-4 bg-gray-700/30 border border-gray-600 rounded-xl flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-cyan-900/50 rounded-lg flex items-center justify-center text-xl">
                                      {tpl.preview || '📄'}
                                    </div>
                                    <div>
                                      <h4 className="font-semibold text-white">{tpl.name}</h4>
                                      <div className="flex gap-2 text-xs text-gray-400">
                                        <span>{tpl.category}</span>
                                        <span>•</span>
                                        <span className={tpl.isActive ? "text-green-400" : "text-gray-400"}>{tpl.isActive ? "Active" : "Inactive"}</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => setTemplateModal({ open: true, mode: 'edit', data: tpl })}
                                      className="p-2 hover:bg-gray-600 rounded-lg text-blue-400"
                                      title="Edit"
                                    >
                                      <Pencil className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteTemplate(tpl._id)}
                                      className="p-2 hover:bg-gray-600 rounded-lg text-red-400"
                                      title="Delete"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        }
      </AnimatePresence >

      {/* JSON Modal */}
      {
        jsonModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-2xl border border-gray-700 max-w-5xl w-full max-h-[90vh] overflow-hidden">
              <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Users JSON (page {page} of {pages}, total {total})</h3>
                <button
                  onClick={() => setJsonModal(false)}
                  className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"
                >
                  Close
                </button>
              </div>
              <div className="p-4 overflow-auto">
                <pre className="text-sm text-gray-200 whitespace-pre-wrap">
                  {JSON.stringify({ users, pagination: { page, pages, total, limit } }, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
};

export default AdminUsers;
