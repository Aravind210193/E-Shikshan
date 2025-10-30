# 🔧 Admin Token Issue - Troubleshooting Guide

## Issue: "Token Not Found" Error

### Quick Fix Steps:

#### 1. Clear Browser Storage
Open browser console (F12) and run:
```javascript
localStorage.clear();
sessionStorage.clear();
```
Then refresh the page.

#### 2. Verify You're on the Login Page
- Admin login page: `http://localhost:5173/admin`
- **NOT** the dashboard: `http://localhost:5173/admin/dashboard`

#### 3. Check the Login Flow

**Correct Flow:**
1. Go to `http://localhost:5173/admin`
2. Enter credentials:
   - Email: `admin@eshikshan.com`
   - Password: `admin123`
3. Click "Admin Login"
4. System should:
   - Call `POST /api/admin/auth/login` (NO token needed)
   - Receive JWT token in response
   - Store in `localStorage.adminToken`
   - Redirect to dashboard

#### 4. If Error Occurs AFTER Login (on Dashboard)

This means your admin token is missing or expired:

**Solution:**
```javascript
// Open browser console
console.log('Admin Token:', localStorage.getItem('adminToken'));
console.log('Admin Role:', localStorage.getItem('adminRole'));
```

If either is null/undefined:
- Logout and login again
- Check if admin user exists in MongoDB

#### 5. Server-Side Check

Make sure server is running:
```powershell
cd server
node server.js
```

Should see:
```
Server is running on port 5000
MongoDB Connected: ...
```

### Common Scenarios:

#### Scenario A: Error on Login Page
❌ **This shouldn't happen** - login route is public

**Fix:**
- Clear localStorage
- Refresh page
- Check browser console for actual error

#### Scenario B: Error on Dashboard/Protected Page
✅ **This is expected** if not logged in

**Fix:**
- Go back to `/admin` and login
- Check if token exists: `localStorage.getItem('adminToken')`

#### Scenario C: Error After Successful Login
❌ **Token not being saved**

**Fix in `client/src/pages/Admin/AdminLogin.jsx`:**
```javascript
// After successful login, verify:
const { token, admin } = response.data;
localStorage.setItem('adminToken', token);  // Make sure this runs
console.log('Saved token:', token);
```

### Debug Commands:

**Check localStorage:**
```javascript
// In browser console
console.log('All storage:', {
  adminToken: localStorage.getItem('adminToken'),
  adminRole: localStorage.getItem('adminRole'),
  userToken: localStorage.getItem('token')
});
```

**Test API Manually:**
```javascript
// In browser console
fetch('http://localhost:5000/api/admin/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@eshikshan.com',
    password: 'admin123'
  })
})
.then(r => r.json())
.then(d => console.log('Response:', d))
.catch(e => console.error('Error:', e));
```

### The Problem:

You're likely:
1. ✅ Trying to access `/admin/dashboard` directly without logging in first
2. ✅ Have an expired/invalid token in localStorage
3. ✅ Or the admin user doesn't exist in MongoDB

### The Solution:

1. **Clear storage** → `localStorage.clear()`
2. **Go to login** → `http://localhost:5173/admin`
3. **Login with valid credentials**
4. **Token gets saved automatically**
5. **Dashboard access granted**

### If Still Not Working:

**Check this file:** `client/src/services/adminApi.js`

The interceptor should NOT add token for login requests:
```javascript
adminAPI.interceptors.request.use(
  (config) => {
    // Skip token for login
    if (config.url === '/auth/login') {
      return config;
    }
    
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }
);
```

---

**Most Likely Issue:** You're trying to access a protected admin route without being logged in. Solution: Go to `/admin` and login first!
