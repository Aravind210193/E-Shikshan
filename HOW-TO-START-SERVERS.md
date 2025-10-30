# 🚀 How to Start E-Shikshan Servers

## ⚠️ Important: Start Backend FIRST, then Frontend

### 1️⃣ Start Backend Server (Port 5000)

```bash
# Open terminal 1
cd "c:\Users\SWARNA RAJA\Desktop\E-Shikshan-2\server"
npm start
```

**Expected output:**
```
Server is running on port 5000
MongoDB Connected...
```

### 2️⃣ Start Frontend Server (Port 5173)

```bash
# Open terminal 2 (separate terminal)
cd "c:\Users\SWARNA RAJA\Desktop\E-Shikshan-2\client"
npm run dev
```

**Expected output:**
```
VITE v... ready in ...ms
➜ Local: http://localhost:5173/
```

---

## ❌ Common Errors & Solutions

### Error: `ERR_CONNECTION_REFUSED` on port 5000

**Cause:** Backend server is not running

**Solution:**
1. Check if backend is running: Look for "Server is running on port 5000"
2. If not, start it: `cd server && npm start`
3. Wait for "MongoDB Connected" message
4. Then refresh frontend

---

### Error: MongoDB Connection Issues

**Check:**
1. Is MongoDB running?
2. Is `.env` file present in server folder?
3. Is `MONGODB_URI` correct in `.env`?

**Fix:**
```bash
# In server folder
# Check if .env exists
ls .env

# Verify MongoDB URI is set
# Should contain: MONGODB_URI=mongodb://...
```

---

### Error: Port Already in Use

**Backend (5000):**
```bash
# Windows PowerShell
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F
```

**Frontend (5173):**
```bash
netstat -ano | findstr :5173
taskkill /PID <PID_NUMBER> /F
```

---

## ✅ Verification Steps

### 1. Test Backend is Running
Open browser and go to:
```
http://localhost:5000/health
```
Should return: `{"status":"ok"}`

### 2. Test Frontend is Running
Open browser and go to:
```
http://localhost:5173
```
Should show E-Shikshan homepage

### 3. Test API Connection
Open DevTools Console on frontend and check for:
- No connection errors
- API requests going to `http://localhost:5000/api/...`

---

## 🔧 Quick Fix Checklist

- [ ] Backend server started (`npm start` in server folder)
- [ ] See "Server is running on port 5000" message
- [ ] See "MongoDB Connected" message  
- [ ] Frontend server started (`npm run dev` in client folder)
- [ ] Frontend opens at http://localhost:5173
- [ ] No console errors in browser

---

## 📝 Startup Order (IMPORTANT!)

```
1. Server (Backend) FIRST  → Port 5000
2. Client (Frontend) SECOND → Port 5173
```

**Why?** Frontend makes API calls to backend. If backend isn't running, all API calls will fail with `ERR_CONNECTION_REFUSED`.

---

## 🎯 Current Issue Fix

**Your Error:** `Failed to load resource: net::ERR_CONNECTION_REFUSED` on `:5000/api/admin/auth/login`

**Solution:**
1. Open a new terminal
2. Navigate to server folder: `cd "c:\Users\SWARNA RAJA\Desktop\E-Shikshan-2\server"`
3. Start backend: `npm start`
4. Wait for "Server is running on port 5000"
5. Go back to frontend and try login again

---

## 💡 Pro Tips

1. **Keep both terminals open** while developing
2. **Backend terminal** - Watch for API request logs
3. **Frontend terminal** - Watch for build/compile errors
4. Use **VS Code Split Terminal** for convenience
5. If you stop backend, frontend will break - always restart backend first

---

## 🆘 Still Not Working?

### Check Server Logs
Look in server terminal for errors like:
- `MongooseServerSelectionError` - MongoDB not connected
- `EADDRINUSE` - Port already in use
- Syntax errors in code

### Check Frontend Console
Press F12 in browser and look for:
- Red errors
- Network tab showing failed requests
- CORS errors

### Restart Everything
```bash
# Kill all processes
# Close both terminals
# Restart backend
cd server && npm start
# Restart frontend (in new terminal)
cd client && npm run dev
```

---

**Remember: Backend MUST be running for frontend to work! 🚀**
