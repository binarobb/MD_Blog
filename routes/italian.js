const express = require('express')
const router = express.Router()
const { ensureAdmin, ensureAuthenticated } = require('../middleware/auth')
const { JSDOM } = require('jsdom')
const createDomPurify = require('dompurify')
const dompurify = createDomPurify(new JSDOM().window)
const UserProgress = require('../models/UserProgress')
const SRSCard      = require('../models/italian/SRSCard')

const VocabCategory    = require('../models/italian/VocabCategory')
const VocabItem        = require('../models/italian/VocabItem')
const Verb             = require('../models/italian/Verb')
const GrammarTopic     = require('../models/italian/GrammarTopic')
const GrammarQuestion  = require('../models/italian/GrammarQuestion')
const SentenceExercise = require('../models/italian/SentenceExercise')
const ReadingPassage   = require('../models/italian/ReadingPassage')
const IdiomExpression  = require('../models/italian/IdiomExpression')

// Map level query param string to difficulty integer (1=A1, 2=A2, 3=B1)
function levelToFilter(levelStr) {
    const map = { a1: 1, a2: 2, b1: 3 }
    const v = map[String(levelStr).toLowerCase()]
    return v ? { difficulty: v } : {}
}

// ReadingPassage uses `level` (not `difficulty`) as its field name
function readingLevelToFilter(levelStr) {
    if (!levelStr || String(levelStr).toLowerCase() === 'all') return {}
    const map = { a1: 1, a2: 2, b1: 3 }
    const v = map[String(levelStr).toLowerCase()]
    return v ? { level: v } : { level: -1 }
}

function sanitizePlainText(value, maxLen = 200) {
    const clean = dompurify.sanitize(String(value ?? ''), {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: []
    }).replace(/\s+/g, ' ').trim()
    return clean.slice(0, maxLen)
}

function sanitizeOptionalUrl(value, maxLen = 500) {
    const clean = sanitizePlainText(value, maxLen)
    return clean || undefined
}

function sanitizeDifficulty(value, fallback = 1) {
    const n = Number(value)
    return [1, 2, 3].includes(n) ? n : fallback
}

function sanitizeTags(tags) {
    if (!Array.isArray(tags)) return []
    return tags
        .map(t => sanitizePlainText(t, 50).toLowerCase().replace(/\s+/g, '-'))
        .filter(Boolean)
        .slice(0, 20)
}

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
        const categories = await VocabCategory.find().sort({ order: 1 }).populate('parentCategory', '_id name slug')
        res.json(categories)
    } catch (err) {
        res.status(500).json({ error: 'Failed to load categories' })
    }
})

// GET /api/italian/vocab/:category  (category = slug, e.g. "food-drink")  (?level=a1|a2|b1)
router.get('/api/vocab/:category', async (req, res) => {
    try {
        const category = await VocabCategory.findOne({ slug: req.params.category })
        if (!category) return res.status(404).json({ error: 'Category not found' })

        const page  = Math.max(1, parseInt(req.query.page)  || 1)
        const limit = Math.min(100, parseInt(req.query.limit) || 100)
        const skip  = (page - 1) * limit

        const filter = { category: category._id, ...levelToFilter(req.query.level) }
        const items = await VocabItem.find(filter)
            .select('-__v')
            .skip(skip)
            .limit(limit)

        res.json({ category: category.name, slug: category.slug, items })
    } catch (err) {
        res.status(500).json({ error: 'Failed to load vocabulary' })
    }
})

// ── API: Verbs ────────────────────────────────────────────────────────

