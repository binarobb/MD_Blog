require('dotenv').config({ override: true })
const express = require('express')
const mongoose = require('mongoose')
const Article = require('./models/article')
const articleRouter = require('./routes/articles.js')
const authRouter = require('./routes/auth')
const methodOverride = require('method-override')
const nodemailer = require('nodemailer')
const session = require('express-session')
const MongoStore = require('connect-mongo').MongoStore
const passport = require('./config/passport')
const rateLimit = require('express-rate-limit')
const app = express()

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost/blog'

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

app.use(express.json())
app.use(express.urlencoded({ extended: false}))
app.use(methodOverride('_method'))
app.use(express.static(__dirname))

app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
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

// Nodemailer setup
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
})

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

app.post('/contact', (req, res) => {
    const { name, email, message } = req.body
    const mailOptions = {
        from: email,
        to: process.env.EMAIL_TO || 'admin@intentionalowl.io',
        subject: `Contact Form Message from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error)
            res.send('Error sending message. Please try again.')
        } else {
            console.log('Email sent: ' + info.response)
            res.send('Message sent successfully!')
        }
    })
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
app.use('/api/elevenlabs', elevenLabsRouter)

app.listen(process.env.PORT || 5000, () => {
    const port = process.env.PORT || 5000
    const env = process.env.NODE_ENV || 'development'
    if (env === 'production') {
        console.log(`Node.js server running on port ${port} (internal, proxied through Nginx on ports 80/443)`)
    } else {
        console.log(`Server running on http://localhost:${port}`)
    }
})