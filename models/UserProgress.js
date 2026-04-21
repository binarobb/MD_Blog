const mongoose = require('mongoose')

// ── Section stats sub-schema ─────────────────────────────────────────
const sectionStatsSchema = new mongoose.Schema({
    correct:       { type: Number, default: 0 },
    total:         { type: Number, default: 0 },
    sessions:      { type: Number, default: 0 },
    lastPracticed: { type: Date,   default: null }
}, { _id: false })

// ── Streak sub-schema ────────────────────────────────────────────────
const streakSchema = new mongoose.Schema({
    current:        { type: Number, default: 0 },
    longest:        { type: Number, default: 0 },
    lastActiveDate: { type: String, default: null }  // YYYY-MM-DD UTC
}, { _id: false })

// ── Achievement sub-schema ───────────────────────────────────────────
const achievementSchema = new mongoose.Schema({
    key:        { type: String, required: true },
    unlockedAt: { type: Date,   default: Date.now }
}, { _id: false })

// ── UserProgress schema ──────────────────────────────────────────────
const userProgressSchema = new mongoose.Schema({
    user: {
        type:     mongoose.Schema.Types.ObjectId,
        ref:      'User',
        required: true,
        unique:   true
    },

    // Per-section stats: vocab, verbs, grammar, sentences, reading, idioms
    sections: {
        type:    Map,
        of:      sectionStatsSchema,
        default: () => ({})
    },

    // Streak tracking
    streak: {
        type:    streakSchema,
        default: () => ({})
    },

    // XP and level
    xp:    { type: Number, default: 0, min: 0 },
    level: { type: Number, default: 1, min: 1 },

    // Daily goal
    dailyGoal:       { type: Number, default: 20 },
    todayCompleted:  { type: Number, default: 0 },
    todayDate:       { type: String, default: null },  // YYYY-MM-DD UTC

    // Achievements
    achievements: [achievementSchema]

}, { timestamps: true })

// ── Helpers ──────────────────────────────────────────────────────────

/**
 * Returns today's date string in YYYY-MM-DD UTC format.
 */
userProgressSchema.statics.todayUTC = function () {
    return new Date().toISOString().slice(0, 10)
}

/**
 * Calculate level from XP using: level = floor(sqrt(xp / 100)) + 1
 */
userProgressSchema.statics.levelFromXP = function (xp) {
    return Math.floor(Math.sqrt(Math.max(0, xp) / 100)) + 1
}

/**
 * XP needed to reach the next level from the current one.
 */
userProgressSchema.statics.xpForLevel = function (level) {
    return Math.pow(level - 1, 2) * 100
}

/**
 * Apply streak logic based on today's date vs lastActiveDate.
 * Mutates the streak subdoc in-place. Returns { changed, wasReset }.
 */
userProgressSchema.methods.updateStreak = function () {
    const today = UserProgress.todayUTC()
    const streak = this.streak

    if (streak.lastActiveDate === today) {
        return { changed: false, wasReset: false }
    }

    const yesterday = new Date()
    yesterday.setUTCDate(yesterday.getUTCDate() - 1)
    const yesterdayStr = yesterday.toISOString().slice(0, 10)

    let wasReset = false
    if (streak.lastActiveDate === yesterdayStr) {
        streak.current += 1
    } else {
        streak.current = 1
        wasReset = streak.lastActiveDate !== null
    }

    if (streak.current > streak.longest) {
        streak.longest = streak.current
    }

    streak.lastActiveDate = today
    return { changed: true, wasReset }
}

/**
 * Reset todayCompleted if todayDate is stale.
 */
userProgressSchema.methods.refreshDailyGoal = function () {
    const today = UserProgress.todayUTC()
    if (this.todayDate !== today) {
        this.todayCompleted = 0
        this.todayDate = today
    }
}

const UserProgress = mongoose.model('UserProgress', userProgressSchema)
module.exports = UserProgress
