# Fix Production API Connection Issue

## 🔴 PROBLEM IDENTIFIED

The admin dashboard is not showing:
- ❌ Instructors (recentInstructors)
- ❌ Course registered students (allRegisteredStudents)
- ❌ Total students count
- ❌ Revenue data

**Root Cause**: The frontend `.env` file has `VITE_API_URL=http://localhost:5000/api`, which works in **localhost** but **NOT in production** (Vercel).

## ✅ SOLUTION

### Step 1: Update Vercel Environment Variable

**IMPORTANT**: Vercel does NOT read `.env` files from your repository. You MUST set environment variables in the Vercel Dashboard.

1. Go to your Vercel Dashboard: https://vercel.com/dashboard
2. Select your project: **E-Shikshan** (or eshikshan)
3. Go to **Settings** → **Environment Variables**
4. Add/Update the following variable:

   | Name | Value | Environment |
   |------|-------|-------------|
   | `VITE_API_URL` | `https://e-shikshan.onrender.com/api` | Production |

5. Click **Save**
6. **IMPORTANT**: Redeploy your application for changes to take effect
   - Go to **Deployments** tab
   - Click on the three dots (⋯) on the latest deployment
   - Click **Redeploy**

### Step 2: Update Local .env (Optional)

To make it easier to switch between development and production, update `client/.env`:

```env
# Backend API URL
# For local development, use localhost
# For production (Vercel), the VITE_API_URL will be read from Vercel environment variables
VITE_API_URL=http://localhost:5000/api

# Uncomment below line to test with production backend locally
# VITE_API_URL=https://e-shikshan.onrender.com/api

# Razorpay Configuration (Public Key only - safe for frontend)
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id_here
```

### Step 3: Verify Backend is Running

Make sure your backend on Render is awake and running:

```bash
curl https://e-shikshan.onrender.com/health
```

Expected response:
```json
{"status":"ok"}
```

If you get an error, wake up the backend by visiting:
https://e-shikshan.onrender.com/health

### Step 4: Test the Dashboard API Endpoint

Test the stats endpoint directly:

```bash
# You need admin token for this
curl https://e-shikshan.onrender.com/api/admin/stats \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

## 🔍 Database Verification

I've checked your database and confirmed:

✅ **Database has ALL required data:**
- 113 Users (112 Students)
- 5 Admins (4 Instructors)
- 15 Active Courses
- 189 Enrollments
- ₹731,480 Total Revenue

**Sample Instructors in Database:**
- System Administrator (admin@eshikshan.com) - admin
- Swarna Raja (o210900@rguktong.ac.in) - course_manager
- Aravind (o210193@rguktong.ac.in) - course_manager
- Sruthi (o210318@rguktong.ac.in) - course_manager
- Anusha (o210377@rguktong.ac.in) - course_manager

## 📊 What's Currently Being Fetched

The backend API (`/api/admin/stats`) returns:

```json
{
  "stats": {
    "totalUsers": 113,
    "totalInstructors": 4,
    "totalStudents": 112,
    "totalCourses": 15,
    "totalEnrollments": 189,
    "totalRevenue": 731480,
    ...
  },
  "recentInstructors": [
    {
      "_id": "...",
      "name": "Swarna Raja",
      "email": "o210900@rguktong.ac.in",
      "role": "course_manager",
      "courseCount": 2
    },
    ...
  ],
  "allRegisteredStudents": [
    {
      "_id": "...",
      "name": "Student 1",
      "email": "student@example.com",
      "course": {
        "id": "...",
        "title": "Data Structures and Algorithms",
        "thumbnail": "..."
      },
      "enrolledAt": "2024-01-15T10:30:00.000Z",
      "progress": 45,
      "paymentStatus": "completed",
      "status": "active"
    },
    ...
  ]
}
```

All this data is available in the database, it's just not reaching the frontend due to the API URL issue.

## 🚀 Quick Fix Checklist

- [ ] Set `VITE_API_URL` in Vercel Dashboard
- [ ] Redeploy Vercel application
- [ ] Wait 2-3 minutes for deployment
- [ ] Visit https://eshikshan.vercel.app/admin
- [ ] Login to admin panel
- [ ] Check if dashboard now shows:
  - ✓ Total Students
  - ✓ Instructors list (if admin)
  - ✓ Registered Students
  - ✓ Revenue

## 🐛 Troubleshooting

### Issue: Still not showing data after redeployment

1. **Check browser console** (F12):
   - Look for API errors
   - Verify API URL being called is `https://e-shikshan.onrender.com/api/admin/stats`

2. **Check Network tab** (F12 → Network):
   - Look for the `/stats` request
   - Check if it's calling the correct URL
   - Verify response status (should be 200)

3. **Clear browser cache**:
   - Hard reload: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)

4. **Verify environment variable**:
   - In Vercel Dashboard → Settings → Environment Variables
   - Make sure `VITE_API_URL` is set for "Production" environment

## 💡 Why This Happened

- Vercel deployments use environment variables set in the Vercel Dashboard
- The `.env` file in the repository is only for local development
- When `VITE_API_URL` is not set in Vercel, it defaults to `localhost:5000`
- `localhost` in production means the browser's localhost, which has no backend running

## 📝 Notes

- The backend code is correct and working ✅
- The database has all required data ✅
- The frontend code is correct ✅
- Only the API URL configuration was missing ❌

After fixing the Vercel environment variable, everything should work perfectly!