// GET /api/italian/verbs  (?group=-are|-ere|-ire|irregular|reflexive)  (?level=a1|a2|b1)  (?tense=presente|passatoProssimo|imperfetto)
router.get('/api/verbs', async (req, res) => {
    try {
        const filter = { ...levelToFilter(req.query.level) }
        if (req.query.group) filter.group = req.query.group

        // When a specific tense is requested, only return verbs that have that tense populated
        const validTenses = ['presenteIndicativo', 'passatoProssimo', 'imperfetto']
        const tense = req.query.tense
        if (tense && validTenses.includes(tense)) {
            filter[`tenses.${tense}.io`] = { $exists: true, $ne: null }
        }

        const verbs = await Verb.find(filter).select('-__v').sort({ difficulty: 1, infinitive: 1 })
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

// GET /api/italian/grammar/questions  (?topic=Articles&limit=20&level=a1|a2|b1)
router.get('/api/grammar/questions', async (req, res) => {
    try {
        const filter = { ...levelToFilter(req.query.level) }
        if (req.query.topic) filter.topic = req.query.topic
        const limit = Math.min(100, parseInt(req.query.limit) || 100)
        const questions = await GrammarQuestion.find(filter).select('-__v').limit(limit)
        res.json(questions)
    } catch (err) {
        res.status(500).json({ error: 'Failed to load grammar questions' })
    }
})

// ── API: Sentences ────────────────────────────────────────────────────

// GET /api/italian/sentences  (?limit=12&level=a1|a2|b1)
router.get('/api/sentences', async (req, res) => {
    try {
        const filter = { ...levelToFilter(req.query.level) }
        const limit = Math.min(100, parseInt(req.query.limit) || 100)
        const sentences = await SentenceExercise.find(filter).select('-__v').limit(limit)
        res.json(sentences)
    } catch (err) {
        res.status(500).json({ error: 'Failed to load sentences' })
    }
})

// ── API: Reading Passages ─────────────────────────────────────────────

// GET /api/italian/reading  (?level=a2|b1&limit=20&page=1)
router.get('/api/reading', async (req, res) => {
    try {
        const filter = { ...readingLevelToFilter(req.query.level) }
        const limit = Math.min(50, parseInt(req.query.limit) || 20)
        const page  = Math.max(1, parseInt(req.query.page) || 1)
        const skip  = (page - 1) * limit
        const total = await ReadingPassage.countDocuments(filter)
        const passages = await ReadingPassage.find(filter)
            .select('-__v')
            .sort({ level: 1, title: 1 })
            .skip(skip)
            .limit(limit)
        res.json({ total, page, limit, passages })
    } catch (err) {
        res.status(500).json({ error: 'Failed to load reading passages' })
    }
})

// GET /api/italian/reading/:id
router.get('/api/reading/:id', async (req, res) => {
    try {
        const passage = await ReadingPassage.findById(req.params.id).select('-__v')
        if (!passage) return res.status(404).json({ error: 'Passage not found' })
        res.json(passage)
    } catch (err) {
        res.status(500).json({ error: 'Failed to load passage' })
    }
})

// ── API: Idioms ───────────────────────────────────────────────────────

// GET /api/italian/idioms  (?level=a2|b1&limit=50)
router.get('/api/idioms', async (req, res) => {
    try {
        const filter = { ...levelToFilter(req.query.level) }
        const limit = Math.min(200, parseInt(req.query.limit) || 100)
        const idioms = await IdiomExpression.find(filter)
            .select('-__v')
            .sort({ difficulty: 1, idiom: 1 })
            .limit(limit)
        res.json(idioms)
    } catch (err) {
        res.status(500).json({ error: 'Failed to load idioms' })
    }
})

// ── Admin CRUD (requires admin role) ────────────────────────────────

// Admin panel page
router.get('/admin', ensureAdmin, async (req, res) => {
    try {
        const [categories, recentVocab, recentVerbs, recentReading] = await Promise.all([
            VocabCategory.find().sort({ order: 1 }).populate('parentCategory', 'name'),
            VocabItem.find().sort({ _id: -1 }).limit(10).populate('category', 'name'),
            Verb.find().sort({ _id: -1 }).limit(10),
            ReadingPassage.find().sort({ _id: -1 }).limit(10)
        ])
        res.render('italian/admin', { categories, recentVocab, recentVerbs, recentReading })
    } catch (err) {
        console.error('Admin panel error:', err)
        res.status(500).send('Internal server error')
    }
})

// Vocab
router.post('/admin/vocab', ensureAdmin, async (req, res) => {
    try {
        const { category, italian, english, imageUrl, audioUrl, difficulty, tags } = req.body
        const safeItalian = sanitizePlainText(italian, 120)
        const safeEnglish = sanitizePlainText(english, 180)
        if (!category || !safeItalian || !safeEnglish) {
            return res.status(400).json({ error: 'category, italian and english are required' })
        }
        const item = await VocabItem.create({
            category,
            italian: safeItalian,
            english: safeEnglish,
            imageUrl: sanitizeOptionalUrl(imageUrl),
            audioUrl: sanitizeOptionalUrl(audioUrl),
            difficulty: sanitizeDifficulty(difficulty),
            tags: sanitizeTags(tags)
        })
        res.status(201).json(item)
    } catch (err) {
        console.error('Admin API error:', err)
        res.status(400).json({ error: 'Bad request' })
    }
})

router.put('/admin/vocab/:id', ensureAdmin, async (req, res) => {
    try {
        const { category, italian, english, imageUrl, audioUrl, difficulty, tags } = req.body
        const safeItalian = sanitizePlainText(italian, 120)
        const safeEnglish = sanitizePlainText(english, 180)
        if (!category || !safeItalian || !safeEnglish) {
            return res.status(400).json({ error: 'category, italian and english are required' })
        }
        const item = await VocabItem.findByIdAndUpdate(
            req.params.id,
            {
                category,
                italian: safeItalian,
                english: safeEnglish,
                imageUrl: sanitizeOptionalUrl(imageUrl),
                audioUrl: sanitizeOptionalUrl(audioUrl),
                difficulty: sanitizeDifficulty(difficulty),
                tags: sanitizeTags(tags)
            },
            { new: true, runValidators: true }
        )
        if (!item) return res.status(404).json({ error: 'Not found' })
        res.json(item)
    } catch (err) {
        console.error('Admin API error:', err)
        res.status(400).json({ error: 'Bad request' })
    }
})

router.delete('/admin/vocab/:id', ensureAdmin, async (req, res) => {
    try {
        await VocabItem.findByIdAndDelete(req.params.id)
        res.json({ success: true })
    } catch (err) {
        console.error('Admin API error:', err)
        res.status(400).json({ error: 'Bad request' })
    }
})

// POST /italian/admin/vocab/bulk-import
router.post('/admin/vocab/bulk-import', ensureAdmin, async (req, res) => {
    try {
        const { items } = req.body
        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: 'items must be a non-empty array' })
        }
        if (items.length > 500) {
            return res.status(400).json({ error: 'Max 500 items per import' })
        }
        let inserted = 0, skipped = 0
        const errors = []
        for (const item of items) {
            const { categorySlug, italian, english, difficulty, tags } = item
            const safeCategorySlug = sanitizePlainText(categorySlug, 80).toLowerCase()
            const safeItalian = sanitizePlainText(italian, 120)
            const safeEnglish = sanitizePlainText(english, 180)
            if (!safeCategorySlug || !safeItalian || !safeEnglish) {
                errors.push({ item, reason: 'Missing required fields: categorySlug, italian, english' })
                continue
            }
            if (!/^[a-z0-9-]+$/.test(safeCategorySlug)) {
                errors.push({ item, reason: 'Invalid categorySlug format' })
                continue
            }
            const category = await VocabCategory.findOne({ slug: safeCategorySlug })
            if (!category) {
                errors.push({ item, reason: `Category not found: ${safeCategorySlug}` })
                continue
            }
            try {
                const result = await VocabItem.findOneAndUpdate(
                    { category: category._id, italian: safeItalian },
                    {
                      category: category._id,
                      italian: safeItalian,
                      english: safeEnglish,
                      difficulty: sanitizeDifficulty(difficulty),
                      tags: sanitizeTags(tags)
                    },
                                        { upsert: true, new: true, includeResultMetadata: true }
                )
                if (result.lastErrorObject?.updatedExisting) skipped++
                else inserted++
            } catch (itemErr) {
                errors.push({ item, reason: itemErr.message })
            }
        }
        res.json({ inserted, skipped, errors })
    } catch (err) {
        console.error('Admin bulk-import error:', err)
        res.status(500).json({ error: 'Bulk import failed' })
    }
})


