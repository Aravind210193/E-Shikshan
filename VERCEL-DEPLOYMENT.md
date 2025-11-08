# Vercel Deployment Fix

## Changes Made

1. **Added `vercel.json`** - Configures Vercel to:
   - Build from the `client` directory
   - Run `npm install && npm run build` in client folder
   - Output to `client/dist`
   - Handle SPA routing with rewrites

2. **Added `.node-version`** - Specifies Node.js 20 for deployment

3. **Updated `client/package.json`** - Added engines specification:
   ```json
   "engines": {
     "node": ">=18.0.0",
     "npm": ">=9.0.0"
   }
   ```

## Deployment Steps

### Option 1: Redeploy from Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Select your project
3. Click "Deployments" tab
4. Click "Redeploy" on the latest deployment
5. Select "Use existing Build Cache: No"
6. Click "Redeploy"

### Option 2: Trigger New Deployment
The push to GitHub should automatically trigger a new deployment.

## Troubleshooting

If deployment still fails:

1. **Check Build Logs** in Vercel dashboard
2. **Verify Root Directory**: Should be `/` (repository root)
3. **Build Command**: Should auto-detect or use: `cd client && npm run build`
4. **Output Directory**: Should be `client/dist`
5. **Install Command**: Should be `cd client && npm install`

## Environment Variables

Make sure these are set in Vercel:
- `VITE_API_URL` = Your backend API URL

## Local Testing

Test build locally before deploying:
```bash
cd client
npm install
npm run build
```

Build should complete without errors and create `client/dist` folder.
