const express = require('express')
const passport = require('passport')
const User = require('../models/User')
const { ensureAuthenticated } = require('../middleware/auth')
const router = express.Router()

// ── Registration ─────────────────────────────────────────────────────
router.get('/register', (req, res) => {
    if (req.isAuthenticated()) return res.redirect('/italian')
    res.render('auth/register', { error: null })
})

router.post('/register', async (req, res) => {
    const { email, password, confirmPassword, displayName } = req.body
    try {
        if (!email || !password || !displayName) {
            return res.render('auth/register', { error: 'All fields are required.' })
        }
        if (password.length < 8) {
            return res.render('auth/register', { error: 'Password must be at least 8 characters.' })
        }
        if (password !== confirmPassword) {
            return res.render('auth/register', { error: 'Passwords do not match.' })
        }

        const existing = await User.findOne({ email: email.toLowerCase().trim() })
        if (existing) {
            return res.render('auth/register', { error: 'An account with that email already exists.' })
        }

        const user = await User.create({
            email: email.toLowerCase().trim(),
            password,
            displayName: displayName.trim(),
            provider: 'local'
        })

        // Auto-login after registration
        req.login(user, (err) => {
            if (err) return res.render('auth/register', { error: 'Account created but login failed. Please try logging in.' })
            res.redirect('/italian')
        })
    } catch (err) {
        console.error('Registration error:', err)
        res.render('auth/register', { error: 'Something went wrong. Please try again.' })
    }
})

// ── Login ────────────────────────────────────────────────────────────
router.get('/login', (req, res) => {
    if (req.isAuthenticated()) return res.redirect('/italian')
    res.render('auth/login', { error: null })
})

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err)
        if (!user) {
            return res.render('auth/login', { error: info ? info.message : 'Invalid credentials.' })
        }
        req.login(user, (err) => {
            if (err) return next(err)
            const returnTo = req.session.returnTo || '/italian'
            delete req.session.returnTo
            res.redirect(returnTo)
        })
    })(req, res, next)
})

// ── Google OAuth ─────────────────────────────────────────────────────
router.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}))

router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        const returnTo = req.session.returnTo || '/italian'
        delete req.session.returnTo
        res.redirect(returnTo)
    }
)

// ── Logout ───────────────────────────────────────────────────────────
router.post('/logout', (req, res) => {
    req.logout((err) => {
        if (err) console.error('Logout error:', err)
        req.session.destroy(() => {
            res.redirect('/')
        })
    })
})

// ── Profile ──────────────────────────────────────────────────────────
router.get('/profile', ensureAuthenticated, (req, res) => {
    res.render('auth/profile', { error: null, success: null })
})

router.post('/profile', ensureAuthenticated, async (req, res) => {
    const { displayName, currentPassword, newPassword, confirmNewPassword } = req.body
    try {
        const user = await User.findById(req.user._id)

        if (displayName && displayName.trim()) {
            user.displayName = displayName.trim()
        }

        // Password change (only for local accounts)
        if (newPassword) {
            if (user.provider !== 'local' && !user.password) {
                return res.render('auth/profile', { error: 'Google accounts cannot set a password here.', success: null })
            }
            if (!currentPassword) {
                return res.render('auth/profile', { error: 'Current password is required.', success: null })
            }
            const valid = await user.comparePassword(currentPassword)
            if (!valid) {
                return res.render('auth/profile', { error: 'Current password is incorrect.', success: null })
            }
            if (newPassword.length < 8) {
                return res.render('auth/profile', { error: 'New password must be at least 8 characters.', success: null })
            }
            if (newPassword !== confirmNewPassword) {
                return res.render('auth/profile', { error: 'New passwords do not match.', success: null })
            }
            user.password = newPassword
        }

        await user.save()
        res.render('auth/profile', { error: null, success: 'Profile updated.' })
    } catch (err) {
        console.error('Profile update error:', err)
        res.render('auth/profile', { error: 'Something went wrong.', success: null })
    }
})

module.exports = router
