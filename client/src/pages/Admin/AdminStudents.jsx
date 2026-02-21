import React, { useEffect, useState } from "react";
import { Search, Eye, CheckCircle, XCircle, ShieldCheck, RotateCcw, Trash2, PlusCircle, Briefcase, Trophy } from "lucide-react";
import { toast } from "react-hot-toast";
import { adminAPI, coursesAPI, jobsAPI, hackathonsAPI, roadmapAPI, resumeTemplateAPI } from "../../services/api";

const AdminStudents = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  const [searchQuery, setSearchQuery] = useState("");

  const [detailsModal, setDetailsModal] = useState({ open: false, data: null });
  const [items, setItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [grantItemId, setGrantItemId] = useState("");
  const [grantType, setGrantType] = useState("course");
  const [allResources, setAllResources] = useState({ courses: [], jobs: [], hackathons: [] });
  const [grantSubmitting, setGrantSubmitting] = useState(false);

  const adminRole = (sessionStorage.getItem('adminRole') || 'admin').toLowerCase();
  const isManager = ['course_manager', 'instructor', 'faculty'].includes(adminRole);
  const isJobInstructor = adminRole === 'job_instructor';
  const isHackathonInstructor = adminRole === 'hackathon_instructor';
  const isRoadmapInstructor = adminRole === 'roadmap_instructor';
  const isResumeInstructor = adminRole === 'resume_instructor';
  const isDeveloper = adminRole === 'admin';
  const isLimitedAdmin = isManager || isJobInstructor || isHackathonInstructor || isRoadmapInstructor || isResumeInstructor;

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError("");
    try {
      const params = { page, limit, role: 'student' };
      if (searchQuery) params.search = searchQuery;

      const res = await adminAPI.getAllUsers(params);
      setUsers(res.data.users || []);
      const p = res.data.pagination || {};
      setPages(p.pages || 1);
      setTotal(p.total || 0);
    } catch (err) {
      console.error("Failed to fetch students", err);
      const status = err?.response?.status;
      const message = err?.response?.data?.message || err?.message || "Failed to load students from server";
      if (status === 401) {
        setError("Unauthorized. Please log in to the admin portal.");
      } else if (status === 403) {
        setError("Forbidden. Your admin account does not have permission to view students.");
      } else {
        setError(message);
      }
      toast.error(message);
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
      // Load relevant items for grant access selector
      setItemsLoading(true);
      try {
        if (isDeveloper) {
          const [cRes, jRes, hRes, rRes, resRes] = await Promise.all([
            coursesAPI.getAll({ limit: 1000 }),
            jobsAPI.getAll({ limit: 1000 }),
            hackathonsAPI.getAll({ limit: 1000 }),
            roadmapAPI.getAll({ limit: 1000 }),
            resumeTemplateAPI.getAll()
          ]);

          const courses = cRes.data.courses || cRes.data || [];
          const jobs = jRes.data.jobs || jRes.data || [];
          const hackathons = hRes.data.data || hRes.data || [];
          const roadmaps = rRes.data.data || rRes.data || [];
          const resumes = resRes.data.data || resRes.data || [];

          setAllResources({
            courses: Array.isArray(courses) ? courses.map(c => ({ _id: c._id, title: c.title })) : [],
            jobs: Array.isArray(jobs) ? jobs.map(j => ({ _id: j._id, title: j.title })) : [],
            hackathons: Array.isArray(hackathons) ? hackathons.map(h => ({ _id: h._id, title: h.title })) : [],
            roadmaps: Array.isArray(roadmaps) ? roadmaps.map(r => ({ _id: r._id, title: r.title })) : [],
            resumes: Array.isArray(resumes) ? resumes.map(r => ({ _id: r._id, title: r.name || r.title })) : []
          });

          // Default items to courses
          setItems(Array.isArray(courses) ? courses.map(c => ({ _id: c._id, title: c.title })) : []);
        } else {
          let resItems = [];
          if (isManager) {
            const coursesRes = await coursesAPI.getAll();
            const cList = coursesRes.data.courses || coursesRes.data || [];
            resItems = Array.isArray(cList) ? cList.map(c => ({ _id: c._id, title: c.title })) : [];
          } else if (isJobInstructor) {
            const jobsRes = await jobsAPI.getAll();
            const jList = jobsRes.data.jobs || jobsRes.data || [];
            resItems = Array.isArray(jList) ? jList.map(j => ({ _id: j._id, title: j.title })) : [];
          } else if (isHackathonInstructor) {
            const hackRes = await hackathonsAPI.getAll();
            const hList = hackRes.data.data || hackRes.data || [];
            resItems = Array.isArray(hList) ? hList.map(h => ({ _id: h._id, title: h.title })) : [];
          } else if (isRoadmapInstructor) {
            const rRes = await roadmapAPI.getAll();
            const rList = rRes.data.data || rRes.data || [];
            resItems = Array.isArray(rList) ? rList.map(r => ({ _id: r._id, title: r.title })) : [];
          } else if (isResumeInstructor) {
            const resRes = await resumeTemplateAPI.getAll();
            const resList = resRes.data.data || resRes.data || [];
            resItems = Array.isArray(resList) ? resList.map(r => ({ _id: r._id, title: r.name || r.title })) : [];
          }
          setItems(resItems);
        }
      } catch (e) {
        console.error("Failed to fetch items list", e);
      } finally {
        setItemsLoading(false);
      }
    } catch (err) {
      console.error("Failed to fetch user details", err);
      toast.error("Failed to load student details");
    }
  };

  const refreshUserDetails = async () => {
    if (!detailsModal.open || !detailsModal.data?.user?._id) return;
    try {
      const res = await adminAPI.getUserById(detailsModal.data.user._id);
      setDetailsModal((prev) => ({ ...prev, data: res.data }));
    } catch (err) {
      console.error("Failed to refresh student details", err);
    }
  };

  const handleGrantAccess = async () => {
    if (!detailsModal.data?.user?._id) return;
    if (!grantItemId) {
      toast.error("Please select an item to grant access");
      return;
    }
    setGrantSubmitting(true);
    try {
      const targetType = isDeveloper ? grantType :
        (isManager ? 'course' :
          (isHackathonInstructor ? 'hackathon' :
            (isJobInstructor ? 'job' :
              (isRoadmapInstructor ? 'roadmap' : 'resume'))));

      if (targetType === 'course') {
        await adminAPI.grantCourseAccess({
          userId: detailsModal.data.user._id,
          courseId: grantItemId,
        });
      } else if (targetType === 'hackathon') {
        await adminAPI.grantHackathonAccess({
          userId: detailsModal.data.user._id,
          hackathonId: grantItemId,
        });
      } else if (targetType === 'job') {
        await adminAPI.grantJobAccess({
          userId: detailsModal.data.user._id,
          jobId: grantItemId,
        });
      } else if (targetType === 'roadmap') {
        await adminAPI.grantRoadmapAccess({
          userId: detailsModal.data.user._id,
          roadmapId: grantItemId,
        });
      } else if (targetType === 'resume') {
        await adminAPI.grantResumeAccess({
          userId: detailsModal.data.user._id,
          templateId: grantItemId,
        });
      }
      toast.success("Access granted successfully");
      setGrantItemId("");
      await refreshUserDetails();
      await fetchUsers();
    } catch (err) {
      console.error("Grant access failed", err);
      toast.error(err?.response?.data?.message || "Failed to grant access");
    } finally {
      setGrantSubmitting(false);
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
          <h1 className="text-3xl font-bold text-white mb-2">Students</h1>
          <p className="text-gray-400">All users with role 'student'</p>
        </div>
      </div>

      <div>
        <label className="text-sm text-gray-400">Search</label>
        <div className="mt-2 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <button
            onClick={searchNow}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            Search
          </button>
        </div>
        {isLimitedAdmin && !searchQuery && (
          <p className="mt-2 text-[10px] text-indigo-400 font-bold uppercase tracking-widest bg-indigo-500/5 py-1.5 px-3 rounded-lg border border-indigo-500/10 inline-block">
            * Currently showing registered students. Use search to find new students from the global database.
          </p>
        )}
      </div>

      {/* Users Table */}
      <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700/50 border-b border-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Student</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Enrollments</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Admin</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-400">Loading students...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-red-400">{error}</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-400">No students found</td>
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

              {/* Grant Access Section - Dynamic Based on Role */}
              {true && (
                <div className="mb-8 bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-5 shadow-inner">
                  <div className="flex flex-col md:flex-row md:items-end gap-4">
                    {isDeveloper && (
                      <div className="w-full md:w-32">
                        <label className="block text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Type</label>
                        <select
                          value={grantType}
                          onChange={(e) => {
                            const val = e.target.value;
                            setGrantType(val);
                            setItems(allResources[val + 's'] || []);
                            setGrantItemId("");
                          }}
                          className="w-full pl-3 pr-8 py-2.5 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white appearance-none focus:ring-2 focus:ring-indigo-500/50 outline-none"
                        >
                          <option value="course">Course</option>
                          <option value="hackathon">Hackathon</option>
                          <option value="job">Job</option>
                          <option value="roadmap">Roadmap</option>
                          <option value="resume">Resume</option>
                        </select>
                      </div>
                    )}
                    <div className="flex-1">
                      <label className="block text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">
                        {isDeveloper ? `Select ${grantType}` : (isHackathonInstructor ? 'Grant Hackathon Access' : isJobInstructor ? 'Record Job Application' : isRoadmapInstructor ? 'Assign Roadmap' : isResumeInstructor ? 'Unlock Resume Template' : 'Grant Course Access')}
                      </label>
                      <div className="relative">
                        <select
                          disabled={itemsLoading}
                          value={grantItemId}
                          onChange={(e) => setGrantItemId(e.target.value)}
                          className="w-full pl-4 pr-10 py-2.5 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white appearance-none focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all disabled:opacity-50"
                        >
                          <option value="">{itemsLoading ? 'Loading resources...' : `Select Item`}</option>
                          {items.map((item) => (
                            <option key={item._id} value={item._id}>
                              {item.title}
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                          <PlusCircle className="w-4 h-4 text-gray-500" />
                        </div>
                      </div>
                    </div>
                    <button
                      disabled={grantSubmitting || !grantItemId}
                      onClick={handleGrantAccess}
                      className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20 active:scale-95 flex items-center justify-center gap-2 min-w-[140px]"
                    >
                      {grantSubmitting ? (
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span>Assign</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="mt-3 text-[10px] text-gray-500 font-medium">
                    * This action will grant full access and send an automated email notification to the student.
                  </p>
                </div>
              )}

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
              {/* Render Sections for Jobs and Hackathons if they exist */}
              {detailsModal.data.jobApplications && detailsModal.data.jobApplications.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-purple-500" /> Job Applications ({detailsModal.data.jobApplications.length})
                  </h3>
                  <div className="space-y-3">
                    {detailsModal.data.jobApplications.map((app) => (
                      <div key={app._id} className="p-4 bg-purple-500/5 border border-purple-500/10 rounded-xl flex justify-between items-center">
                        <div>
                          <div className="text-white font-medium">{app.job?.title || 'Job Unavailable'}</div>
                          <div className="text-xs text-gray-400">{app.job?.company} • Status: <span className="capitalize text-purple-400 font-bold">{app.status}</span></div>
                        </div>
                        <div className="text-right text-[10px] text-gray-500">
                          {new Date(app.appliedAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {detailsModal.data.hackathonRegistrations && detailsModal.data.hackathonRegistrations.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-rose-500" /> Hackathon Registrations ({detailsModal.data.hackathonRegistrations.length})
                  </h3>
                  <div className="space-y-3">
                    {detailsModal.data.hackathonRegistrations.map((reg) => (
                      <div key={reg._id} className="p-4 bg-rose-500/5 border border-rose-500/10 rounded-xl flex justify-between items-center">
                        <div>
                          <div className="text-white font-medium">{reg.hackathonId?.title || 'Hackathon Unavailable'}</div>
                          <div className="text-xs text-gray-400">Team: {reg.teamName} • Status: <span className="capitalize text-rose-400 font-bold">{reg.status}</span></div>
                        </div>
                        <div className="text-right text-[10px] text-gray-500">
                          {new Date(reg.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Roadmaps Section */}
              {detailsModal.data.roadmapEnrollments && detailsModal.data.roadmapEnrollments.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-500" /> Roadmap Enrollments ({detailsModal.data.roadmapEnrollments.length})
                  </h3>
                  <div className="space-y-3">
                    {detailsModal.data.roadmapEnrollments.map((enr) => (
                      <div key={enr._id} className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl flex justify-between items-center">
                        <div>
                          <div className="text-white font-medium">{enr.roadmapId?.title || 'Roadmap Unavailable'}</div>
                          <div className="text-xs text-gray-400">Status: <span className="capitalize text-emerald-400 font-bold">{enr.status}</span></div>
                        </div>
                        <div className="text-right text-[10px] text-gray-500">
                          {enr.enrolledAt ? new Date(enr.enrolledAt).toLocaleDateString() : '-'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Roadmap Submissions Section */}
              {detailsModal.data.roadmapSubmissions && detailsModal.data.roadmapSubmissions.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                    <PlusCircle className="w-5 h-5 text-blue-500" /> Roadmap Project Submissions ({detailsModal.data.roadmapSubmissions.length})
                  </h3>
                  <div className="space-y-3">
                    {detailsModal.data.roadmapSubmissions.map((sub) => (
                      <div key={sub._id} className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="text-white font-medium">{sub.title}</div>
                            <div className="text-xs text-gray-400">Roadmap: {sub.roadmap?.title || 'Personal'} • Status: <span className="capitalize text-blue-400 font-bold">{sub.status}</span></div>
                          </div>
                          <div className="text-right">
                            <a href={sub.submissionUrl} target="_blank" rel="noreferrer" className="text-xs text-indigo-400 hover:text-indigo-300 font-bold">View Link</a>
                            <div className="text-[10px] text-gray-500 mt-1">{new Date(sub.createdAt).toLocaleDateString()}</div>
                          </div>
                        </div>
                        {sub.grade && (
                          <div className="mt-2 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded inline-block">Grade: {sub.grade}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Resume Access Section */}
              {detailsModal.data.resumeEnrollments && detailsModal.data.resumeEnrollments.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-indigo-500" /> Resume Template Access ({detailsModal.data.resumeEnrollments.length})
                  </h3>
                  <div className="space-y-3">
                    {detailsModal.data.resumeEnrollments.map((enr) => (
                      <div key={enr._id} className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-xl flex justify-between items-center">
                        <div>
                          <div className="text-white font-medium">{enr.templateId?.name || 'Template Unavailable'}</div>
                          <div className="text-xs text-gray-400">Category: {enr.templateId?.category || 'Standard'} • Unlocked: <span className="capitalize text-indigo-400 font-bold">{enr.status}</span></div>
                        </div>
                        <div className="text-right text-[10px] text-gray-500">
                          {enr.enrolledAt ? new Date(enr.enrolledAt).toLocaleDateString() : '-'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Gamification & Badges Section */}
              {detailsModal.data.gamification && (
                <div className="mt-8 border-t border-white/5 pt-8">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <Trophy className="w-6 h-6 text-yellow-500" /> Gamification & Badges
                    </h3>
                    <div className="flex gap-4">
                      <div className="bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30">
                        <span className="text-xs text-indigo-300 font-bold">Level {detailsModal.data.gamification.level}</span>
                      </div>
                      <div className="bg-yellow-500/20 px-3 py-1 rounded-full border border-yellow-500/30">
                        <span className="text-xs text-yellow-300 font-bold">{detailsModal.data.gamification.totalPoints} XP</span>
                      </div>
                    </div>
                  </div>

                  {detailsModal.data.gamification.badges && detailsModal.data.gamification.badges.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {detailsModal.data.gamification.badges.map((b, idx) => (
                        <div key={idx} className="p-3 bg-white/5 border border-white/10 rounded-xl flex flex-col items-center text-center group hover:bg-white/10 transition-all cursor-default">
                          <div className="text-3xl mb-2 filter drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] group-hover:scale-110 transition-transform">
                            {b.badgeId?.icon || '🏅'}
                          </div>
                          <div className="text-white text-xs font-bold truncate w-full">{b.badgeId?.name || 'Badge'}</div>
                          <div className="text-[9px] text-gray-500 mt-1 uppercase tracking-wider">{b.badgeId?.rarity || 'Common'}</div>
                          <div className="text-[8px] text-gray-600 mt-2">{new Date(b.earnedAt).toLocaleDateString()}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-white/5 rounded-xl border border-dashed border-white/10">
                      <Award className="w-8 h-8 text-gray-600 mx-auto mb-2 opacity-20" />
                      <p className="text-gray-500 text-sm italic">No badges earned yet</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStudents;
