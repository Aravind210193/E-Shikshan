# Google OAuth Setup Guide

This guide will help you set up Google OAuth authentication for E-Shikshan platform.

## Why Google OAuth?

✅ **Benefits:**
- Only verified Google email addresses can register
- No dummy/fake emails allowed
- Enhanced security with Google's authentication
- Users don't need to remember another password
- Email verification handled by Google

## Setup Instructions

### 1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API"
   - Click "Enable"

4. Create OAuth 2.0 Credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - For local development: `http://localhost:5000/api/auth/google/callback`
     - For production: `https://your-domain.com/api/auth/google/callback`
   - Copy the Client ID and Client Secret

### 2. Update Server Environment Variables

Add to your `server/.env` file:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Client URL (for redirects after auth)
CLIENT_URL=http://localhost:5173

# Session Secret (generate a random string)
SESSION_SECRET=your_random_session_secret_here
```

### 3. Install Dependencies

```bash
cd server
npm install
```

New dependencies added:
- `passport` - Authentication middleware
- `passport-google-oauth20` - Google OAuth 2.0 strategy
- `express-session` - Session management
- `googleapis` - Google APIs client library

### 4. Update Database

The User model has been updated to support:
- `googleId` - Stores Google OAuth ID
- `emailVerified` - Tracks email verification status
- Password is now optional (not required for Google OAuth users)

Existing users will continue to work normally.

### 5. Test the Integration

**Development:**
1. Start the server: `npm run dev`
2. Start the client: `npm run dev`
3. Go to `/login` or `/signin`
4. Click "Sign in with Google"
5. Select your Google account
6. You'll be redirected to `/auth/success` and then to `/profile`

**Production:**
- Update `GOOGLE_CALLBACK_URL` with your production domain
- Update `CLIENT_URL` with your production frontend URL
- Add production callback URL to Google Console

## Features Implemented

### Backend
✅ Google OAuth 2.0 integration with Passport.js
✅ Email validation - blocks dummy email domains
✅ Direct registration disabled (only Google OAuth allowed)
✅ Automatic user creation with verified email
✅ Existing users can link Google accounts
✅ Secure session management
✅ JWT token generation for authenticated users

### Frontend
✅ "Sign in with Google" button on Login page
✅ "Continue with Google" button on Signin page
✅ OAuth callback handler (`/auth/success`)
✅ Security notices about verified emails only
✅ Automatic profile redirect after successful auth
✅ Error handling for failed authentication

## Security Features

🔒 **Email Verification:** Only real, verified Google emails accepted
🔒 **No Dummy Emails:** Blocks common fake email domains
🔒 **Secure Sessions:** Using express-session with secret key
🔒 **JWT Tokens:** Secure authentication tokens
🔒 **HTTPS Ready:** Production-ready with secure cookies

## Blocked Email Domains

The following dummy domains are blocked:
- test.com
- example.com
- dummy.com
- fake.com
- temp.com

Users MUST use real email providers like:
✅ Gmail (@gmail.com)
✅ Outlook (@outlook.com, @hotmail.com)
✅ Yahoo (@yahoo.com)
✅ Educational institutions (@university.edu)
✅ Corporate emails (@company.com)

## Troubleshooting

### Error: "Redirect URI mismatch"
- Verify the callback URL in Google Console matches your `.env` file exactly
- Include the protocol (http:// or https://)
- Check for trailing slashes

### Error: "Authentication failed"
- Check that GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are correct
- Verify Google+ API is enabled in Google Console
- Check server logs for detailed error messages

### Users can't register
- This is intentional! Direct registration is disabled
- All users must use "Sign in with Google" button
- This ensures only verified emails are used

## Migration for Existing Users

Existing users with email/password can:
1. Continue logging in with email/password
2. OR use "Sign in with Google" with the same email
   - System will link their Google account automatically
   - They can use either method going forward

## Admin Panel

Admin users are created separately and don't use Google OAuth.
Regular admin authentication remains unchanged.

## Need Help?

Check these resources:
- [Passport.js Documentation](http://www.passportjs.org/)
- [Google OAuth 2.0 Guide](https://developers.google.com/identity/protocols/oauth2)
- [Express Session Guide](https://github.com/expressjs/session)
