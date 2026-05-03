const express = require('express')
const Article = require('./../models/article')
const { ensureAdmin } = require('../middleware/auth')
const router = express.Router()

module.exports = router

router.get('/new', ensureAdmin, (req, res) => {
    res.render('articles/new', { article: new Article() })
})

router.get('/edit/:id', ensureAdmin, async (req, res, next) => {
    try {
        const article = await Article.findById(req.params.id)
        if (!article) return res.redirect('/blog')
        res.render('articles/edit', { article: article })
    } catch (e) {
        next(e)
    }
})

router.get('/:slug', async (req, res, next) => {
    try {
        const article = await Article.findOne({ slug: req.params.slug })
        if (article == null) return res.redirect('/blog')
        res.render('articles/show', { article: article })
    } catch (e) {
        next(e)
    }
})

router.post('/', ensureAdmin, async (req, res, next) => {
   req.article = new Article()
   next()
  }, saveArticleAndRedirect('new'))


router.put('/:id', ensureAdmin, async (req, res, next) => {
    try {
        req.article = await Article.findById(req.params.id)
        next()
    } catch (e) {
        next(e)
    }
}, saveArticleAndRedirect('edit'))

router.delete('/:id', ensureAdmin, async (req, res, next) => {
    try {
        await Article.findByIdAndDelete(req.params.id)
        res.redirect('/blog')
    } catch (e) {
        next(e)
    }
})

function saveArticleAndRedirect(path) {
    return async (req, res) => {
        let article = req.article
        article.title = req.body.title
        article.description = req.body.description
        article.markdown = req.body.markdown
        article.author = req.body.author
        article.category = req.body.category
        article.tags = req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : []
        article.featuredImage = req.body.featuredImage
        article.published = req.body.published ? true : false
          try {
              article = await article.save()
              res.redirect(`/blog/${article.slug}`)
          } catch (e) {
              console.error('Article save error:', e)
              res.render(`articles/${path}`, { article: article })
          }
        }
    }

module.exports = router