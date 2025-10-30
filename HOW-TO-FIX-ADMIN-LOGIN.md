# HOW TO FIX 401 ADMIN LOGIN ERROR

## The Problem
The admin login is returning 401 because:
1. No admin users exist in the database yet
2. The seeding script needs to be run successfully

## Quick Solution

### Step 1: Open MongoDB Compass
Download: https://www.mongodb.com/try/download/compass

### Step 2: Connect to your database
Use this connection string:
```
mongodb+srv://raja:eshikshansarasa@cluster0.wsbbkpp.mongodb.net/
```

### Step 3: Insert Admin User Manually
1. Find your database (likely named `test` or similar)
2. Find or create the `admins` collection
3. Click "ADD DATA" → "Insert Document"
4. Paste this EXACT JSON:

```json
{
  "name": "System Administrator",
  "email": "admin@eshikshan.com",
  "password": "$2a$10$N9qo8uLOickgx2ZMRZoMye/Xgdq7xVlhOFhOZM5zQJLCqZzZqLZBG",
  "role": "admin",
  "permissions": ["all"],
  "isActive": true,
  "createdAt": { "$date": "2025-10-30T00:00:00.000Z" },
  "updatedAt": { "$date": "2025-10-30T00:00:00.000Z" }
}
```

5. Click "Insert"

### Step 4: Login Credentials
Now you can login with:
- **Email**: `admin@eshikshan.com`
- **Password**: `admin123`

---

## Alternative: Run Seed Script in New Terminal

1. Close ALL terminals in VS Code
2. Open Windows PowerShell (not from VS Code)
3. Run:
```powershell
cd "C:\Users\SWARNA RAJA\Desktop\E-Shikshan-2"
node quick-seed-admins.js
```

If successful, you'll see:
```
✅ Admin users seeded successfully!
📧 LOGIN CREDENTIALS:
Email: admin@eshikshan.com
Password: admin123
```

---

## Verify It Worked

After adding the admin:
1. Go to http://localhost:5173/admin
2. Enter email: `admin@eshikshan.com`
3. Enter password: `admin123`
4. You should be redirected to the dashboard

---

## Still Having Issues?

Check that:
- ✅ Server is running on port 5000
- ✅ MongoDB connection is successful
- ✅ You're using the exact email: `admin@eshikshan.com`
- ✅ Password is exactly: `admin123` (no spaces)
