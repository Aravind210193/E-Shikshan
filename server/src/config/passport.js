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
        // Check if user already exists with this email
        let user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
          // User exists, update Google ID if not set
          if (!user.googleId) {
            user.googleId = profile.id;
            user.profilePicture = user.profilePicture || profile.photos[0]?.value;
            await user.save();
          }
          return done(null, user);
        }

        // Create new user - ONLY with verified Google email
        user = new User({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          profilePicture: profile.photos[0]?.value,
          emailVerified: true, // Google emails are pre-verified
          role: 'student'
        });

        await user.save();
        done(null, user);
      } catch (error) {
        console.error('Google OAuth Error:', error);
        done(error, null);
      }
    }
  )
);

module.exports = passport;
