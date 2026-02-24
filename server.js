const express = require('express')
const mongoose = require('mongoose')
const Article = require('./models/article')
const articleRouter = require('./routes/articles.js')
const methodOverride = require('method-override')
const nodemailer = require('nodemailer')
const session = require('express-session')
const app = express()

mongoose.connect('mongodb://localhost/blog', {
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
    secret: 'your-secret-key', // change this to a real secret
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
        res.redirect('/articles/new')
    } else {
        res.render('login', { error: 'Invalid credentials' })
    }
})

app.post('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/')
})

// Protected route for new article
app.get('/articles/new', requireAdmin, (req, res) => {
    res.render('articles/new', { article: new Article() })
})

// Nodemailer setup (configure with your SMTP details)
const transporter = nodemailer.createTransport({
    service: 'gmail', // or your email service
    auth: {
        user: 'your-email@gmail.com', // replace with your email
        pass: 'your-password' // replace with your password or app password
    }
})

app.get('/', async (req, res) => {
    try {
        const articles = await Article.find({ published: true }).sort({createdAt: 'desc'})
        res.render('articles/index', { articles: articles})
    } catch (error) {
        console.error('Error fetching articles:', error)
        res.render('articles/index', { articles: [] })
    }
})

app.get('/home', async (req, res) => {
    const articles =  await Article.find({ published: true }).sort({createdAt: 'desc'})
   res.render('articles/index', { articles: articles})
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
        to: 'robb@unrealstyle.com',
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

app.use('/articles', articleRouter)

app.listen(5000, () => {
    console.log('Server running on http://localhost:5000')
})