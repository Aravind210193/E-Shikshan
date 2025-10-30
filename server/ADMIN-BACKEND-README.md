# Admin Panel Backend API

Complete backend implementation for E-Shikshan Admin Panel with authentication, CRUD operations, and role-based access control.

## 🚀 Features

- ✅ JWT-based authentication
- ✅ Role-based access control (Admin & Course Manager)
- ✅ Complete CRUD operations for Users, Courses, and Jobs
- ✅ MongoDB database integration
- ✅ Password hashing with bcrypt
- ✅ Statistics and analytics endpoints
- ✅ Error handling middleware
- ✅ Input validation

## 📁 File Structure

```
server/
├── src/
│   ├── models/
│   │   ├── Admin.js              # Admin user model
│   │   ├── AdminUser.js          # Platform user model
│   │   ├── AdminCourse.js        # Course model
│   │   └── AdminJob.js           # Job model
│   ├── controllers/
│   │   ├── adminAuthController.js
│   │   ├── adminUserController.js
│   │   ├── adminCourseController.js
│   │   └── adminJobController.js
│   ├── routes/
│   │   ├── adminAuthRoutes.js
│   │   ├── adminUserRoutes.js
│   │   ├── adminCourseRoutes.js
│   │   └── adminJobRoutes.js
│   └── middlewares/
│       └── adminAuth.js          # Auth & permission middleware
├── seedAdmins.js                 # Seed initial admin users
└── app.js                        # Main app with routes
```

## 🔧 Setup Instructions

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Environment Variables

Create `.env` file in server directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/eshikshan
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

### 3. Seed Admin Users

Run this command to create initial admin accounts:

```bash
npm run seed:admins
```

This will create:
- **Super Admin**: admin@eshikshan.com / admin123
- **Course Manager**: courses@eshikshan.com / course123

### 4. Start Server

```bash
npm run dev
```

Server will run on `http://localhost:5000`

## 📡 API Endpoints

### Authentication

#### Login
```http
POST /api/admin/auth/login
Content-Type: application/json

{
  "email": "admin@eshikshan.com",
  "password": "admin123"
}

Response:
{
  "success": true,
  "token": "jwt-token-here",
  "admin": {
    "id": "...",
    "name": "System Administrator",
    "email": "admin@eshikshan.com",
    "role": "admin",
    "permissions": ["all"]
  }
}
```

#### Get Profile
```http
GET /api/admin/auth/profile
Authorization: Bearer {token}
```

#### Register New Admin (Super Admin only)
```http
POST /api/admin/auth/register
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "New Admin",
  "email": "newadmin@eshikshan.com",
  "password": "password123",
  "role": "course_manager",
  "permissions": ["courses"]
}
```

### User Management

#### Get All Users
```http
GET /api/admin/users?search=john&status=Active&page=1&limit=10
Authorization: Bearer {token}
```

#### Get User by ID
```http
GET /api/admin/users/:id
Authorization: Bearer {token}
```

#### Create User
```http
POST /api/admin/users
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "role": "Student",
  "status": "Active"
}
```

#### Update User
```http
PUT /api/admin/users/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "John Doe Updated",
  "status": "Inactive"
}
```

#### Delete User
```http
DELETE /api/admin/users/:id
Authorization: Bearer {token}
```

#### Get User Statistics
```http
GET /api/admin/users/stats
Authorization: Bearer {token}

Response:
{
  "success": true,
  "stats": {
    "total": 100,
    "active": 85,
    "pending": 10,
    "inactive": 5
  }
}
```

### Course Management

#### Get All Courses
```http
GET /api/admin/courses?search=web&category=UG&status=Active&page=1&limit=10
Authorization: Bearer {token}
```

#### Create Course
```http
POST /api/admin/courses
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Web Development Bootcamp",
  "category": "Professional",
  "level": "Beginner",
  "duration": "12 weeks",
  "status": "Active",
  "description": "Complete web development course",
  "instructor": "Jane Smith"
}
```

#### Update Course
```http
PUT /api/admin/courses/:id
Authorization: Bearer {token}
```

#### Delete Course
```http
DELETE /api/admin/courses/:id
Authorization: Bearer {token}
```

#### Get Course Statistics
```http
GET /api/admin/courses/stats
Authorization: Bearer {token}
```

### Job Management

#### Get All Jobs
```http
GET /api/admin/jobs?search=developer&type=Full-time&status=Active
Authorization: Bearer {token}
```

