import axios from 'axios';

const API_URL = 'http://localhost:5000/api/admin';

// Create axios instance with default config
const adminAPI = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests (skip for login endpoint)
adminAPI.interceptors.request.use(
  (config) => {
    // Don't add token for login request
    if (config.url === '/auth/login') {
      return config;
    }
    
    const token = localStorage.getItem('adminToken');
    if (token && token !== 'admin-authenticated' && token !== 'course-manager') {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth APIs
export const adminAuthAPI = {
  login: (email, password) => adminAPI.post('/auth/login', { email, password }),
  getProfile: () => adminAPI.get('/auth/profile'),
  register: (data) => adminAPI.post('/auth/register', data),
  logout: () => adminAPI.post('/auth/logout'),
};

// User Management APIs
export const adminUserAPI = {
  getAll: (params) => adminAPI.get('/users', { params }),
  getById: (id) => adminAPI.get(`/users/${id}`),
  create: (data) => adminAPI.post('/users', data),
  update: (id, data) => adminAPI.put(`/users/${id}`, data),
  delete: (id) => adminAPI.delete(`/users/${id}`),
  getStats: () => adminAPI.get('/users/stats'),
};

// Course Management APIs
export const adminCourseAPI = {
  getAll: (params) => adminAPI.get('/courses', { params }),
  getById: (id) => adminAPI.get(`/courses/${id}`),
  create: (data) => adminAPI.post('/courses', data),
  update: (id, data) => adminAPI.put(`/courses/${id}`, data),
  delete: (id) => adminAPI.delete(`/courses/${id}`),
  getStats: () => adminAPI.get('/courses/stats'),
};

// Job Management APIs
export const adminJobAPI = {
  getAll: (params) => adminAPI.get('/jobs', { params }),
  getById: (id) => adminAPI.get(`/jobs/${id}`),
  create: (data) => adminAPI.post('/jobs', data),
  update: (id, data) => adminAPI.put(`/jobs/${id}`, data),
  delete: (id) => adminAPI.delete(`/jobs/${id}`),
  getStats: () => adminAPI.get('/jobs/stats'),
};

// Hackathon Management APIs
export const adminHackathonAPI = {
  getAll: (params) => adminAPI.get('/hackathons', { params }),
  getById: (id) => adminAPI.get(`/hackathons/${id}`),
  create: (data) => adminAPI.post('/hackathons', data),
  update: (id, data) => adminAPI.put(`/hackathons/${id}`, data),
  delete: (id) => adminAPI.delete(`/hackathons/${id}`),
  getStats: () => adminAPI.get('/hackathons/stats'),
};

// Roadmap Management APIs
export const adminRoadmapAPI = {
  getAll: (params) => adminAPI.get('/roadmaps', { params }),
  getById: (id) => adminAPI.get(`/roadmaps/${id}`),
  create: (data) => adminAPI.post('/roadmaps', data),
  update: (id, data) => adminAPI.put(`/roadmaps/${id}`, data),
  delete: (id) => adminAPI.delete(`/roadmaps/${id}`),
  getStats: () => adminAPI.get('/roadmaps/stats'),
};

// Content Management APIs
export const adminContentAPI = {
  getAll: (params) => adminAPI.get('/content', { params }),
  getById: (id) => adminAPI.get(`/content/${id}`),
  create: (data) => adminAPI.post('/content', data),
  update: (id, data) => adminAPI.put(`/content/${id}`, data),
  delete: (id) => adminAPI.delete(`/content/${id}`),
  getStats: () => adminAPI.get('/content/stats'),
};

// Resume Templates Management APIs
export const adminResumeAPI = {
  getAll: (params) => adminAPI.get('/resumes', { params }),
  getById: (id) => adminAPI.get(`/resumes/${id}`),
  create: (data) => adminAPI.post('/resumes', data),
  update: (id, data) => adminAPI.put(`/resumes/${id}`, data),
  delete: (id) => adminAPI.delete(`/resumes/${id}`),
  getStats: () => adminAPI.get('/resumes/stats'),
};

// Branch Management APIs
export const adminBranchAPI = {
  getAll: (params) => adminAPI.get('/branches', { params }),
  getById: (id) => adminAPI.get(`/branches/${id}`),
  create: (data) => adminAPI.post('/branches', data),
  update: (id, data) => adminAPI.put(`/branches/${id}`, data),
  delete: (id) => adminAPI.delete(`/branches/${id}`),
  toggleStatus: (id) => adminAPI.patch(`/branches/${id}/toggle-status`),
};

// Education Level Management APIs
export const adminEducationLevelAPI = {
  getAll: (params) => adminAPI.get('/education-levels', { params }),
  getById: (id) => adminAPI.get(`/education-levels/${id}`),
  create: (data) => adminAPI.post('/education-levels', data),
  update: (id, data) => adminAPI.put(`/education-levels/${id}`, data),
  delete: (id) => adminAPI.delete(`/education-levels/${id}`),
  addBranch: (id, data) => adminAPI.post(`/education-levels/${id}/branches`, data),
  removeBranch: (id, branchId) => adminAPI.delete(`/education-levels/${id}/branches/${branchId}`),
};

// Subject Management APIs
export const adminSubjectAPI = {
  getAll: (params) => adminAPI.get('/subjects', { params }),
  getById: (id) => adminAPI.get(`/subjects/${id}`),
  create: (data) => adminAPI.post('/subjects', data),
  update: (id, data) => adminAPI.put(`/subjects/${id}`, data),
  delete: (id) => adminAPI.delete(`/subjects/${id}`),
  addSubject: (id, data) => adminAPI.post(`/subjects/${id}/subjects`, data),
  removeSubject: (id, subjectId) => adminAPI.delete(`/subjects/${id}/subjects/${subjectId}`),
};

// Program (Semester Data) Management APIs
export const adminProgramAPI = {
  getAll: (params) => adminAPI.get('/programs', { params }),
  getById: (id) => adminAPI.get(`/programs/${id}`),
  create: (data) => adminAPI.post('/programs', data),
  update: (id, data) => adminAPI.put(`/programs/${id}`, data),
  delete: (id) => adminAPI.delete(`/programs/${id}`),
  updateSemester: (id, data) => adminAPI.put(`/programs/${id}/semester`, data),
};

// Folder Management APIs
export const adminFolderAPI = {
  getAll: (params) => adminAPI.get('/folders', { params }),
  getById: (id) => adminAPI.get(`/folders/${id}`),
  create: (data) => adminAPI.post('/folders', data),
  update: (id, data) => adminAPI.put(`/folders/${id}`, data),
  delete: (id) => adminAPI.delete(`/folders/${id}`),
  addUnit: (id, data) => adminAPI.post(`/folders/${id}/units`, data),
  updateUnit: (id, unitId, data) => adminAPI.put(`/folders/${id}/units/${unitId}`, data),
  removeUnit: (id, unitId) => adminAPI.delete(`/folders/${id}/units/${unitId}`),
};

export default adminAPI;
