// Require any authenticated user (local or OAuth)
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) return next()
    // API routes get JSON; pages get redirect
    if (req.originalUrl.startsWith('/api') || req.originalUrl.includes('/api/') || req.xhr) {
        return res.status(401).json({ error: 'Authentication required' })
    }
    req.session.returnTo = req.originalUrl
    res.redirect('/login')
}

// Require admin role
function ensureAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.role === 'admin') return next()
    if (req.originalUrl.startsWith('/api') || req.originalUrl.includes('/api/') || req.xhr || req.originalUrl.includes('/admin/')) {
        return res.status(403).json({ error: 'Admin access required' })
    }
    res.redirect('/login')
}

module.exports = { ensureAuthenticated, ensureAdmin }
