const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy
const User = require('../models/User')

// ── Serialize / Deserialize ──────────────────────────────────────────
passport.serializeUser((user, done) => done(null, user._id))

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id).lean()
        done(null, user)
    } catch (err) {
        done(err)
    }
})

// ── Local Strategy (email + password) ────────────────────────────────
passport.use(new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    async (email, password, done) => {
        try {
            const user = await User.findOne({ email: email.toLowerCase().trim() })
            if (!user) return done(null, false, { message: 'Invalid email or password.' })
            if (!user.password) return done(null, false, { message: 'This account uses Google sign-in. Please use the Google button.' })
            const isMatch = await user.comparePassword(password)
            if (!isMatch) return done(null, false, { message: 'Invalid email or password.' })
            return done(null, user)
        } catch (err) {
            return done(err)
        }
    }
))

// ── Google OAuth 2.0 Strategy ────────────────────────────────────────
// Only register if credentials are configured
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL || '/auth/google/callback'
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Check if we already have this Google account
                let user = await User.findOne({ googleId: profile.id })
                if (user) return done(null, user)

                // Check if a local user exists with the same email
                const email = profile.emails && profile.emails[0] && profile.emails[0].value
                if (email) {
                    user = await User.findOne({ email: email.toLowerCase() })
                    if (user) {
                        // Link Google account to existing local user
                        user.googleId = profile.id
                        if (!user.avatar && profile.photos && profile.photos[0]) {
                            user.avatar = profile.photos[0].value
                        }
                        await user.save()
                        return done(null, user)
                    }
                }

                // Create new user from Google profile
                user = await User.create({
                    googleId: profile.id,
                    email: email,
                    displayName: profile.displayName || email,
                    avatar: (profile.photos && profile.photos[0] && profile.photos[0].value) || '',
                    provider: 'google',
                    role: 'learner'
                })
                return done(null, user)
            } catch (err) {
                return done(err)
            }
        }
    ))
}

module.exports = passport
