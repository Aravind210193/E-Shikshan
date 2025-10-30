# 🔐 Admin Login System - Complete Guide

## Overview

The E-Shikshan platform has a **fully functional admin login system** with JWT-based authentication and role-based access control.

---

## 🎯 Admin Login Page

### Location
- **Route:** `/admin`
- **File:** `client/src/pages/Admin/AdminLogin.jsx`
- **URL:** `http://localhost:5173/admin`

### Features
- 🎨 Modern, professional UI with animations
- 🔒 Secure JWT token authentication
- 👁️ Show/hide password toggle
- ⏳ Loading states during authentication
- ✅ Success/error notifications
- 🔄 Role-based automatic redirection
- 📱 Responsive design

---

## 🔑 How to Login

### Step 1: Navigate to Admin Login
Open your browser and go to:
```
http://localhost:5173/admin
```

### Step 2: Enter Credentials

**Default Admin Account:**
- **Email:** `admin@eshikshan.com`
- **Password:** `admin123`

**Course Manager Account** (if created):
- **Email:** `courses@eshikshan.com`
- **Password:** `course123`

### Step 3: Automatic Redirection

After successful login, you'll be redirected based on your role:
- **Admin (Superadmin)** → `/admin/dashboard`
- **Course Manager** → `/admin/courses`

---

## 🛡️ Authentication Flow

### Frontend (AdminLogin.jsx)
```javascript
1. User enters email and password
2. Form submits to adminAuthAPI.login()
3. API calls POST /api/admin/auth/login
4. Backend verifies credentials
5. Backend returns { token, admin } object
6. Frontend stores:
   - adminToken in localStorage
   - adminRole in localStorage
   - adminData in localStorage
7. Frontend redirects based on role
8. All future admin API calls include token
```

### Backend (adminAuthController.js)
```javascript
1. Receives { email, password }
2. Finds admin by email in database
3. Compares password with bcrypt
4. Generates JWT token (30 days expiry)
5. Returns { success: true, token, admin }
6. If error, returns 401 Unauthorized
```

---

## 🔐 Admin Authentication Middleware

### File: `server/src/middlewares/adminAuth.js`

### Purpose
Protects all admin routes from unauthorized access.

### How It Works

#### 1. Token Extraction
```javascript
const token = req.header('Authorization')?.replace('Bearer ', '');
```
- Looks for `Authorization` header
- Extracts token after "Bearer "
- Returns 401 if no token found

#### 2. Token Verification
```javascript
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```
- Verifies JWT signature
- Decodes token payload
- Returns 401 if token invalid/expired

#### 3. Admin Lookup
```javascript
const admin = await Admin.findById(decoded.id);
```
- Finds admin in database by ID
- Checks if admin exists
- Checks if admin is active (`isActive: true`)
- Returns 401 if admin not found or inactive

#### 4. Request Enrichment
```javascript
req.admin = admin;
next();
```
- Attaches admin object to request
- Contains: name, email, role, permissions
- Available in all route handlers

---

## 🚦 Protected Routes

### All Admin Routes Require Authentication

