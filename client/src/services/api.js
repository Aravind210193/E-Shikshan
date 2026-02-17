import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to attach the token
api.interceptors.request.use(
  (config) => {
    const finalURL = `${config.baseURL}${config.url}`;
    console.log(`API Request: ${config.method.toUpperCase()} ${finalURL}`);

    // Check if it's an admin/instructor endpoint (either starts with /admin or contains /admin/)
    const isAdminEndpoint = typeof config.url === 'string' &&
      (config.url.startsWith('/admin') || config.url.includes('/admin/'));

    const adminToken = sessionStorage.getItem('adminToken');
    const userToken = localStorage.getItem('token');

    if (isAdminEndpoint && adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    } else if (userToken) {
      config.headers.Authorization = `Bearer ${userToken}`;
    }
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.method.toUpperCase()} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.message);
    if (error.response) {
      console.error(`Status: ${error.response.status}, Data:`, error.response.data);
      const reqUrl = error.config?.url || '';
      if (error.response.status === 401) {
        // Same logic for identifying admin endpoints on response
        const isAdminEndpoint = typeof reqUrl === 'string' &&
          (reqUrl.startsWith('/admin') || reqUrl.includes('/admin/'));

        if (isAdminEndpoint) {
          console.log('Admin unauthorized, redirecting to admin login');
          sessionStorage.removeItem('adminToken');
          sessionStorage.removeItem('adminRole');
          sessionStorage.removeItem('adminData');
          window.location.href = '/admin';
        } else {
          console.log('User unauthorized, redirecting to login');
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
      }
    } else if (error.request) {
      console.error('No response received:', error.request);
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  saveResume: (resumeData) => api.put('/auth/resume', resumeData),
  getResume: () => api.get('/auth/resume'),
  getCertificates: () => api.get('/auth/certificates'),
  addCertificate: (data) => api.post('/auth/certificates', data),
  updateCertificate: (id, data) => api.put(`/auth/certificates/${id}`, data),
  deleteCertificate: (id) => api.delete(`/auth/certificates/${id}`)
};

export const coursesAPI = {
  getAll: (params) => api.get('/courses', { params }),
  getEnrolled: () => api.get('/courses/enrolled'),
  getCourse: (id) => api.get(`/courses/${id}`),
  enrollCourse: (id) => api.post(`/courses/${id}/enroll`)
};

export const enrollmentAPI = {
  enroll: (data) => api.post('/enrollments', data),
  processPayment: (enrollmentId, paymentData) => api.post(`/enrollments/${enrollmentId}/payment`, paymentData),
  verifyTransaction: (enrollmentId, transactionData) => api.post(`/enrollments/${enrollmentId}/verify-transaction`, transactionData),
  getMyCourses: () => api.get('/enrollments/my-courses'),
  getEnrollment: (id) => api.get(`/enrollments/${id}`),
  checkStatus: (courseId) => api.get(`/enrollments/check/${courseId}`),
  updateProgress: (enrollmentId, progressData) => api.put(`/enrollments/${enrollmentId}/progress`, progressData),
  deletePendingEnrollment: (id) => api.delete(`/enrollments/${id}`),
  // Payment webhook status
  getPaymentStatus: (orderId) => api.get(`/webhooks/payment-status/${orderId}`)
};

export const achievementsAPI = {
  getAll: () => api.get('/achievements'),
  getCertificates: () => api.get('/achievements/certificates')
};

export const jobsAPI = {
  getAll: (params) => api.get('/jobs', { params }),
  getById: (id) => api.get(`/jobs/${id}`),
  apply: (id, data) => api.post(`/job-applications/${id}/apply`, data),
  getMyApplications: () => api.get('/job-applications/my-applications'),
  // Admin/Instructor APIs
  getInstructorApplications: () => api.get('/job-applications/admin/applications'),
  updateApplicationStatus: (id, data) => api.put(`/job-applications/admin/${id}/status`, data),
  deleteApplication: (id) => api.delete(`/job-applications/admin/${id}`),
};

export const hackathonsAPI = {
  getAll: (params) => api.get('/hackathons', { params }),
  getById: (id) => api.get(`/hackathons/${id}`),
};

export const hackathonRegistrationAPI = {
  register: (hackathonId, data) => api.post(`/hackathon-registrations/${hackathonId}/register`, data),
  getMyRegistrations: () => api.get('/hackathon-registrations/my-registrations'),
  checkRegistration: (hackathonId) => api.get(`/hackathon-registrations/${hackathonId}/check`),
  cancelRegistration: (hackathonId) => api.delete(`/hackathon-registrations/${hackathonId}/cancel`),
  getInstructorRegistrations: () => api.get('/hackathon-registrations/admin/registrations'),
  // Admin/Instructor APIs
  updateRegistrationStatus: (id, data) => api.put(`/hackathon-registrations/admin/${id}/status`, data),
  deleteRegistration: (id) => api.delete(`/hackathon-registrations/admin/${id}`),
};

export const doubtsAPI = {
  create: (data) => api.post('/doubts', data),
};

export const projectSubmissionAPI = {
  submit: (data) => api.post('/project-submissions', data),
  getInstructorSubmissions: () => api.get('/project-submissions/instructor'),
  getMySubmissions: () => api.get('/project-submissions/student'),
  update: (id, data) => api.put(`/project-submissions/${id}`, data),
  reply: (id, data) => api.post(`/project-submissions/${id}/reply`, data),
  delete: (id) => api.delete(`/project-submissions/${id}`),
};

export const notificationAPI = {
  getNotifications: () => api.get('/notifications'),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllAsRead: () => api.patch('/notifications/read-all'),
  delete: (id) => api.delete(`/notifications/${id}`),
};

// Content API
export const contentAPI = {
  // Branches
  getAllBranches: () => api.get('/branches'),
  getBranchById: (id) => api.get(`/branches/${id}`),
  getBranchByTitle: (title) => api.get(`/branches/title/${title}`),

  // Education Levels
  getAllEducationLevels: () => api.get('/education-levels'),
  getEducationLevelById: (id) => api.get(`/education-levels/${id}`),
  getEducationLevelByName: (level) => api.get(`/education-levels/level/${level}`),

  // Subjects
  getAllSubjects: (params) => api.get('/subjects', { params }),
  getSubjectsByBranch: (branch) => api.get(`/subjects/branch/${branch}`),
  getSubjectsByBranchAndSemester: (branch, semester) => api.get(`/subjects/branch/${branch}/semester/${semester}`),

  // Programs (Semester Data)
  getAllPrograms: () => api.get('/programs'),
  getProgramByKey: (programKey) => api.get(`/programs/${programKey}`),
  getSemesterData: (programKey, semesterNumber) => api.get(`/programs/${programKey}/semester/${semesterNumber}`),

  // Folders
  getAllFolders: (params) => api.get('/folders', { params }),
  getFoldersByBranch: (branch) => api.get(`/folders/branch/${branch}`),
  getFolderByBranchAndSubject: (branch, subject) => api.get(`/folders/branch/${branch}/subject/${subject}`),
};

export const adminAPI = {
  // Dashboard
  getStats: () => api.get('/admin/stats'),

  // User Management
  getAllUsers: (params) => api.get('/admin/users', { params }),
  getUserById: (id) => api.get(`/admin/users/${id}`),
  updateUserRole: (id, data) => api.put(`/admin/users/${id}/role`, data),
  createUser: (data) => api.post('/admin/users', data),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),

  // Enrollment Management
  grantCourseAccess: (data) => api.post('/admin/enrollments/grant', data),
  revokeCourseAccess: (id) => api.put(`/admin/enrollments/${id}/revoke`),
  restoreCourseAccess: (id) => api.put(`/admin/enrollments/${id}/restore`),
  deleteEnrollment: (id) => api.delete(`/admin/enrollments/${id}`)
};

export const resumeTemplateAPI = {
  getAll: () => api.get('/resume-templates')
};

export default api;