const express = require('express')
const router = express.Router()

const VocabCategory    = require('../models/italian/VocabCategory')
const VocabItem        = require('../models/italian/VocabItem')
const Verb             = require('../models/italian/Verb')
const GrammarTopic     = require('../models/italian/GrammarTopic')
const GrammarQuestion  = require('../models/italian/GrammarQuestion')
const SentenceExercise = require('../models/italian/SentenceExercise')

// ── Page render ──────────────────────────────────────────────────────
router.get('/', (req, res) => {
    res.render('italian/index', {
        agentId: process.env.ELEVENLABS_AGENT_ID || '',
        cdnBase: process.env.CDN_BASE || ''
    })
})

// ── API: Vocabulary ──────────────────────────────────────────────────

// GET /api/italian/vocab/categories
router.get('/api/vocab/categories', async (req, res) => {
    try {
        const categories = await VocabCategory.find().sort({ order: 1 })
        res.json(categories)
    } catch (err) {
        res.status(500).json({ error: 'Failed to load categories' })
    }
})

// GET /api/italian/vocab/:category  (category = slug, e.g. "food-drink")
router.get('/api/vocab/:category', async (req, res) => {
    try {
        const category = await VocabCategory.findOne({ slug: req.params.category })
        if (!category) return res.status(404).json({ error: 'Category not found' })

        const page  = Math.max(1, parseInt(req.query.page)  || 1)
        const limit = Math.min(100, parseInt(req.query.limit) || 100)
        const skip  = (page - 1) * limit

        const items = await VocabItem.find({ category: category._id })
            .select('-__v')
            .skip(skip)
            .limit(limit)

        res.json({ category: category.name, slug: category.slug, items })
    } catch (err) {
        res.status(500).json({ error: 'Failed to load vocabulary' })
    }
})

// ── API: Verbs ────────────────────────────────────────────────────────

// GET /api/italian/verbs  (?group=-are|-ere|-ire|irregular)
router.get('/api/verbs', async (req, res) => {
    try {
        const filter = {}
        if (req.query.group) filter.group = req.query.group
        const verbs = await Verb.find(filter).select('-__v').sort({ infinitive: 1 })
        res.json(verbs)
    } catch (err) {
        res.status(500).json({ error: 'Failed to load verbs' })
    }
})

// ── API: Grammar ──────────────────────────────────────────────────────

// GET /api/italian/grammar/topics
router.get('/api/grammar/topics', async (req, res) => {
    try {
        const topics = await GrammarTopic.find().select('-__v').sort({ order: 1 })
        res.json(topics)
    } catch (err) {
        res.status(500).json({ error: 'Failed to load grammar topics' })
    }
})

// GET /api/italian/grammar/questions  (?topic=Articles&limit=20)
router.get('/api/grammar/questions', async (req, res) => {
    try {
        const filter = {}
        if (req.query.topic) filter.topic = req.query.topic
        const limit = Math.min(100, parseInt(req.query.limit) || 100)
        const questions = await GrammarQuestion.find(filter).select('-__v').limit(limit)
        res.json(questions)
    } catch (err) {
        res.status(500).json({ error: 'Failed to load grammar questions' })
    }
})

// ── API: Sentences ────────────────────────────────────────────────────

// GET /api/italian/sentences  (?limit=12)
router.get('/api/sentences', async (req, res) => {
    try {
        const limit = Math.min(100, parseInt(req.query.limit) || 100)
        const sentences = await SentenceExercise.find().select('-__v').limit(limit)
        res.json(sentences)
    } catch (err) {
        res.status(500).json({ error: 'Failed to load sentences' })
    }
})

// ── Admin CRUD (requires active admin session) ────────────────────────

function requireAdmin(req, res, next) {
    if (req.session && req.session.isAdmin) return next()
    res.status(401).json({ error: 'Unauthorised' })
}

// Vocab
router.post('/admin/vocab', requireAdmin, async (req, res) => {
    try {
        const item = await VocabItem.create(req.body)
        res.status(201).json(item)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

router.put('/admin/vocab/:id', requireAdmin, async (req, res) => {
    try {
        const item = await VocabItem.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if (!item) return res.status(404).json({ error: 'Not found' })
        res.json(item)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

router.delete('/admin/vocab/:id', requireAdmin, async (req, res) => {
    try {
        await VocabItem.findByIdAndDelete(req.params.id)
        res.json({ success: true })
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

// Verbs
router.post('/admin/verbs', requireAdmin, async (req, res) => {
    try {
        const verb = await Verb.create(req.body)
        res.status(201).json(verb)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

router.put('/admin/verbs/:id', requireAdmin, async (req, res) => {
    try {
        const verb = await Verb.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if (!verb) return res.status(404).json({ error: 'Not found' })
        res.json(verb)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

router.delete('/admin/verbs/:id', requireAdmin, async (req, res) => {
    try {
        await Verb.findByIdAndDelete(req.params.id)
        res.json({ success: true })
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

// Grammar questions
router.post('/admin/grammar/questions', requireAdmin, async (req, res) => {
    try {
        const q = await GrammarQuestion.create(req.body)
        res.status(201).json(q)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

router.put('/admin/grammar/questions/:id', requireAdmin, async (req, res) => {
    try {
        const q = await GrammarQuestion.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if (!q) return res.status(404).json({ error: 'Not found' })
        res.json(q)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

router.delete('/admin/grammar/questions/:id', requireAdmin, async (req, res) => {
    try {
        await GrammarQuestion.findByIdAndDelete(req.params.id)
        res.json({ success: true })
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

// Sentences
router.post('/admin/sentences', requireAdmin, async (req, res) => {
    try {
        const s = await SentenceExercise.create(req.body)
        res.status(201).json(s)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

router.put('/admin/sentences/:id', requireAdmin, async (req, res) => {
    try {
        const s = await SentenceExercise.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if (!s) return res.status(404).json({ error: 'Not found' })
        res.json(s)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

router.delete('/admin/sentences/:id', requireAdmin, async (req, res) => {
    try {
        await SentenceExercise.findByIdAndDelete(req.params.id)
        res.json({ success: true })
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

module.exports = router