#### Create Job
```http
POST /api/admin/jobs
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Frontend Developer",
  "company": "Tech Corp",
  "location": "Bangalore",
  "type": "Full-time",
  "salary": "₹8-12 LPA",
  "status": "Active",
  "description": "Looking for frontend developer",
  "requirements": ["React", "JavaScript", "CSS"],
  "responsibilities": ["Build UI", "Code review"]
}
```

#### Update Job
```http
PUT /api/admin/jobs/:id
Authorization: Bearer {token}
```

#### Delete Job
```http
DELETE /api/admin/jobs/:id
Authorization: Bearer {token}
```

#### Get Job Statistics
```http
GET /api/admin/jobs/stats
Authorization: Bearer {token}
```

## 🔐 Authentication & Authorization

### JWT Token
All protected routes require JWT token in Authorization header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Roles & Permissions

#### Admin (Super Admin)
- Full access to all endpoints
- Can manage all resources
- Can create new admin accounts
- Permissions: `["all"]`

#### Course Manager
- Access only to course management
- Cannot access user or job management
- Cannot create admin accounts
- Permissions: `["courses"]`

### Permission Middleware

The `checkPermission` middleware checks if admin has required permission:

```javascript
router.get('/users', adminAuth, checkPermission('users'), getAllUsers);
```

## 🗄️ Database Models

### Admin Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: 'admin' | 'course_manager',
  permissions: ['all', 'users', 'courses', 'jobs', ...],
  isActive: Boolean,
  lastLogin: Date,
  timestamps: true
}
```

### AdminUser Model
```javascript
{
  name: String,
  email: String (unique),
  role: 'Student' | 'Premium' | 'Instructor',
  status: 'Active' | 'Inactive' | 'Pending',
  courses: Number,
  resumes: Number,
  registered: Date,
  timestamps: true
}
```

### AdminCourse Model
```javascript
{
  title: String,
  category: 'UG' | 'PG' | 'Intermediate' | 'Professional',
  level: 'Beginner' | 'Intermediate' | 'Advanced',
  duration: String,
  students: Number,
  status: 'Active' | 'Draft' | 'Inactive',
  published: Date,
  description: String,
  instructor: String,
  thumbnail: String,
  timestamps: true
}
```

### AdminJob Model
```javascript
{
  title: String,
  company: String,
  location: String,
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship',
  salary: String,
  applicants: Number,
  status: 'Active' | 'Pending' | 'Closed',
  posted: Date,
  description: String,
  requirements: [String],
  responsibilities: [String],
  timestamps: true
}
```

## 🔄 Frontend Integration

### Update Frontend API Calls

The frontend now uses the new API service (`client/src/services/adminApi.js`):

```javascript
import { adminAuthAPI, adminUserAPI, adminCourseAPI, adminJobAPI } from '../../services/adminApi';

// Login
const response = await adminAuthAPI.login(email, password);

// Get users
const users = await adminUserAPI.getAll({ search, status, page, limit });

// Create course
const course = await adminCourseAPI.create(formData);

// Update job
const job = await adminJobAPI.update(id, formData);

// Delete user
await adminUserAPI.delete(id);
```

## 🧪 Testing

### Test Login
```bash
curl -X POST http://localhost:5000/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@eshikshan.com","password":"admin123"}'
```

### Test Protected Route
```bash
curl -X GET http://localhost:5000/api/admin/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🛡️ Security Features

1. **Password Hashing**: Bcrypt with salt rounds
2. **JWT Tokens**: Secure token generation with expiry (7 days)
3. **Role-Based Access**: Middleware checks permissions
4. **Input Validation**: Required fields validation
5. **Error Handling**: Centralized error middleware
6. **CORS**: Configured for frontend origin
7. **Token Verification**: Middleware validates JWT

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

## 🚨 Common Issues & Solutions

### Issue: "Token is not valid"
**Solution**: Token expired or invalid. Login again to get new token.

### Issue: "Access denied. Insufficient permissions"
**Solution**: User doesn't have permission for this resource. Check role and permissions.

### Issue: "Admin already exists"
**Solution**: Email already registered. Use different email.

### Issue: Connection refused
**Solution**: Make sure MongoDB is running and connection string is correct.

## 📝 Development Notes

- All passwords are hashed before storage
- JWT secret should be changed in production
- MongoDB indexes created automatically
- Timestamps added to all documents
- Soft delete can be implemented later
- Add input sanitization for production
- Implement rate limiting for security

## 🎯 Next Steps

1. Add file upload for course thumbnails
2. Implement pagination metadata
3. Add bulk operations
4. Add email notifications
5. Implement activity logs
6. Add data export (CSV, PDF)
7. Add advanced search filters
8. Implement caching (Redis)

---

**Created**: January 2025  
**Version**: 1.0.0  
**Status**: Production Ready
