# Fix Vercel Deployment - Configure Root Directory

## The Problem
Vercel is trying to deploy from the repository root, but your frontend code is in the `client/` folder.

## Solution: Set Root Directory in Vercel

### Method 1: Via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Select your project** (E-Shikshan)
3. **Go to Settings → General**
4. **Scroll to "Root Directory"**
5. **Click "Edit"**
6. **Enter:** `client`
7. **Click "Save"**
8. **Go to Deployments tab**
9. **Redeploy** the latest deployment (uncheck "Use cache")

### Method 2: Via vercel.json (Already Done)

I've updated `vercel.json` to work once you set the Root Directory.

## After Setting Root Directory

Your build will now:
1. Start from the `client/` folder
2. Run `npm install` (finds `client/package.json`)
3. Run `npm run build` (runs Vite build)
4. Output to `client/dist`

## Environment Variables (Still Required!)

Don't forget to set these in **Settings → Environment Variables**:

- `VITE_API_URL` = `https://e-shikshan.onrender.com/api`
- `VITE_RAZORPAY_KEY_ID` = `your_razorpay_key_id_here`

## Expected Build Output

After fixing:
```
✓ Running "install" command: npm install
✓ Running "build" command: npm run build
✓ vite v7.0.5 building for production...
✓ 3027 modules transformed.
✓ built in ~3-4 minutes
```

## Quick Checklist

- [ ] Set Root Directory to `client` in Vercel Settings
- [ ] Set VITE_API_URL environment variable
- [ ] Set VITE_RAZORPAY_KEY_ID environment variable
- [ ] Redeploy without cache
- [ ] Check backend is awake on Render.com

## Alternative: Deploy Only Client Folder

If you want to keep things separate:
1. Create a new Vercel project
2. When importing, select **only** the `client` folder
3. Or use Vercel CLI: `cd client && vercel`
