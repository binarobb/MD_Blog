require('dotenv').config()
const path = require('path')
const express = require('express')
const helmet = require('helmet')

// Fail fast if required env vars are missing
const REQUIRED_ENV = [
    'SESSION_SECRET',
    'MONGODB_URI',
    'RESEND_API_KEY',
    'EMAIL_TO',
    'ELEVENLABS_API_KEY',
    'ELEVENLABS_AGENT_ID',
]
const missingEnv = REQUIRED_ENV.filter(k => !process.env[k])
if (missingEnv.length) {
    throw new Error(`Missing required env vars: ${missingEnv.join(', ')} — refusing to start`)
}

process.on('uncaughtException', (err) => {
    console.error(`[${new Date().toISOString()}] UNCAUGHT EXCEPTION:`, err)
    process.exit(1)
})

process.on('unhandledRejection', (reason) => {
    console.error(`[${new Date().toISOString()}] UNHANDLED REJECTION:`, reason?.stack || reason)
    process.exit(1)
})

const mongoose = require('mongoose')

process.on('SIGTERM', () => {
    console.log(`[${new Date().toISOString()}] SIGTERM received — shutting down gracefully`)
    mongoose.connection.close(false, () => process.exit(0))
})

const Article = require('./models/article')
const articleRouter = require('./routes/articles.js')
const authRouter = require('./routes/auth')
const methodOverride = require('method-override')
const { Resend } = require('resend')
const validator = require('validator')
const session = require('express-session')
const MongoStore = require('connect-mongo').MongoStore
const passport = require('./config/passport')
const rateLimit = require('express-rate-limit')
const app = express()

const mongoUri = process.env.MONGODB_URI

mongoose.connect(mongoUri, {
    useNewUrlParser: true, useUnifiedTopology: true 
})

const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'))
db.once('open', function() {
    console.log('Connected to MongoDB')
})

app.set('view engine', 'ejs')
app.set('trust proxy', 1)

// Security headers
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", 'cdn.jsdelivr.net', '*.elevenlabs.io', 'esm.sh', '*.esm.sh'],
            scriptSrcAttr: ["'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'", 'cdn.jsdelivr.net', 'fonts.googleapis.com'],
            fontSrc: ["'self'", 'fonts.gstatic.com'],
            imgSrc: ["'self'", 'data:', 'lh3.googleusercontent.com', 'upload.wikimedia.org'],
            connectSrc: ["'self'", '*.elevenlabs.io', 'en.wikipedia.org', 'esm.sh', '*.esm.sh'],
            workerSrc: ["'self'", 'blob:'],
            manifestSrc: ["'none'"],
            baseUri: ["'self'"],
            formAction: ["'self'"],
            navigateTo: ["'self'"],
            mediaSrc: ["'self'", '*.elevenlabs.io'],
            frameSrc: ["'none'"],
            objectSrc: ["'none'"],
            upgradeInsecureRequests: []
        }
    }
}))

app.use(express.json())
app.use(express.urlencoded({ extended: false}))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: mongoUri,
        collectionName: 'sessions',
        ttl: 14 * 24 * 60 * 60  // 14 days
    }),
    cookie: {
        maxAge: 14 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production'
    }
}))

// Passport
app.use(passport.initialize())
app.use(passport.session())

// Global fallback rate limiter (applied first, before all routes)
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests, please try again later.',
    skip: (req) => req.path.startsWith('/public') || req.path.startsWith('/img')
})
app.use(globalLimiter)

// Contact form limiter: 5 submissions per 15 minutes per IP
const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many messages sent. Please wait before trying again.',
    standardHeaders: true,
    legacyHeaders: false
})

// ElevenLabs TTS limiter: 20 requests per hour per IP
const elevenLabsLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 20,
    message: 'Audio request limit reached. Please try again in an hour.',
    standardHeaders: true,
    legacyHeaders: false
})

// Rate limit on auth endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    message: 'Too many attempts, please try again later.',
    standardHeaders: true,
    legacyHeaders: false
})
app.use('/login', authLimiter)
app.use('/register', authLimiter)
app.use('/auth', authLimiter)

// Expose user and admin flag to all views
app.use((req, res, next) => {
    res.locals.user = req.user || null
    res.locals.isAdmin = !!(req.user && req.user.role === 'admin')
    next()
})

// Auth routes (login, register, OAuth, logout, profile)
app.use('/', authRouter)

// Resend email setup
const resend = new Resend(process.env.RESEND_API_KEY)