// Categories
router.post('/admin/category', ensureAdmin, async (req, res) => {
    try {
        const { name, slug, parentCategory, group, groupOrder, groupIcon, order, description } = req.body
        const safeName = sanitizePlainText(name, 80)
        const safeSlug = sanitizePlainText(slug, 80).toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
        if (!safeName || !safeSlug) {
            return res.status(400).json({ error: 'name and slug are required' })
        }
        const catData = {
            name: safeName,
            slug: safeSlug,
            order: parseInt(order) || 0
        }
        if (description) catData.description = sanitizePlainText(description, 300)
        if (parentCategory) {
            const parent = await VocabCategory.findById(parentCategory)
            if (!parent) return res.status(400).json({ error: 'Parent category not found' })
            catData.parentCategory = parent._id
            catData.group      = group     ? sanitizePlainText(group, 60)     : parent.group
            catData.groupOrder = groupOrder ? (parseInt(groupOrder) || 99)     : parent.groupOrder
            catData.groupIcon  = groupIcon  ? sanitizePlainText(groupIcon, 10) : parent.groupIcon
        } else {
            if (group)      catData.group      = sanitizePlainText(group, 60)
            if (groupOrder) catData.groupOrder = parseInt(groupOrder) || 99
            if (groupIcon)  catData.groupIcon  = sanitizePlainText(groupIcon, 10)
        }
        const cat = await VocabCategory.create(catData)
        await cat.populate('parentCategory', 'name')
        res.status(201).json(cat)
    } catch (err) {
        if (err.code === 11000) return res.status(400).json({ error: 'A category with that name or slug already exists' })
        console.error('Admin category error:', err)
        res.status(400).json({ error: 'Bad request' })
    }
})

router.delete('/admin/category/:id', ensureAdmin, async (req, res) => {
    try {
        const count = await VocabItem.countDocuments({ category: req.params.id })
        if (count > 0) return res.status(400).json({ error: `Cannot delete: ${count} vocab item(s) exist in this category` })
        await VocabCategory.updateMany({ parentCategory: req.params.id }, { $unset: { parentCategory: 1 } })
        await VocabCategory.findByIdAndDelete(req.params.id)
        res.json({ success: true })
    } catch (err) {
        console.error('Admin category error:', err)
        res.status(400).json({ error: 'Bad request' })
    }
})

// Helpers for nested verb structures
function sanitizeConjugation(obj) {
    if (!obj || typeof obj !== 'object') return {}
    const pronouns = ['io', 'tu', 'lui/lei', 'noi', 'voi', 'loro']
    const out = {}
    for (const p of pronouns) {
        if (obj[p] != null) out[p] = sanitizePlainText(obj[p], 80)
    }
    return out
}

function sanitizeTenses(obj) {
    if (!obj || typeof obj !== 'object') return {}
    const validTenses = ['presenteIndicativo', 'passatoProssimo', 'imperfetto']
    const out = {}
    for (const t of validTenses) {
        if (obj[t]) out[t] = sanitizeConjugation(obj[t])
    }
    return out
}

