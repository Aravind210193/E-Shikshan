import React, { useEffect, useState } from "react";
import { Search, Eye, CheckCircle, XCircle, ShieldCheck, RotateCcw, Trash2, PlusCircle, Braces, Pencil, BookOpen, Users, Briefcase, Trophy } from "lucide-react";
import { toast } from "react-hot-toast";
import { adminAPI, coursesAPI } from "../../services/api";
import { adminCourseAPI } from "../../services/adminApi";

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
                              'bg-blue-500/20 text-blue-400'
                        }`}>
                        {user.role === 'course_manager' ? 'Instructor' : user.role === 'job_instructor' ? 'Job Partner' : user.role === 'hackathon_instructor' ? 'Hackathon Lead' : user.role}
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
      {detailsModal.open && detailsModal.data && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl border border-gray-700 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">{detailsModal.data.user.name}</h2>
                <p className="text-gray-400">{detailsModal.data.user.email}</p>
              </div>
              <button
                onClick={() => setDetailsModal({ open: false, data: null })}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"
              >
                Close
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-700/40 rounded-xl p-4 border border-gray-700">
                  <p className="text-gray-400 text-sm">Role</p>
                  <p className="text-white font-semibold">{detailsModal.data.user.role}</p>
                </div>
                <div className="bg-gray-700/40 rounded-xl p-4 border border-gray-700">
                  <p className="text-gray-400 text-sm">Admin</p>
                  <p className="text-white font-semibold">{detailsModal.data.user.isAdmin ? 'Yes' : 'No'}</p>
                </div>
              </div>

              {/* Extended profile fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gray-700/40 rounded-xl p-4 border border-gray-700">
                  <p className="text-gray-400 text-sm">Phone</p>
                  <p className="text-white font-semibold">{detailsModal.data.user.phone || '-'}</p>
                </div>
                <div className="bg-gray-700/40 rounded-xl p-4 border border-gray-700">
                  <p className="text-gray-400 text-sm">University</p>
                  <p className="text-white font-semibold">{detailsModal.data.user.university || '-'}</p>
                </div>
                <div className="bg-gray-700/40 rounded-xl p-4 border border-gray-700">
                  <p className="text-gray-400 text-sm">Department</p>
                  <p className="text-white font-semibold">{detailsModal.data.user.department || '-'}</p>
                </div>
                <div className="bg-gray-700/40 rounded-xl p-4 border border-gray-700">
                  <p className="text-gray-400 text-sm">Semester</p>
                  <p className="text-white font-semibold">{detailsModal.data.user.semester || '-'}</p>
                </div>
                <div className="bg-gray-700/40 rounded-xl p-4 border border-gray-700">
                  <p className="text-gray-400 text-sm">Joined</p>
                  <p className="text-white font-semibold">{detailsModal.data.user.joinedDate ? new Date(detailsModal.data.user.joinedDate).toLocaleString() : '-'}</p>
                </div>
                <div className="bg-gray-700/40 rounded-xl p-4 border border-gray-700">
                  <p className="text-gray-400 text-sm">User ID</p>
                  <p className="text-white font-mono break-all">{detailsModal.data.user._id}</p>
                </div>
              </div>

              {/* Grant Access */}
              <div className="mb-8 bg-gray-700/30 border border-gray-700 rounded-xl p-4">
                <div className="flex flex-col md:flex-row md:items-end gap-3">
                  <div className="flex-1">
                    <label className="block text-sm text-gray-400 mb-1">
                      {detailsModal.data.user.role === 'course_manager' ? 'Assign new course' : 'Grant course access'}
                    </label>
                    <select
                      disabled={coursesLoading}
                      value={grantCourseId}
                      onChange={(e) => setGrantCourseId(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white disabled:opacity-50"
                    >
                      <option value="">{coursesLoading ? 'Loading courses...' : 'Select a course'}</option>
                      {courses.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.title} {c.price ? `• ${c.price}` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    disabled={grantSubmitting || !grantCourseId}
                    onClick={handleGrantAccess}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg"
                  >
                    <PlusCircle className="w-4 h-4" />
                    {grantSubmitting ? 'Granting...' : 'Grant Access'}
                  </button>
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-3">Enrollments ({detailsModal.data.enrollments.length})</h3>
              {detailsModal.data.enrollments.length === 0 ? (
                <div className="text-gray-400">No enrollments yet</div>
              ) : (
                <div className="space-y-3">
                  {detailsModal.data.enrollments.map((enr) => (
                    <div key={enr._id} className="p-4 bg-gray-700/30 border border-gray-700 rounded-xl">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="text-white font-medium">{enr.courseId?.title || 'Course Deleted'}</div>
                          <div className="text-sm text-gray-400 mt-1">Payment: {enr.paymentStatus} • Status: {enr.status}</div>
                        </div>
                        <div className="text-right text-sm text-gray-300">
                          <div>Enrolled: {enr.enrolledAt ? new Date(enr.enrolledAt).toLocaleDateString() : '-'}</div>
                          <div>Progress: {enr.progress?.overallProgress ?? 0}%</div>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-2 justify-end">
                        {enr.status === 'active' ? (
                          <button
                            onClick={() => handleRevoke(enr._id)}
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg"
                          >
                            <ShieldCheck className="w-4 h-4" /> Revoke
                          </button>
                        ) : (
                          <button
                            onClick={() => handleRestore(enr._id)}
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                          >
                            <RotateCcw className="w-4 h-4" /> Restore
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(enr._id)}
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

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
            </div>
          </div>
        </div>
      )}

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

      {/* Add/Edit User Modal */}
      {
        userModal.open && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-2xl border border-gray-700 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">{userModal.mode === 'add' ? 'Add User' : 'Edit User'}</h3>
                <button
                  onClick={() => setUserModal({ open: false, mode: 'add' })}
                  className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"
                >
                  Close
                </button>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400">Name</label>
                    <input className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white" value={userForm.name} onChange={(e) => setUserForm({ ...userForm, name: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Email</label>
                    <input className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white" value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Password {userModal.mode === 'edit' && <span className="text-gray-400">(leave blank to keep)</span>}</label>
                    <input type="password" className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white" value={userForm.password} onChange={(e) => setUserForm({ ...userForm, password: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Role</label>
                    <select className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white" value={userForm.role} onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}>
                      <option value="student">Student</option>
                      <option value="faculty">Faculty</option>
                      <option value="course_manager">Instructor</option>
                      <option value="job_instructor">Job Partner</option>
                      <option value="hackathon_instructor">Hackathon Lead</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <input id="isAdmin" type="checkbox" checked={!!userForm.isAdmin} onChange={(e) => setUserForm({ ...userForm, isAdmin: e.target.checked })} />
                    <label htmlFor="isAdmin" className="text-sm text-gray-300">Is Admin</label>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Phone</label>
                    <input className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white" value={userForm.phone} onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">University</label>
                    <input className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white" value={userForm.university} onChange={(e) => setUserForm({ ...userForm, university: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Department</label>
                    <input className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white" value={userForm.department} onChange={(e) => setUserForm({ ...userForm, department: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Semester</label>
                    <input className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white" value={userForm.semester} onChange={(e) => setUserForm({ ...userForm, semester: e.target.value })} />
                  </div>
                </div>
                <div className="mt-6 flex justify-end gap-2">
                  <button onClick={() => setUserModal({ open: false, mode: 'add' })} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg">Cancel</button>
                  <button disabled={savingUser} onClick={saveUser} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50">{savingUser ? 'Saving...' : 'Save'}</button>
                </div>

                {userModal.mode === 'edit' && userForm.role === 'course_manager' && (
                  <div className="mt-8 border-t border-gray-700 pt-6">
                    <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-indigo-400" />
                      Assigned Courses
                    </h4>
                    {/* We need to get assignedCourses from detailsModal data if available or just inform user to view details */}
                    <p className="text-gray-400 text-sm mb-4">View assigned courses in the "View Details" (eye icon) modal for a full course breakdown.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
};

export default AdminUsers;