#### Admin Management
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/users` - List all users
- `POST /api/admin/users` - Create user
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user

#### Course Management
- `GET /api/admin/courses` - List all courses
- `POST /api/admin/courses` - Create course
- `PUT /api/admin/courses/:id` - Update course
- `DELETE /api/admin/courses/:id` - Delete course

#### Content Management
- `GET /api/admin/branches` - List branches
- `POST /api/admin/branches` - Create branch
- `PUT /api/admin/branches/:id` - Update branch
- `DELETE /api/admin/branches/:id` - Delete branch
- Similar for: education-levels, subjects, programs, folders

#### Job Management
- `GET /api/admin/jobs` - List jobs
- `POST /api/admin/jobs` - Create job
- `PUT /api/admin/jobs/:id` - Update job
- `DELETE /api/admin/jobs/:id` - Delete job

#### Hackathon Management
- `GET /api/admin/hackathons` - List hackathons
- `POST /api/admin/hackathons` - Create hackathon
- `PUT /api/admin/hackathons/:id` - Update hackathon
- `DELETE /api/admin/hackathons/:id` - Delete hackathon

---

## 👥 Admin Roles & Permissions

### Roles

#### 1. Admin (Superadmin)
- **Role:** `admin`
- **Permissions:** `["all"]`
- **Access:** Everything - full control
- **Redirects to:** `/admin/dashboard`

#### 2. Course Manager
- **Role:** `course_manager`
- **Permissions:** `["courses", "content"]`
- **Access:** Only course and content management
- **Redirects to:** `/admin/courses`

### Permission System

The `checkPermission(requiredPermission)` middleware:

```javascript
// Allow if:
1. Admin has role "admin" (superadmin) → Full access
2. Admin has permission "all" → Full access
3. Admin has specific required permission → Limited access
```

**Example:**
```javascript
// Only admins with "courses" permission can access
router.post('/', checkPermission('courses'), createCourse);
```

---

## 🔒 Security Features

### 1. JWT Token Security
- ✅ Secret key from environment variable
- ✅ 30-day expiration
- ✅ Signed with HS256 algorithm
- ✅ Payload contains only admin ID

### 2. Password Security
- ✅ Bcrypt hashing (10 salt rounds)
- ✅ Never stored in plain text
- ✅ Compared using bcrypt.compare()

### 3. Request Security
- ✅ Token sent in Authorization header
- ✅ Token validated on every request
- ✅ Admin status checked (isActive)
- ✅ Automatic logout on 401 response

### 4. Frontend Security
- ✅ Token stored in localStorage
- ✅ Interceptor adds token to requests
- ✅ Automatic redirect on unauthorized
- ✅ Token removed on logout

---

## 📊 Admin Model Schema

```javascript
{
  name: String,           // Admin's full name
  email: String,          // Unique email (login ID)
  password: String,       // Bcrypt hashed password
  role: String,           // 'admin' or 'course_manager'
  permissions: [String],  // Array of permissions
  isActive: Boolean,      // Account status
  createdAt: Date,        // Account creation date
  updatedAt: Date         // Last update date
}
```

---

## 🚀 Creating Admin Users

### Option 1: MongoDB Atlas (Recommended)

1. Go to https://cloud.mongodb.com/
2. Click on your cluster → Browse Collections
3. Find `admins` collection
4. Click "Insert Document"
5. Paste this JSON:

```json
{
  "name": "System Administrator",
  "email": "admin@eshikshan.com",
  "password": "$2a$10$N9qo8uLOickgx2ZMRZoMye/Xgdq7xVlhOFhOZM5zQJLCqZzZqLZBG",
  "role": "admin",
  "permissions": ["all"],
  "isActive": true,
  "createdAt": {"$date": "2025-10-30T00:00:00.000Z"},
  "updatedAt": {"$date": "2025-10-30T00:00:00.000Z"}
}
```

6. Click "Insert"

**Login with:**
- Email: `admin@eshikshan.com`
- Password: `admin123`

### Option 2: MongoDB Compass

1. Download: https://www.mongodb.com/try/download/compass
2. Connect using your MongoDB URI
3. Navigate to `admins` collection
4. Click "Add Data" → "Insert Document"
5. Paste the same JSON as above
6. Click "Insert"

---

## 🧪 Testing Admin Login

### Test 1: Valid Login
```
1. Go to http://localhost:5173/admin
2. Enter email: admin@eshikshan.com
3. Enter password: admin123
4. Click "Admin Login"
5. ✅ Should redirect to /admin/dashboard
6. ✅ Should see success toast
7. ✅ Token stored in localStorage
```

### Test 2: Invalid Email
```
1. Enter email: wrong@example.com
2. Enter password: admin123
3. Click "Admin Login"
4. ❌ Should show error: "Invalid admin credentials"
5. ❌ Should stay on login page
```

### Test 3: Invalid Password
```
1. Enter email: admin@eshikshan.com
2. Enter password: wrongpassword
3. Click "Admin Login"
4. ❌ Should show error: "Invalid admin credentials"
5. ❌ Should stay on login page
```

### Test 4: Protected Route Access
```
1. Don't login
2. Go to http://localhost:5173/admin/dashboard
3. ❌ Should redirect to /admin (login page)
4. ❌ Should show "No authentication token"
```

---

## 🛠️ Troubleshooting

### Issue: 401 Unauthorized
**Cause:** No admin users in database  
**Solution:** Create admin user via MongoDB Atlas (see above)

### Issue: "Admin not found or inactive"
**Cause:** Admin has `isActive: false`  
**Solution:** Update admin document, set `isActive: true`

### Issue: "Token is not valid"
**Cause:** JWT_SECRET mismatch or expired token  
**Solution:** 
- Check `JWT_SECRET` in server/.env
- Clear localStorage and login again

### Issue: Network Error
**Cause:** Backend not running  
**Solution:**
```powershell
cd server
node server.js
```

### Issue: Password Not Working
**Cause:** Wrong password hash  
**Solution:** Use provided password hash for 'admin123':
```
$2a$10$N9qo8uLOickgx2ZMRZoMye/Xgdq7xVlhOFhOZM5zQJLCqZzZqLZBG
```

---

## 📱 Admin API Endpoints

### Authentication
- `POST /api/admin/auth/login` - Login (public)
- `GET /api/admin/auth/profile` - Get profile (protected)
- `POST /api/admin/auth/register` - Register new admin (protected)
- `POST /api/admin/auth/logout` - Logout (protected)

---

## ✅ Summary

**Admin Login System Status:** ✅ **FULLY FUNCTIONAL**

**Components:**
- ✅ Login page at `/admin` with modern UI
- ✅ JWT-based authentication
- ✅ Role-based access control
- ✅ Permission system
- ✅ Protected routes with `adminAuth` middleware
- ✅ Automatic token handling
- ✅ Secure password hashing
- ✅ Error handling & validation

**Ready to Use:** YES - Just create admin user in MongoDB and login!

---

**Last Updated:** October 30, 2025