function sanitizeExample(obj) {
    if (!obj || typeof obj !== 'object') return undefined
    const it = sanitizePlainText(obj.it, 300)
    const en = sanitizePlainText(obj.en, 300)
    return (it && en) ? { it, en } : undefined
}

// Verbs
router.post('/admin/verbs', ensureAdmin, async (req, res) => {
    try {
        const { infinitive, translation, group, conjugation, tenses, auxiliaryVerb, pastParticiple, example, examples, difficulty } = req.body
        const validGroups = ['-are', '-ere', '-ire', '-ire (isc)', 'irregular', 'reflexive']
        const validAux    = ['avere', 'essere', null, undefined]
        const safeData = {
            infinitive:     sanitizePlainText(infinitive, 80).toLowerCase(),
            translation:    sanitizePlainText(translation, 150),
            group:          validGroups.includes(group) ? group : '-are',
            conjugation:    sanitizeConjugation(conjugation),
            tenses:         sanitizeTenses(tenses),
            auxiliaryVerb:  validAux.includes(auxiliaryVerb) ? (auxiliaryVerb || null) : null,
            pastParticiple: pastParticiple ? sanitizePlainText(pastParticiple, 80) : null,
            example:        sanitizeExample(example),
            difficulty:     sanitizeDifficulty(difficulty)
        }
        if (Array.isArray(examples)) safeData.examples = examples.map(sanitizeExample).filter(Boolean)
        const verb = await Verb.create(safeData)
        res.status(201).json(verb)
    } catch (err) {
        console.error('Admin API error:', err)
        res.status(400).json({ error: 'Bad request' })
    }
})

router.put('/admin/verbs/:id', ensureAdmin, async (req, res) => {
    try {
        const { infinitive, translation, group, conjugation, tenses, auxiliaryVerb, pastParticiple, example, examples, difficulty } = req.body
        const validGroups = ['-are', '-ere', '-ire', '-ire (isc)', 'irregular', 'reflexive']
        const validAux    = ['avere', 'essere', null, undefined]
        const safeData = {
            infinitive:     sanitizePlainText(infinitive, 80).toLowerCase(),
            translation:    sanitizePlainText(translation, 150),
            group:          validGroups.includes(group) ? group : '-are',
            conjugation:    sanitizeConjugation(conjugation),
            tenses:         sanitizeTenses(tenses),
            auxiliaryVerb:  validAux.includes(auxiliaryVerb) ? (auxiliaryVerb || null) : null,
            pastParticiple: pastParticiple ? sanitizePlainText(pastParticiple, 80) : null,
            example:        sanitizeExample(example),
            difficulty:     sanitizeDifficulty(difficulty)
        }
        if (Array.isArray(examples)) safeData.examples = examples.map(sanitizeExample).filter(Boolean)
        const verb = await Verb.findByIdAndUpdate(req.params.id, safeData, { new: true, runValidators: true })
        if (!verb) return res.status(404).json({ error: 'Not found' })
        res.json(verb)
    } catch (err) {
        console.error('Admin API error:', err)
        res.status(400).json({ error: 'Bad request' })
    }
})

router.delete('/admin/verbs/:id', ensureAdmin, async (req, res) => {
    try {
        await Verb.findByIdAndDelete(req.params.id)
        res.json({ success: true })
    } catch (err) {
        console.error('Admin API error:', err)
        res.status(400).json({ error: 'Bad request' })
    }
})

// Grammar questions
router.post('/admin/grammar/questions', ensureAdmin, async (req, res) => {
    try {
        const { question, correctAnswer, options, topic, difficulty } = req.body
        const safeQuestion      = sanitizePlainText(question, 500)
        const safeCorrectAnswer = sanitizePlainText(correctAnswer, 200)
        const safeTopic         = sanitizePlainText(topic, 100)
        if (!safeQuestion || !safeCorrectAnswer || !safeTopic) {
            return res.status(400).json({ error: 'question, correctAnswer and topic are required' })
        }
        const safeOptions = Array.isArray(options)
            ? options.map(o => sanitizePlainText(o, 200)).filter(Boolean).slice(0, 10)
            : []
        const q = await GrammarQuestion.create({
            question: safeQuestion,
            correctAnswer: safeCorrectAnswer,
            options: safeOptions,
            topic: safeTopic,
            difficulty: sanitizeDifficulty(difficulty)
        })
        res.status(201).json(q)
    } catch (err) {
        console.error('Admin API error:', err)
        res.status(400).json({ error: 'Bad request' })
    }
})

