require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes');
const courseRoutes = require('./src/routes/courseRoutes');
const quizRoutes = require('./src/routes/quizRoutes');
const jobRoutes = require('./src/routes/jobRoutes');
const achievementRoutes = require('./src/routes/achievementRoutes');
const enrollmentRoutes = require('./src/routes/enrollmentRoutes');
const hackathonRoutes = require('./src/routes/hackathonRoutes');
const hackathonRegistrationRoutes = require('./src/routes/hackathonRegistrationRoutes');
const webhookRoutes = require('./src/routes/webhookRoutes');

// Content routes
const branchRoutes = require('./src/routes/branchRoutes');
const educationLevelRoutes = require('./src/routes/educationLevelRoutes');
const subjectRoutes = require('./src/routes/subjectRoutes');
const semesterDataRoutes = require('./src/routes/semesterDataRoutes');
const folderRoutes = require('./src/routes/folderRoutes');

// Admin routes
const adminRoutes = require('./src/routes/adminRoutes');
const adminAuthRoutes = require('./src/routes/adminAuthRoutes');
const adminCourseRoutes = require('./src/routes/adminCourseRoutes');
const adminJobRoutes = require('./src/routes/adminJobRoutes');
const adminHackathonRoutes = require('./src/routes/adminHackathonRoutes');
const adminRoadmapRoutes = require('./src/routes/adminRoadmapRoutes');
const adminContentRoutes = require('./src/routes/adminContentRoutes');
const adminResumeRoutes = require('./src/routes/adminResumeRoutes');

// Admin content management routes
const adminBranchRoutes = require('./src/routes/adminBranchRoutes');
const adminEducationLevelRoutes = require('./src/routes/adminEducationLevelRoutes');
const adminSubjectRoutes = require('./src/routes/adminSubjectRoutes');
const adminSemesterDataRoutes = require('./src/routes/adminSemesterDataRoutes');
const adminFolderRoutes = require('./src/routes/adminFolderRoutes');

const errorHandler = require('./src/middlewares/errorHandler');

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// CORS Configuration
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://eshikshan.vercel.app',
    'https://www.eshikshan.vercel.app'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
// Increase body size limits to accept base64 images for profile/banner
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`\n📥 ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  next();
});

// Routes
console.log('📝 Loading routes...');
app.use('/api/auth', authRoutes);
console.log('✅ Auth routes loaded (includes /api/auth/certificates)');
app.use('/api/courses', courseRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/hackathons', hackathonRoutes);
app.use('/api/hackathon-registrations', hackathonRegistrationRoutes);
app.use('/api/webhooks', webhookRoutes);

// Content routes  
app.use('/api/branches', branchRoutes);
app.use('/api/education-levels', educationLevelRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/programs', semesterDataRoutes);
app.use('/api/folders', folderRoutes);

// Admin routes - IMPORTANT: More specific routes must come FIRST!
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/admin/courses', adminCourseRoutes);
app.use('/api/admin/jobs', adminJobRoutes);
app.use('/api/admin/hackathons', adminHackathonRoutes);
app.use('/api/admin/roadmaps', adminRoadmapRoutes);
app.use('/api/admin/content', adminContentRoutes);
app.use('/api/admin/resumes', adminResumeRoutes);
// Note: Legacy admin user routes are disabled to avoid route conflicts with new admin users endpoints
// const adminUserRoutes = require('./src/routes/adminUserRoutes');
// app.use('/api/admin/users', adminUserRoutes);
app.use('/api/admin', adminRoutes);

// Admin content management routes
app.use('/api/admin/branches', adminBranchRoutes);
app.use('/api/admin/education-levels', adminEducationLevelRoutes);
app.use('/api/admin/subjects', adminSubjectRoutes);
app.use('/api/admin/programs', adminSemesterDataRoutes);
app.use('/api/admin/folders', adminFolderRoutes);

// Error Handler
app.use(errorHandler);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Debug route to check loaded routes
app.get('/api/debug/routes', (req, res) => {
  const routes = [];
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      routes.push({
        path: middleware.route.path,
        methods: Object.keys(middleware.route.methods)
      });
    } else if (middleware.name === 'router') {
      middleware.handle.stack.forEach((handler) => {
        if (handler.route) {
          const path = middleware.regexp.source
            .replace('\\/?', '')
            .replace('(?=\\/|$)', '')
            .replace(/\\\//g, '/');
          routes.push({
            path: path + handler.route.path,
            methods: Object.keys(handler.route.methods)
          });
        }
      });
    }
  });
  res.json({ 
    totalRoutes: routes.length,
    routes: routes.filter(r => r.path.includes('certificate'))
  });
});

module.exports = app;
