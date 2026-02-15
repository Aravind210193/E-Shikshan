const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

const sendEmail = require('../utils/sendEmail');

// Helper callback for welcome email
const sendWelcomeEmail = async (user) => {
  const emailHTML = `
    <!DOCTYPE html>
    <html>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f4f7;">
      <div style="max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
        <div style="background: #4f46e5; padding: 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Welcome to E-Shikshan! 🚀</h1>
        </div>
        <div style="padding: 30px; color: #333333; line-height: 1.6;">
          <h2 style="color: #111827;">Hello ${user.name},</h2>
          <p>We are thrilled to have you join our learning community!</p>
          <p>Here at E-Shikshan, we are dedicated to helping you achieve your career goals with top-tier courses, hands-on projects, and expert mentorship.</p>
          
          <div style="background: #eef2ff; border-left: 4px solid #4f46e5; padding: 20px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Your journey starts now!</strong> Explore our courses and start building your future.</p>
          </div>
          
          <p>If you have any questions, simply reply to this email - we're here to help.</p>
          <p style="margin-top: 20px;">Happy Learning,<br><strong>The E-Shikshan Team</strong></p>
        </div>
        <div style="background: #f3f4f6; padding: 20px; text-align: center; color: #6b7280; font-size: 12px;">
          <p>© 2026 E-Shikshan Platform. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await sendEmail({
      to: user.email,
      subject: 'Welcome to E-Shikshan! 🚀',
      html: emailHTML,
      text: `Welcome to E-Shikshan, ${user.name}! We're excited to have you on board.`
    });
    console.log(`📧 Welcome email sent to ${user.email}`);
  } catch (err) {
    console.error('Failed to send welcome email:', err);
  }
};

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
      passReqToCallback: true
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        let user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
          // User exists, update Google ID if missing
          if (!user.googleId) {
            user.googleId = profile.id;
            user.profilePicture = user.profilePicture || profile.photos[0]?.value;
            await user.save();
          }
          return done(null, user);
        }

        // Create new user
        user = new User({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          profilePicture: profile.photos[0]?.value,
          emailVerified: true,
          role: 'student'
        });

        await user.save();

        // Send welcome email asynchronously
        sendWelcomeEmail(user);

        done(null, user);
      } catch (error) {
        console.error('Google OAuth Error:', error);
        done(error, null);
      }
    }
  )
);

module.exports = passport;