router.put('/admin/grammar/questions/:id', ensureAdmin, async (req, res) => {
    try {
        const { question, correctAnswer, options, topic, difficulty } = req.body
        const safeQuestion      = sanitizePlainText(question, 500)
        const safeCorrectAnswer = sanitizePlainText(correctAnswer, 200)
        const safeTopic         = sanitizePlainText(topic, 100)
        if (!safeQuestion || !safeCorrectAnswer || !safeTopic) {
            return res.status(400).json({ error: 'question, correctAnswer and topic are required' })
        }
        const safeOptions = Array.isArray(options)
            ? options.map(o => sanitizePlainText(o, 200)).filter(Boolean).slice(0, 10)
            : []
        const q = await GrammarQuestion.findByIdAndUpdate(
            req.params.id,
            { question: safeQuestion, correctAnswer: safeCorrectAnswer, options: safeOptions, topic: safeTopic, difficulty: sanitizeDifficulty(difficulty) },
            { new: true, runValidators: true }
        )
        if (!q) return res.status(404).json({ error: 'Not found' })
        res.json(q)
    } catch (err) {
        console.error('Admin API error:', err)
        res.status(400).json({ error: 'Bad request' })
    }
})

router.delete('/admin/grammar/questions/:id', ensureAdmin, async (req, res) => {
    try {
        await GrammarQuestion.findByIdAndDelete(req.params.id)
        res.json({ success: true })
    } catch (err) {
        console.error('Admin API error:', err)
        res.status(400).json({ error: 'Bad request' })
    }
})

// Sentences
router.post('/admin/sentences', ensureAdmin, async (req, res) => {
    try {
        const { english, words, difficulty, hint } = req.body
        const safeEnglish = sanitizePlainText(english, 500)
        if (!safeEnglish) return res.status(400).json({ error: 'english is required' })
        const safeWords = Array.isArray(words)
            ? words.map(w => sanitizePlainText(w, 100)).filter(Boolean).slice(0, 50)
            : []
        const s = await SentenceExercise.create({
            english: safeEnglish,
            words: safeWords,
            difficulty: sanitizeDifficulty(difficulty),
            hint: sanitizePlainText(hint || '', 300)
        })
        res.status(201).json(s)
    } catch (err) {
        console.error('Admin API error:', err)
        res.status(400).json({ error: 'Bad request' })
    }
})

router.put('/admin/sentences/:id', ensureAdmin, async (req, res) => {
    try {
        const { english, words, difficulty, hint } = req.body
        const safeEnglish = sanitizePlainText(english, 500)
        if (!safeEnglish) return res.status(400).json({ error: 'english is required' })
        const safeWords = Array.isArray(words)
            ? words.map(w => sanitizePlainText(w, 100)).filter(Boolean).slice(0, 50)
            : []
        const s = await SentenceExercise.findByIdAndUpdate(
            req.params.id,
            { english: safeEnglish, words: safeWords, difficulty: sanitizeDifficulty(difficulty), hint: sanitizePlainText(hint || '', 300) },
            { new: true, runValidators: true }
        )
        if (!s) return res.status(404).json({ error: 'Not found' })
        res.json(s)
    } catch (err) {
        console.error('Admin API error:', err)
        res.status(400).json({ error: 'Bad request' })
    }
})

router.delete('/admin/sentences/:id', ensureAdmin, async (req, res) => {
    try {
        await SentenceExercise.findByIdAndDelete(req.params.id)
        res.json({ success: true })
    } catch (err) {
        console.error('Admin API error:', err)
        res.status(400).json({ error: 'Bad request' })
    }
})

// Reading passages admin
router.post('/admin/reading', ensureAdmin, async (req, res) => {
    try {
        const { title, level, body, vocabGlossary, questions, tags, audioUrl } = req.body
        const safeBody = dompurify.sanitize(body, {
            ALLOWED_TAGS: ['p', 'mark', 'strong', 'em', 'br', 'span'],
            ALLOWED_ATTR: ['data-word', 'class']
        })
        const passage = await ReadingPassage.create({ title, level, body: safeBody, vocabGlossary, questions, tags, audioUrl })
        res.status(201).json(passage)
    } catch (err) {
        console.error('Admin API error:', err)
        res.status(400).json({ error: 'Bad request' })
    }
})

router.put('/admin/reading/:id', ensureAdmin, async (req, res) => {
    try {
        const { title, level, body, vocabGlossary, questions, tags, audioUrl } = req.body
        const safeBody = dompurify.sanitize(body, {
            ALLOWED_TAGS: ['p', 'mark', 'strong', 'em', 'br', 'span'],
            ALLOWED_ATTR: ['data-word', 'class']
        })
        const passage = await ReadingPassage.findByIdAndUpdate(req.params.id, { title, level, body: safeBody, vocabGlossary, questions, tags, audioUrl }, { new: true, runValidators: true })
        if (!passage) return res.status(404).json({ error: 'Not found' })
        res.json(passage)
    } catch (err) {
        console.error('Admin API error:', err)
        res.status(400).json({ error: 'Bad request' })
    }
})

router.delete('/admin/reading/:id', ensureAdmin, async (req, res) => {
    try {
        await ReadingPassage.findByIdAndDelete(req.params.id)
        res.json({ success: true })
    } catch (err) {
        console.error('Admin API error:', err)
        res.status(400).json({ error: 'Bad request' })
    }
})

