const mongoose = require('mongoose')
const marked = require('marked')
const slugify = require('slugify')
const createDomPurify = require('dompurify')
const { JSDOM } = require('jsdom')
const dompurify = createDomPurify(new JSDOM().window)

const articleSchema = new mongoose.Schema({
   title: {
    type: String,
    required: true
   },
   description: {
    type: String
   },
   markdown: {
    type: String,
    required: true
   },
   createdAt: {
    type: Date,
    default: Date.now
   },
   slug: {
    type: String,
    required: true,
    unique: true
   },
   sanitizedHtml: {
    type: String,
    required: true
   },
   author: {
    type: String,
    default: 'Anonymous'
   },
   tags: [{
    type: String
   }],
   category: {
    type: String
   },
   featuredImage: {
    type: String
   },
   readingTime: {
    type: Number
   },
   published: {
    type: Boolean,
    default: true
   }
})

articleSchema.pre('validate', function(next) {
    if(this.title) {
        this.slug = slugify(this.title, { lower: true, strict: true})
    }
    if(this.markdown){
        this.sanitizedHtml = dompurify.sanitize(marked.parse(this.markdown, { breaks: true }))
        this.readingTime = Math.ceil(this.markdown.split(' ').length / 200)
    }
    next()
})
const articleCollection = process.env.MONGODB_COLLECTION || 'articles'
module.exports = mongoose.model('Article', articleSchema, articleCollection)