async function getCategories() {
    const cats = await Article.distinct('category', { published: true })
    return cats.filter(Boolean)
}

app.get('/', async (req, res) => {
    try {
        const recentArticles = await Article.find({ published: true }).sort({ createdAt: 'desc' }).limit(3)
        res.render('home', { recentArticles })
    } catch (error) {
        console.error('Error fetching recent articles:', error)
        res.render('home', { recentArticles: [] })
    }
})

app.get('/blog', async (req, res) => {
    try {
        const [articles, categories] = await Promise.all([
            Article.find({ published: true }).sort({ createdAt: 'desc' }),
            getCategories()
        ])
        res.render('articles/index', { articles, categories, currentCategory: null })
    } catch (error) {
        console.error('Error fetching articles:', error)
        res.render('articles/index', { articles: [], categories: [], currentCategory: null })
    }
})

app.get('/about', (req, res) => {
    res.render('about')
})

app.get('/contact', (req, res) => {
    res.render('contact')
})

app.post('/contact', contactLimiter, async (req, res) => {
    const { name, email, message } = req.body

    if (!name || name.trim().length < 1 || name.trim().length > 100) {
        return res.status(400).json({ success: false, message: 'Name must be between 1 and 100 characters.' })
    }
    if (!email || !validator.isEmail(email)) {
        return res.status(400).json({ success: false, message: 'Invalid email address.' })
    }
    if (!message || message.trim().length < 1 || message.trim().length > 5000) {
        return res.status(400).json({ success: false, message: 'Message must be between 1 and 5000 characters.' })
    }

    const safeName = name.trim().replace(/[\r\n]/g, ' ')  // strip newlines only — plain-text email, not HTML
    const safeEmail = validator.normalizeEmail(email) || email

    try {
        const { error } = await resend.emails.send({
            from: 'wiseops@unrealstyle.com',
            replyTo: safeEmail,
            to: process.env.EMAIL_TO,
            subject: `Contact Form Message from ${safeName}`,
            text: `Name: ${name.trim()}\nEmail: ${safeEmail}\n\nMessage:\n${message.trim()}`
        })
        if (error) {
            console.error('Resend error:', error)
            return res.status(500).json({ success: false, message: 'Error sending message. Please try again.' })
        }
        res.json({ success: true })
    } catch (e) {
        console.error('Resend exception:', e)
        res.status(500).json({ success: false, message: 'Error sending message. Please try again.' })
    }
})

app.get('/blog/tags/:tag', async (req, res) => {
    try {
        const tag = req.params.tag
        const [articles, categories] = await Promise.all([
            Article.find({ published: true, tags: tag }).sort({ createdAt: 'desc' }),
            getCategories()
        ])
        res.render('articles/index', { articles, categories, currentTag: tag, currentCategory: null })
    } catch (error) {
        console.error('Error fetching articles by tag:', error)
        res.render('articles/index', { articles: [], categories: [], currentTag: req.params.tag, currentCategory: null })
    }
})

app.get('/blog/categories/:category', async (req, res) => {
    try {
        const category = req.params.category
        const [articles, categories] = await Promise.all([
            Article.find({ published: true, category }).sort({ createdAt: 'desc' }),
            getCategories()
        ])
        res.render('articles/index', { articles, categories, currentCategory: category, currentTag: null })
    } catch (error) {
        console.error('Error fetching articles by category:', error)
        res.render('articles/index', { articles: [], categories: [], currentCategory: req.params.category, currentTag: null })
    }
})

const italianRouter = require('./routes/italian')
const elevenLabsRouter = require('./routes/elevenlabs')
app.use('/blog', articleRouter)
app.use('/italian', italianRouter)
app.use('/api/elevenlabs', elevenLabsLimiter, elevenLabsRouter)

// 404 handler
app.use((req, res) => {
    res.status(404).send('Not found')
})

// Global error handler — never expose stack traces or err.message to clients
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err)
    const isApi = req.originalUrl.startsWith('/api') || req.xhr
    if (isApi) {
        return res.status(500).json({ error: 'Internal server error' })
    }
    res.status(500).send('Internal server error')
})

app.listen(process.env.PORT || 5000, () => {
    const port = process.env.PORT || 5000
    const env = process.env.NODE_ENV || 'development'
    if (env === 'production') {
        console.log(`Node.js server running on port ${port} (internal, proxied through Nginx on ports 80/443)`)
    } else {
        console.log(`Server running on http://localhost:${port}`)
    }
})