// Idioms admin
router.post('/admin/idioms', ensureAdmin, async (req, res) => {
    try {
        const { idiom, meaning, literalTranslation, example, difficulty, tags, audioUrl } = req.body
        const safeIdiom   = sanitizePlainText(idiom, 200)
        const safeMeaning = sanitizePlainText(meaning, 400)
        if (!safeIdiom || !safeMeaning) {
            return res.status(400).json({ error: 'idiom and meaning are required' })
        }
        const safeExample = sanitizeExample(example)
        if (!safeExample) return res.status(400).json({ error: 'example.it and example.en are required' })
        const safeData = {
            idiom:              safeIdiom,
            meaning:            safeMeaning,
            literalTranslation: literalTranslation ? sanitizePlainText(literalTranslation, 400) : null,
            example:            safeExample,
            difficulty:         sanitizeDifficulty(difficulty, 2),
            tags:               sanitizeTags(tags),
            audioUrl:           sanitizeOptionalUrl(audioUrl)
        }
        const expr = await IdiomExpression.create(safeData)
        res.status(201).json(expr)
    } catch (err) {
        console.error('Admin API error:', err)
        res.status(400).json({ error: 'Bad request' })
    }
})

router.put('/admin/idioms/:id', ensureAdmin, async (req, res) => {
    try {
        const { idiom, meaning, literalTranslation, example, difficulty, tags, audioUrl } = req.body
        const safeIdiom   = sanitizePlainText(idiom, 200)
        const safeMeaning = sanitizePlainText(meaning, 400)
        if (!safeIdiom || !safeMeaning) {
            return res.status(400).json({ error: 'idiom and meaning are required' })
        }
        const safeExample = sanitizeExample(example)
        if (!safeExample) return res.status(400).json({ error: 'example.it and example.en are required' })
        const safeData = {
            idiom:              safeIdiom,
            meaning:            safeMeaning,
            literalTranslation: literalTranslation ? sanitizePlainText(literalTranslation, 400) : null,
            example:            safeExample,
            difficulty:         sanitizeDifficulty(difficulty, 2),
            tags:               sanitizeTags(tags),
            audioUrl:           sanitizeOptionalUrl(audioUrl)
        }
        const expr = await IdiomExpression.findByIdAndUpdate(req.params.id, safeData, { new: true, runValidators: true })
        if (!expr) return res.status(404).json({ error: 'Not found' })
        res.json(expr)
    } catch (err) {
        console.error('Admin API error:', err)
        res.status(400).json({ error: 'Bad request' })
    }
})

router.delete('/admin/idioms/:id', ensureAdmin, async (req, res) => {
    try {
        await IdiomExpression.findByIdAndDelete(req.params.id)
        res.json({ success: true })
    } catch (err) {
        console.error('Admin API error:', err)
        res.status(400).json({ error: 'Bad request' })
    }
})

// ── Progress API ─────────────────────────────────────────────────────
// All routes require authentication. Unauthenticated clients use
// the localStorage fallback in italian-app.js.

// Achievement definitions ─────────────────────────────────────────
const ACHIEVEMENTS = {
    first_quiz:    { label: 'First Quiz',          check: (p) => totalAnswered(p) >= 1 },
    streak_7:      { label: '7-Day Streak',        check: (p) => p.streak.current >= 7 },
    streak_30:     { label: '30-Day Streak',       check: (p) => p.streak.current >= 30 },
    streak_100:    { label: '100-Day Streak',      check: (p) => p.streak.current >= 100 },
    perfect_score: { label: 'Perfect Score',       check: (p, opts) => opts && opts.perfectScore },
    vocab_master:  { label: 'Vocab Master',        check: (p) => sectionCorrect(p, 'vocab') >= 500 },
    verb_master:   { label: 'Verb Master',         check: (p) => sectionCorrect(p, 'verbs') >= 200 },
    all_sections:  { label: 'All-Around Learner',  check: (p) => allSectionsPracticed(p) },
    daily_goal:    { label: 'Daily Goal Met',      check: (p) => p.todayCompleted >= p.dailyGoal },
    week_warrior:  { label: 'Week Warrior',        check: (p, opts) => opts && opts.weekWarrior }
}

function totalAnswered (p) {
    let t = 0
    for (const s of p.sections.values()) t += s.total
    return t
}

function sectionCorrect (p, section) {
    const s = p.sections.get(section)
    return s ? s.correct : 0
}

function allSectionsPracticed (p) {
    const required = ['vocab', 'verbs', 'grammar', 'sentences', 'reading', 'idioms']
    return required.every(k => {
        const s = p.sections.get(k)
        return s && s.sessions > 0
    })
}

function checkAchievements (progress, opts = {}) {
    const unlocked = progress.achievements.map(a => a.key)
    const newlyUnlocked = []

    for (const [key, def] of Object.entries(ACHIEVEMENTS)) {
        if (unlocked.includes(key)) continue
        if (def.check(progress, opts)) {
            progress.achievements.push({ key, unlockedAt: new Date() })
            newlyUnlocked.push({ key, label: def.label })
        }
    }
    return newlyUnlocked
}

