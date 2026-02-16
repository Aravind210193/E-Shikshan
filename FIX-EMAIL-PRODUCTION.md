# 📧 FIX EMAIL SENDING IN PRODUCTION

## 🔴 PROBLEM IDENTIFIED

Emails are **NOT sending in production** (public URI: https://e-shikshan.onrender.com).

**Root Cause**: Render deployment does NOT have the email environment variables (`EMAIL_USER` and `EMAIL_PASSWORD`) configured.

## ✅ SOLUTION: Set Environment Variables in Render

### Step 1: Access Render Dashboard

1. Go to: **https://dashboard.render.com**
2. Login with your credentials
3. Select your backend service: **e-shikshan** (or whatever you named it)

### Step 2: Add Environment Variables

1. In your service dashboard, click on **"Environment"** in the left sidebar
2. Click **"Add Environment Variable"** button
3. Add the following two variables:

#### Variable 1: EMAIL_USER
- **Key**: `EMAIL_USER`
- **Value**: `bhuchiki12@gmail.com`

#### Variable 2: EMAIL_PASSWORD
- **Key**: `EMAIL_PASSWORD`
- **Value**: `onoz awfd ewhm wari`

**⚠️ IMPORTANT**: The EMAIL_PASSWORD is a Gmail **App Password**, NOT your regular Gmail password.

### Step 3: Save and Redeploy

1. Click **"Save Changes"** (Render will automatically redeploy)
2. Wait 2-3 minutes for the deployment to complete
3. Check deployment logs for any errors

## 📋 Current Email Configuration

Your backend uses **Gmail SMTP** with nodemailer to send emails.

### Configuration Details:
```javascript
// Email Service
Service: 'gmail'
From: 'E-Shikshan Platform <bhuchiki12@gmail.com>'
Auth: {
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASSWORD
}
```

### Emails Being Sent:

1. **Welcome Email** (Google OAuth Registration)
   - **Trigger**: When user registers via Google Sign-In
   - **Recipient**: New user
   - **Subject**: "Welcome to E-Shikshan! 🚀"
   - **File**: `server/src/config/passport.js` (line 51)

2. **Course Assignment Notification** (Instructor)
   - **Trigger**: When admin assigns a course to an instructor
   - **Recipient**: Instructor
   - **Subject**: "🎓 New Course Assigned: [Course Title]"
   - **File**: `server/src/controllers/adminCourseController.js` (lines 220, 334, 853)

## 🧪 Test Email Functionality

After setting the environment variables in Render, test the email functionality:

### Test 1: Welcome Email (Google OAuth)
1. Logout from your E-Shikshan account
2. Visit: https://e-shikshan.vercel.app
3. Click "Sign in with Google"
4. Use a NEW Google account (one that hasn't registered before)
5. Check the email inbox for the welcome email

### Test 2: Course Assignment Email
1. Login to admin panel: https://eshikshan.vercel.app/admin
2. Go to Courses → Create New Course
3. Assign an instructor with valid email
4. Check the instructor's email inbox

## 🔒 Security: Gmail App Password

Your `.env` file currently has:
```env
EMAIL_USER=bhuchiki12@gmail.com
EMAIL_PASSWORD=onoz awfd ewhm wari
```

The `EMAIL_PASSWORD` is a Gmail **App Password** (not your regular Gmail password).

### ✅ How to Verify/Create Gmail App Password:

1. Go to: https://myaccount.google.com/apppasswords
2. Sign in with `bhuchiki12@gmail.com`
3. If you see existing App Passwords:
   - Look for "E-Shikshan" or similar
   - Use that password
4. If no App Password exists, create one:
   - Click "Generate"
   - Name: "E-Shikshan Production"
   - Copy the 16-character password
   - Update the `EMAIL_PASSWORD` in Render

**Note**: App Passwords are 16 characters without spaces, like: `abcd efgh ijkl mnop` (but entered as `abcdefghijklmnop`)

## 🐛 Troubleshooting

### Issue: Emails still not sending after setting env vars

**Check Render Logs:**
1. In Render Dashboard → Your Service
2. Click **"Logs"** tab
3. Look for email-related errors:
   ```
   ❌ Email sending failed: ...
   ```

**Common Errors:**

#### Error: "Invalid credentials"
**Solution**: Regenerate Gmail App Password
1. Go to: https://myaccount.google.com/apppasswords
2. Remove old App Password
3. Create new one
4. Update `EMAIL_PASSWORD` in Render

#### Error: "Less secure app access"
**Solution**: Gmail no longer supports "less secure apps". You MUST use App Passwords.

#### Error: "Username and Password not accepted"
**Solution**:
1. Verify `EMAIL_USER` is exactly: `bhuchiki12@gmail.com`
2. Verify `EMAIL_PASSWORD` has no spaces
3. Try regenerating App Password

### Issue: Email sends but recipient doesn't receive

**Check Spam folder**: Gmail may mark automated emails as spam.

**Solution**:
1. Check recipient's spam/junk folder
2. Mark the email as "Not Spam"
3. Add `bhuchiki12@gmail.com` to contacts

## 📊 Email Logs

The backend logs all email operations:

```bash
# Success
✅ Email sent successfully: <message-id>
📧 Welcome email sent to user@example.com
✅ Course assignment email sent to instructor@example.com

# Failure
❌ Email sending failed: [error message]
❌ Failed to send email: [error details]
```

To view logs in production:
1. Render Dashboard → Your Service → **Logs** tab
2. Search for "Email send" or "📧"

## 🚀 Quick Fix Checklist

- [ ] Go to https://dashboard.render.com
- [ ] Select your backend service (e-shikshan)
- [ ] Click "Environment" in sidebar
- [ ] Add `EMAIL_USER` = `bhuchiki12@gmail.com`
- [ ] Add `EMAIL_PASSWORD` = `onoz awfd ewhm wari`
- [ ] Click "Save Changes"
- [ ] Wait 2-3 minutes for redeployment
- [ ] Check deployment logs for "deployed successfully"
- [ ] Test by registering a new user or assigning a course
- [ ] Check email inbox (and spam folder)

## 🎯 Expected Behavior After Fix

✅ **Welcome emails** will be sent when users register via Google
✅ **Course assignment emails** will be sent when admin assigns courses to instructors
✅ Backend logs will show: `✅ Email sent successfully`
✅ Users will receive professional HTML emails

## 📝 Additional Environment Variables to Set (Optional)

While setting environment variables in Render, also verify these are set:

| Variable | Value | Purpose |
|----------|-------|---------|
| `MONGODB_URI` | `mongodb+srv://raja:eshikshansarasa@...` | Database connection |
| `JWT_SECRET` | `7dcab3a70ac4b907...` | JWT token signing |
| `FRONTEND_URL` | `https://eshikshan.vercel.app` | CORS and redirects |
| `EMAIL_USER` | `bhuchiki12@gmail.com` | ✅ **Need to add this** |
| `EMAIL_PASSWORD` | `onoz awfd ewhm wari` | ✅ **Need to add this** |
| `PORT` | `5000` | Server port (auto-set by Render) |

## 💡 Why This Issue Occurs

- **Local development**: Environment variables read from `.env` file ✅
- **Production (Render)**: `.env` files are NOT committed to Git (and shouldn't be) ❌
- **Solution**: Set environment variables directly in Render Dashboard ✅

The `.env` file is in `.gitignore`, so it never gets deployed. This is correct for security reasons, but it means you must manually configure environment variables in production.

---

## 🎉 After Fix

Once environment variables are set, emails will work perfectly in production, just like they do in localhost!
