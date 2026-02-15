# Quick Start Commands - Mobile Responsive E-Shikshan

## 🚀 Start Development

### Start Client (Frontend)
```bash
cd client
npm install  # If dependencies needed
npm run dev
```
**Access:** http://localhost:5173

### Start Server (Backend)
```bash
cd server
npm install  # If dependencies needed
npm start
```
**Access:** http://localhost:5000

---

## 📱 Test on Mobile Device

### Step 1: Find Your Local IP

**Windows:**
```bash
ipconfig
# Look for IPv4 Address (e.g., 192.168.1.100)
```

**Mac/Linux:**
```bash
ifconfig
# OR
hostname -I
```

### Step 2: Access from Phone

```
http://YOUR_IP:5173
```

**Example:**
```
http://192.168.1.100:5173
```

**Note:** Make sure your phone is on the same WiFi network!

---

## 🧪 Test Responsive Design (Browser)

### Chrome DevTools
```
1. F12 (Open DevTools)
2. Ctrl+Shift+M (Toggle Device Toolbar)
3. Select device:
   - iPhone SE (375px)
   - iPhone 12 Pro (390px)
   - iPad (768px)
   - Responsive (custom)
```

### Firefox Responsive Design Mode
```
1. Ctrl+Shift+M
2. Choose device or set custom size
```

---

## 🔍 Check for Errors

### Client Errors
```bash
cd client
npm run build
# Check for any build errors
```

### Lint Check
```bash
cd client
npm run lint
# (if configured)
```

---

## 📦 Build for Production

### Client Build
```bash
cd client
npm run build
# Output: dist/
```

### Server Build (if needed)
```bash
cd server
npm run build
# (if configured)
```

---

## 🎯 Quick Viewport Tests

### Test These Sizes:
```
- 375px  (iPhone SE - Smallest)
- 390px  (iPhone 12/13 Pro)
- 414px  (iPhone Plus)
- 768px  (iPad Portrait)
- 1024px (iPad Landscape / Small Desktop)
- 1280px (Desktop)
- 1920px (Large Desktop)
```

---

## 🔧 Useful VS Code Shortcuts

### For Development:
```
Ctrl+`          - Open Terminal
Ctrl+B          - Toggle Sidebar
F5              - Start Debugging
Ctrl+Shift+F    - Search in Files
Alt+Click       - Multi-cursor
Ctrl+/          - Toggle Comment
```

---

## 📊 Performance Check

### Lighthouse (Chrome)
```
1. F12 (DevTools)
2. Lighthouse Tab
3. Generate Report
4. Check:
   - Performance
   - Accessibility
   - Best Practices
   - SEO
```

---

## 🛠️ Common Issues & Fixes

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5173 | xargs kill -9
```

### Clear Node Modules
```bash
rm -rf node_modules
rm package-lock.json
npm install
```

### Clear Build Cache
```bash
cd client
rm -rf dist
rm -rf node_modules/.vite
npm run build
```

---

## 🎨 Tailwind CSS Dev

### Watch for Changes (if needed)
```bash
cd client
npx tailwindcss -i ./src/index.css -o ./dist/output.css --watch
```

### Rebuild Tailwind
```bash
npm run build:css
# (if configured)
```

---

## 📱 Mobile Testing Checklist

Quick test list:
```
□ Navigation menu opens/closes
□ All buttons are tappable
□ Text is readable without zoom
□ No horizontal scroll
□ Images load and scale properly
□ Forms work correctly (no zoom on iOS)
□ Modals display properly
□ Cards stack correctly on mobile
□ Touch feedback works (active states)
□ Smooth scrolling
```

---

## 🚀 Deploy Commands

### Deploy to Vercel (if configured)
```bash
vercel --prod
```

### Deploy to Netlify (if configured)
```bash
netlify deploy --prod
```

---

## 📝 Git Commands

### Commit Changes
```bash
git add .
git commit -m "feat: Added mobile responsiveness to entire platform"
git push origin main
```

### Create Feature Branch
```bash
git checkout -b feature/mobile-responsive
git push -u origin feature/mobile-responsive
```

---

## 🔥 Hot Tips

### Keyboard Shortcuts for Testing:
- **Ctrl+Shift+M** - Toggle device toolbar
- **Ctrl+Shift+C** - Inspect element
- **Ctrl+Shift+R** - Hard refresh (clear cache)
- **F12** - Open DevTools

### Quick Mobile Test:
```bash
# Open in mobile simulator
start chrome "http://localhost:5173" --user-agent="Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)"
```

---

**Ready to test!** Start with `npm run dev` in the client folder.