// GET /italian/api/progress
router.get('/api/progress', ensureAuthenticated, async (req, res) => {
    try {
        let progress = await UserProgress.findOneAndUpdate(
            { user: req.user._id },
            { $setOnInsert: { user: req.user._id } },
            { upsert: true, new: true }
        )
        progress.refreshDailyGoal()
        await progress.save()
        res.json(progressPayload(progress))
    } catch (err) {
        console.error('GET /api/progress error:', err)
        res.status(500).json({ error: 'Failed to load progress' })
    }
})

// GET /italian/api/progress/streak
router.get('/api/progress/streak', ensureAuthenticated, async (req, res) => {
    try {
        let progress = await UserProgress.findOneAndUpdate(
            { user: req.user._id },
            { $setOnInsert: { user: req.user._id } },
            { upsert: true, new: true }
        )
        res.json({ streak: progress.streak })
    } catch (err) {
        res.status(500).json({ error: 'Failed to load streak' })
    }
})

// POST /italian/api/progress/streak/check
// Called on app load to update streak if needed.
router.post('/api/progress/streak/check', ensureAuthenticated, async (req, res) => {
    try {
        let progress = await UserProgress.findOneAndUpdate(
            { user: req.user._id },
            { $setOnInsert: { user: req.user._id } },
            { upsert: true, new: true }
        )

        const { changed, wasReset } = progress.updateStreak()
        if (changed) await progress.save()

        res.json({ streak: progress.streak, changed, wasReset })
    } catch (err) {
        console.error('POST /api/progress/streak/check error:', err)
        res.status(500).json({ error: 'Failed to update streak' })
    }
})

// POST /italian/api/progress/save
// Body: { section: String, correct: Number, total: Number }
router.post('/api/progress/save', ensureAuthenticated, async (req, res) => {
    try {
        const { section, correct, total } = req.body

        if (!section || typeof correct !== 'number' || typeof total !== 'number') {
            return res.status(400).json({ error: 'section, correct, total are required' })
        }
        if (correct < 0 || total < 0 || correct > total) {
            return res.status(400).json({ error: 'Invalid correct/total values' })
        }

        let progress = await UserProgress.findOneAndUpdate(
            { user: req.user._id },
            { $setOnInsert: { user: req.user._id } },
            { upsert: true, new: true }
        )

        // Refresh daily goal counter
        progress.refreshDailyGoal()

        // Update section stats
        const existing = progress.sections.get(section) || { correct: 0, total: 0, sessions: 0, lastPracticed: null }
        existing.correct      += correct
        existing.total        += total
        existing.sessions     += 1
        existing.lastPracticed = new Date()
        progress.sections.set(section, existing)

        // Update streak
        progress.updateStreak()

        // Award XP
        const xpFromAnswers = correct * 10
        const quizBonus     = 5
        let   xpGained      = xpFromAnswers + quizBonus

        // Update daily goal
        progress.todayCompleted += total
        const dailyGoalJustMet = progress.todayCompleted >= progress.dailyGoal &&
                                 (progress.todayCompleted - total) < progress.dailyGoal
        if (dailyGoalJustMet) xpGained += 25

        // Streak milestone bonuses
        const milestones = [7, 30, 100]
        if (milestones.includes(progress.streak.current)) xpGained += 50

        progress.xp    += xpGained
        progress.level  = UserProgress.levelFromXP(progress.xp)

        // Check achievements
        const perfectScore = total >= 5 && correct === total
        const weekWarrior  = progress.streak.current > 0 &&
                             progress.streak.current % 7 === 0 &&
                             dailyGoalJustMet
        const newAchievements = checkAchievements(progress, { perfectScore, weekWarrior })

        await progress.save()

        res.json({
            ...progressPayload(progress),
            xpGained,
            dailyGoalJustMet,
            newAchievements
        })
    } catch (err) {
        console.error('POST /api/progress/save error:', err)
        res.status(500).json({ error: 'Failed to save progress' })
    }
})

// POST /italian/api/progress/goal
// Body: { goal: Number }  (must be one of 10, 20, 30, 50)
router.post('/api/progress/goal', ensureAuthenticated, async (req, res) => {
    try {
        const { goal } = req.body
        const allowed = [10, 20, 30, 50]
        if (!allowed.includes(Number(goal))) {
            return res.status(400).json({ error: 'Invalid goal. Must be one of: 10, 20, 30, 50' })
        }
        const progress = await UserProgress.findOneAndUpdate(
            { user: req.user._id },
            { $set: { dailyGoal: Number(goal) } },
            { upsert: true, new: true }
        )
        res.json({ dailyGoal: progress.dailyGoal })
    } catch (err) {
        console.error('POST /api/progress/goal error:', err)
        res.status(500).json({ error: 'Failed to update goal' })
    }
})

// GET /italian/api/leaderboard — top 20 users by XP
// Returns displayName, level, xp, streak only (no email)
router.get('/api/leaderboard', ensureAuthenticated, async (req, res) => {
    try {
        const top = await UserProgress.find()
            .sort({ xp: -1 })
            .limit(20)
            .populate('user', 'displayName')
        const rows = top
            .filter(p => p.user)
            .map(p => ({
                displayName: p.user.displayName,
                level:       p.level,
                xp:          p.xp,
                streak:      p.streak ? p.streak.current : 0
            }))
        res.json(rows)
    } catch (err) {
        console.error('GET /api/leaderboard error:', err)
        res.status(500).json({ error: 'Failed to load leaderboard' })
    }
})

