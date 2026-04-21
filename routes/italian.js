const express = require('express')
const router = express.Router()
const { ensureAdmin, ensureAuthenticated } = require('../middleware/auth')
const UserProgress = require('../models/UserProgress')

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

// Vocab
router.post('/admin/vocab', ensureAdmin, async (req, res) => {
    try {
        const item = await VocabItem.create(req.body)
        res.status(201).json(item)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

router.put('/admin/vocab/:id', ensureAdmin, async (req, res) => {
    try {
        const item = await VocabItem.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if (!item) return res.status(404).json({ error: 'Not found' })
        res.json(item)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

router.delete('/admin/vocab/:id', ensureAdmin, async (req, res) => {
    try {
        await VocabItem.findByIdAndDelete(req.params.id)
        res.json({ success: true })
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

// Verbs
router.post('/admin/verbs', ensureAdmin, async (req, res) => {
    try {
        const verb = await Verb.create(req.body)
        res.status(201).json(verb)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

router.put('/admin/verbs/:id', ensureAdmin, async (req, res) => {
    try {
        const verb = await Verb.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if (!verb) return res.status(404).json({ error: 'Not found' })
        res.json(verb)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

router.delete('/admin/verbs/:id', ensureAdmin, async (req, res) => {
    try {
        await Verb.findByIdAndDelete(req.params.id)
        res.json({ success: true })
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

// Grammar questions
router.post('/admin/grammar/questions', ensureAdmin, async (req, res) => {
    try {
        const q = await GrammarQuestion.create(req.body)
        res.status(201).json(q)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

router.put('/admin/grammar/questions/:id', ensureAdmin, async (req, res) => {
    try {
        const q = await GrammarQuestion.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if (!q) return res.status(404).json({ error: 'Not found' })
        res.json(q)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

router.delete('/admin/grammar/questions/:id', ensureAdmin, async (req, res) => {
    try {
        await GrammarQuestion.findByIdAndDelete(req.params.id)
        res.json({ success: true })
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

// Sentences
router.post('/admin/sentences', ensureAdmin, async (req, res) => {
    try {
        const s = await SentenceExercise.create(req.body)
        res.status(201).json(s)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

router.put('/admin/sentences/:id', ensureAdmin, async (req, res) => {
    try {
        const s = await SentenceExercise.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if (!s) return res.status(404).json({ error: 'Not found' })
        res.json(s)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

router.delete('/admin/sentences/:id', ensureAdmin, async (req, res) => {
    try {
        await SentenceExercise.findByIdAndDelete(req.params.id)
        res.json({ success: true })
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

// Reading passages admin
router.post('/admin/reading', ensureAdmin, async (req, res) => {
    try {
        const passage = await ReadingPassage.create(req.body)
        res.status(201).json(passage)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

router.put('/admin/reading/:id', ensureAdmin, async (req, res) => {
    try {
        const passage = await ReadingPassage.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if (!passage) return res.status(404).json({ error: 'Not found' })
        res.json(passage)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

router.delete('/admin/reading/:id', ensureAdmin, async (req, res) => {
    try {
        await ReadingPassage.findByIdAndDelete(req.params.id)
        res.json({ success: true })
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

// Idioms admin
router.post('/admin/idioms', ensureAdmin, async (req, res) => {
    try {
        const idiom = await IdiomExpression.create(req.body)
        res.status(201).json(idiom)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

router.put('/admin/idioms/:id', ensureAdmin, async (req, res) => {
    try {
        const idiom = await IdiomExpression.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if (!idiom) return res.status(404).json({ error: 'Not found' })
        res.json(idiom)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

router.delete('/admin/idioms/:id', ensureAdmin, async (req, res) => {
    try {
        await IdiomExpression.findByIdAndDelete(req.params.id)
        res.json({ success: true })
    } catch (err) {
        res.status(400).json({ error: err.message })
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
        let progress = await UserProgress.findOne({ user: req.user._id })
        if (!progress) {
            progress = await UserProgress.create({ user: req.user._id })
        }
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
        let progress = await UserProgress.findOne({ user: req.user._id })
        if (!progress) progress = await UserProgress.create({ user: req.user._id })
        res.json({ streak: progress.streak })
    } catch (err) {
        res.status(500).json({ error: 'Failed to load streak' })
    }
})

// POST /italian/api/progress/streak/check
// Called on app load to update streak if needed.
router.post('/api/progress/streak/check', ensureAuthenticated, async (req, res) => {
    try {
        let progress = await UserProgress.findOne({ user: req.user._id })
        if (!progress) progress = await UserProgress.create({ user: req.user._id })

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

        let progress = await UserProgress.findOne({ user: req.user._id })
        if (!progress) progress = await UserProgress.create({ user: req.user._id })

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

