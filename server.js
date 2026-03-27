const express = require('express')
const mongoose = require('mongoose')
const Article = require('./models/article')
const articleRouter = require('./routes/articles.js')
const methodOverride = require('method-override')
const nodemailer = require('nodemailer')
const session = require('express-session')
require('dotenv').config({ override: true })
const app = express()

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/blog', {
    useNewUrlParser: true, useUnifiedTopology: true 
})

const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'))
db.once('open', function() {
    console.log('Connected to MongoDB')
})

app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: false}))
app.use(methodOverride('_method'))
app.use(express.static(__dirname))

app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false
}))

// Middleware to set locals
app.use((req, res, next) => {
    res.locals.isAdmin = req.session.isAdmin
    next()
})

// Middleware to check if user is admin
function requireAdmin(req, res, next) {
    if (req.session.isAdmin) {
        return next()
    } else {
        res.redirect('/login')
    }
}

app.get('/login', (req, res) => {
    res.render('login', { error: null })
})

app.post('/login', (req, res) => {
    const { username, password } = req.body
    if (username === 'admin' && password === 'admin') {
        req.session.isAdmin = true
        res.redirect('/blog/new')
    } else {
        res.render('login', { error: 'Invalid credentials' })
    }
})

app.post('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/')
})

// Protected route for new article
app.get('/blog/new', requireAdmin, (req, res) => {
    res.render('articles/new', { article: new Article() })
})

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
app.use('/blog', articleRouter)
app.use('/italian', italianRouter)

app.listen(process.env.PORT || 5000, () => {
    const port = process.env.PORT || 5000
    const env = process.env.NODE_ENV || 'development'
    if (env === 'production') {
        console.log(`Node.js server running on port ${port} (internal, proxied through Nginx on ports 80/443)`)
    } else {
        console.log(`Server running on http://localhost:${port}`)
    }
})