// ── Phase 4: SRS (Spaced Repetition) ────────────────────────────────

// SM-2 algorithm: returns updated card fields
function applySmTwo (card, grade) {
    let { interval, easeFactor, repetitions, lapses } = card
    if (grade >= 3) {
        repetitions += 1
        if (repetitions === 1)      interval = 1
        else if (repetitions === 2) interval = 6
        else                        interval = Math.round(interval * easeFactor)
        easeFactor = Math.max(1.3, easeFactor + 0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02))
    } else {
        lapses += 1
        repetitions = 0
        interval = 1
        easeFactor = Math.max(1.3, easeFactor - 0.2)
    }
    const nextReview = new Date()
    nextReview.setUTCDate(nextReview.getUTCDate() + interval)
    nextReview.setUTCHours(0, 0, 0, 0)
    return { interval, easeFactor, repetitions, lapses, nextReview, lastReviewed: new Date() }
}

// GET /italian/api/srs/stats
router.get('/api/srs/stats', ensureAuthenticated, async (req, res) => {
    try {
        const now = new Date()
        const [due, total] = await Promise.all([
            SRSCard.countDocuments({ user: req.user._id, nextReview: { $lte: now } }),
            SRSCard.countDocuments({ user: req.user._id })
        ])
        res.json({ due, total })
    } catch (err) {
        console.error('GET /api/srs/stats error:', err)
        res.status(500).json({ error: 'Failed to fetch SRS stats' })
    }
})

// GET /italian/api/srs/due — up to 20 cards due today
router.get('/api/srs/due', ensureAuthenticated, async (req, res) => {
    try {
        const cards = await SRSCard.find({
            user:       req.user._id,
            nextReview: { $lte: new Date() }
        }).limit(20).select('front back itemType lapses interval')
        res.json(cards)
    } catch (err) {
        console.error('GET /api/srs/due error:', err)
        res.status(500).json({ error: 'Failed to fetch due cards' })
    }
})

// POST /italian/api/srs/answer — { cardId, grade: 4 (got it) | 1 (missed) }
router.post('/api/srs/answer', ensureAuthenticated, async (req, res) => {
    try {
        const { cardId, grade } = req.body
        if (!cardId || ![1, 4].includes(Number(grade))) {
            return res.status(400).json({ error: 'Invalid input' })
        }
        const card = await SRSCard.findOne({ _id: cardId, user: req.user._id })
        if (!card) return res.status(404).json({ error: 'Card not found' })
        const update = applySmTwo(card, Number(grade))
        Object.assign(card, update)
        await card.save()
        res.json({ interval: card.interval, nextReview: card.nextReview })
    } catch (err) {
        console.error('POST /api/srs/answer error:', err)
        res.status(500).json({ error: 'Failed to save answer' })
    }
})

// POST /italian/api/srs/enroll — { itemType, itemId, front, back }
// Enrolls a new card; silently skips if card already exists (setOnInsert)
router.post('/api/srs/enroll', ensureAuthenticated, async (req, res) => {
    try {
        const { itemType, itemId, front, back } = req.body
        const validTypes = ['vocab', 'grammar', 'idiom']
        if (!validTypes.includes(itemType) || !itemId || !front || !back) {
            return res.status(400).json({ error: 'Invalid input' })
        }
        await SRSCard.findOneAndUpdate(
            { user: req.user._id, itemType, itemId },
            { $setOnInsert: { front: String(front).slice(0, 500), back: String(back).slice(0, 500),
                              interval: 0, easeFactor: 2.5, repetitions: 0, lapses: 0, nextReview: new Date() } },
            { upsert: true, new: true }
        )
        res.json({ ok: true })
    } catch (err) {
        if (err.code === 11000) return res.json({ ok: true }) // already enrolled
        console.error('POST /api/srs/enroll error:', err)
        res.status(500).json({ error: 'Failed to enroll card' })
    }
})

// Helper: shape the full progress response
function progressPayload (p) {
    const sections = {}
    for (const [k, v] of p.sections.entries()) sections[k] = v

    const nextLevelXP = UserProgress.xpForLevel(p.level + 1)
    const currLevelXP = UserProgress.xpForLevel(p.level)
    const xpIntoLevel = p.xp - currLevelXP
    const xpNeeded    = nextLevelXP - currLevelXP

    return {
        sections,
        streak:          p.streak,
        xp:              p.xp,
        level:           p.level,
        xpIntoLevel,
        xpNeeded,
        xpPercent:       xpNeeded > 0 ? Math.min(100, Math.round((xpIntoLevel / xpNeeded) * 100)) : 100,
        dailyGoal:       p.dailyGoal,
        todayCompleted:  p.todayCompleted,
        dailyGoalMet:    p.todayCompleted >= p.dailyGoal,
        achievements:    p.achievements
    }
}

module.exports = router

