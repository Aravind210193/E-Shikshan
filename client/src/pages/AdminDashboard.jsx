import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, BookOpen, TrendingUp, DollarSign, 
  UserCheck, UserX, Shield, Search, Filter,
  CheckCircle, XCircle, Clock, Award
} from 'lucide-react';
import { adminAPI, authAPI } from '../services/api';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });

  useEffect(() => {
    checkAdminAccess();
    fetchStats();
    fetchUsers();
  }, [pagination.page, searchTerm, roleFilter]);

  const checkAdminAccess = async () => {
    try {
      const response = await authAPI.getProfile();
      setCurrentUser(response.data);
      
      if (!response.data.isAdmin && response.data.role !== 'admin') {
        toast.error('Access denied. Admin privileges required.');
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Access check error:', error);
      toast.error('Authentication failed');
      window.location.href = '/login';
    }
  };

  const fetchStats = async () => {
    try {
      const response = await adminAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Fetch stats error:', error);
      toast.error('Failed to load dashboard stats');
    }
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm,
        role: roleFilter
      };
      const response = await adminAPI.getAllUsers(params);
      setUsers(response.data.users);
      setPagination(prev => ({ ...prev, ...response.data.pagination }));
    } catch (error) {
      console.error('Fetch users error:', error);
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleAdmin = async (userId, currentIsAdmin) => {
    try {
      await adminAPI.updateUserRole(userId, { isAdmin: !currentIsAdmin });
      toast.success(`Admin status ${!currentIsAdmin ? 'granted' : 'revoked'} successfully`);
      fetchUsers();
    } catch (error) {
      console.error('Toggle admin error:', error);
      toast.error('Failed to update admin status');
    }
  };

  const handleRevokeAccess = async (enrollmentId) => {
    if (!window.confirm('Are you sure you want to revoke access to this course?')) {
      return;
    }
    
    try {
      await adminAPI.revokeCourseAccess(enrollmentId);
      toast.success('Course access revoked successfully');
      if (selectedUser) {
        viewUserDetails(selectedUser._id);
      }
      fetchUsers();
    } catch (error) {
      console.error('Revoke access error:', error);
      toast.error('Failed to revoke course access');
    }
  };

  const handleRestoreAccess = async (enrollmentId) => {
    try {
      await adminAPI.restoreCourseAccess(enrollmentId);
      toast.success('Course access restored successfully');
      if (selectedUser) {
        viewUserDetails(selectedUser._id);
      }
      fetchUsers();
    } catch (error) {
      console.error('Restore access error:', error);
      toast.error('Failed to restore course access');
    }
  };

  const handleDeleteEnrollment = async (enrollmentId) => {
    if (!window.confirm('Are you sure you want to delete this enrollment? This action cannot be undone.')) {
      return;
    }
    
    try {
      await adminAPI.deleteEnrollment(enrollmentId);
      toast.success('Enrollment deleted successfully');
      if (selectedUser) {
        viewUserDetails(selectedUser._id);
      }
      fetchUsers();
    } catch (error) {
      console.error('Delete enrollment error:', error);
      toast.error('Failed to delete enrollment');
    }
  };

  const viewUserDetails = async (userId) => {
    try {
      const response = await adminAPI.getUserById(userId);
      setSelectedUser(response.data);
    } catch (error) {
      console.error('Fetch user details error:', error);
      toast.error('Failed to load user details');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'suspended': return 'text-red-600 bg-red-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      case 'cancelled': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'free': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (!currentUser?.isAdmin && currentUser?.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Shield className="w-10 h-10 text-purple-400" />
            Admin Dashboard
          </h1>
          <p className="text-slate-300">Manage users, enrollments, and system access</p>
        </motion.div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-300 text-sm">Total Users</p>
                  <p className="text-3xl font-bold text-white mt-1">{stats.stats.totalUsers}</p>
                </div>
                <Users className="w-12 h-12 text-blue-400" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-300 text-sm">Total Courses</p>
                  <p className="text-3xl font-bold text-white mt-1">{stats.stats.totalCourses}</p>
                </div>
                <BookOpen className="w-12 h-12 text-purple-400" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-300 text-sm">Active Enrollments</p>
                  <p className="text-3xl font-bold text-white mt-1">{stats.stats.activeEnrollments}</p>
                  <p className="text-xs text-red-400 mt-1">Suspended: {stats.stats.suspendedEnrollments}</p>
                </div>
                <TrendingUp className="w-12 h-12 text-green-400" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-300 text-sm">Total Revenue</p>
                  <p className="text-3xl font-bold text-white mt-1">₹{stats.stats.totalRevenue}</p>
                </div>
                <DollarSign className="w-12 h-12 text-yellow-400" />
              </div>
            </motion.div>
          </div>
        )}

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="pl-10 pr-8 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500 appearance-none cursor-pointer"
              >
                <option value="" className="bg-slate-800">All Roles</option>
                <option value="student" className="bg-slate-800">Students</option>
                <option value="faculty" className="bg-slate-800">Faculty</option>
                <option value="admin" className="bg-slate-800">Admins</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Users List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 overflow-hidden"
        >
          <div className="p-6 border-b border-white/20">
            <h2 className="text-2xl font-bold text-white">User Management</h2>
          </div>
          
          {isLoading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
              <p className="text-slate-300 mt-4">Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-300">No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">User</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Role</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Enrollments</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Admin</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-white font-medium">{user.name}</p>
                          <p className="text-slate-400 text-sm">{user.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-500/20 text-purple-300">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-white font-medium">{user.enrollmentCount}</span>
                      </td>
                      <td className="px-6 py-4">
                        {user.isAdmin ? (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : (
                          <XCircle className="w-5 h-5 text-slate-600" />
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => viewUserDetails(user._id)}
                            className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors"
                          >
                            View Details
                          </button>
                          {currentUser?._id !== user._id && (
                            <button
                              onClick={() => handleToggleAdmin(user._id, user.isAdmin)}
                              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                                user.isAdmin
                                  ? 'bg-red-500 hover:bg-red-600 text-white'
                                  : 'bg-green-500 hover:bg-green-600 text-white'
                              }`}
                            >
                              {user.isAdmin ? 'Revoke Admin' : 'Make Admin'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="p-6 border-t border-white/20 flex justify-center gap-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                disabled={pagination.page === 1}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-white">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.pages, prev.page + 1) }))}
                disabled={pagination.page === pagination.pages}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </motion.div>

        {/* User Details Modal */}
        {selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedUser(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-slate-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-slate-900 border-b border-white/20 p-6 flex justify-between items-center z-10">
                <div>
                  <h3 className="text-2xl font-bold text-white">{selectedUser.user.name}</h3>
                  <p className="text-slate-400">{selectedUser.user.email}</p>
                </div>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-slate-400 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="p-6">
                <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-purple-400" />
                  Enrolled Courses ({selectedUser.enrollments.length})
                </h4>

                {selectedUser.enrollments.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400">No enrollments yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedUser.enrollments.map((enrollment) => (
                      <div
                        key={enrollment._id}
                        className="bg-white/5 rounded-xl p-6 border border-white/10"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h5 className="text-lg font-semibold text-white mb-2">
                              {enrollment.courseId?.title || 'Course Deleted'}
                            </h5>
                            <div className="flex flex-wrap gap-2">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(enrollment.status)}`}>
                                {enrollment.status}
                              </span>
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(enrollment.paymentStatus)}`}>
                                {enrollment.paymentStatus}
                              </span>
                              {enrollment.paymentMethod === 'admin_granted' && (
                                <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-500/20 text-yellow-300">
                                  Admin Granted
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right text-sm text-slate-400">
                            <p>Enrolled: {new Date(enrollment.enrolledAt).toLocaleDateString()}</p>
                            <p>Progress: {enrollment.progress?.overallProgress || 0}%</p>
                          </div>
                        </div>

                        <div className="flex gap-2 mt-4">
                          {enrollment.status === 'active' ? (
                            <button
                              onClick={() => handleRevokeAccess(enrollment._id)}
                              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition-colors flex items-center gap-2"
                            >
                              <UserX className="w-4 h-4" />
                              Revoke Access
                            </button>
                          ) : enrollment.status === 'suspended' ? (
                            <button
                              onClick={() => handleRestoreAccess(enrollment._id)}
                              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm transition-colors flex items-center gap-2"
                            >
                              <UserCheck className="w-4 h-4" />
                              Restore Access
                            </button>
                          ) : null}
                          <button
                            onClick={() => handleDeleteEnrollment(enrollment._id)}
                            className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg text-sm transition-colors"
                          >
                            Delete Enrollment
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
