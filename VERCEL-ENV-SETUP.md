# Vercel Environment Variables Setup

## IMPORTANT: Set Environment Variables in Vercel Dashboard

Your Vercel deployment needs these environment variables:

### Required Environment Variables

1. Go to: https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add the following:

**Variable Name:** `VITE_API_URL`  
**Value:** `https://e-shikshan.onrender.com/api`  
**Environment:** Production, Preview, Development (check all)

**Variable Name:** `VITE_RAZORPAY_KEY_ID`  
**Value:** `your_razorpay_key_id_here` (or your actual key)  
**Environment:** Production, Preview, Development (check all)

### After Adding Variables

1. Click **Save**
2. Go to **Deployments** tab
3. Click **Redeploy** on the latest deployment
4. Select **"Use existing Build Cache: No"**
5. Click **Redeploy**

## Why This is Needed

- Vercel does **NOT** read `.env` files from your repository
- Environment variables must be set in the Vercel dashboard
- Without `VITE_API_URL`, your frontend doesn't know where the backend is
- Vite only bundles env vars that start with `VITE_` and are set during build

## Check if Backend is Working

Test your Render backend:
```bash
curl https://e-shikshan.onrender.com/health
```

Should return: `{"status":"ok"}`

If backend is down:
1. Go to https://dashboard.render.com
2. Check your backend service status
3. Look at the logs for errors
4. Ensure the service is "Live" (not sleeping)

## Common Issues

### "Server not responding"
- Backend might be sleeping (Render free tier spins down after inactivity)
- First request after idle takes 30-60 seconds to wake up
- Solution: Upgrade to paid plan or use a keep-alive service

### API calls fail with 404
- Environment variable not set in Vercel
- Backend URL is incorrect
- Backend service is down

### CORS errors
- Check backend CORS configuration in `server/app.js`
- Ensure your Vercel domain is in the allowed origins list
