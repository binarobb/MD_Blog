require('dotenv').config({ override: true })
const mongoose = require('mongoose')
const Article = require('../models/article')

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost/blog'

const markdown = `
# Italian Learning App — Feature Recap

Over the past several weeks I've been building out the Italian language learning section of this site, and I wanted to document the major features that have shipped so far.

---

## 🚀 Deploy Pipeline Stability

The production server was experiencing random crashes — traced to a race condition in the GitHub Actions deploy script. The old flow was:

1. \`pm2 stop md-blog\`
2. \`fuser -k 5000/tcp\` (force-kill anything on the port)
3. \`pm2 start server.js\`

The problem: after the \`stop\` command, pm2's built-in auto-restart would sometimes grab port 5000 *before* step 3 could bind to it, causing an \`EADDRINUSE\` crash loop.

**Fix**: replaced the three-step sequence with a single atomic restart:

\`\`\`bash
pm2 restart md-blog --update-env || pm2 start server.js --name "md-blog"
\`\`\`

No more crashing.

---

## 🎙 Gufo AI Voice Tutor — VAD Tuning

Gufo is the in-app Italian conversation partner powered by ElevenLabs. One issue: in environments with ambient noise (a fan, background conversation, etc.), the voice activity detection (VAD) would keep the microphone "open" indefinitely — Gufo would never think you'd stopped talking.

**Fix**: passed explicit VAD overrides when starting the ElevenLabs session:

\`\`\`js
overrides: {
  agent: {
    turn: {
      turn_detection: {
        mode: 'server_vad',
        silence_duration_ms: 700,
        threshold: 0.55,
        prefix_padding_ms: 300,
      }
    }
  }
}
\`\`\`

The default ElevenLabs threshold is around 0.3 — too sensitive for any real room. Bumping it to 0.55 with a 700ms silence window means Gufo reliably detects end-of-turn without being triggered constantly by background noise.

---

## 📱 Mobile Navigation — Leaderboard & Review

The sidebar navigation (with all sections: Vocab, Verbs, Grammar Quiz, Sentences, Reading, Idioms, Reference, Speak, Review, Leaderboard) is hidden on mobile screens. Mobile users were relying on a bottom navigation bar that only had six items — and **Leaderboard** and **Review** weren't among them.

**Fix**: replaced the least-used bottom nav item ("Reference", rarely accessed on mobile) with dedicated entries for Review and Leaderboard:

| Before | After |
|--------|-------|
| Home · Vocab · Verbs · Quiz · Read · Ref | Home · Vocab · Verbs · Quiz · Read · Review · Board |

Each new item also got its own active-state colour — purple for Review, gold for Leaderboard — consistent with the rest of the hybrid theme.

---

## What's Been Built Overall

For anyone catching up, here's the full feature set currently live:

- **Vocabulary SRS** — 800+ words across 12 categories, flashcard review with SM-2 spaced repetition
- **Verb Conjugation Drills** — present, past, future tenses; irregular verbs flagged
- **Grammar Quiz** — multiple-choice grammar questions with topic filtering
- **Sentence Exercises** — fill-in-the-blank and translation practice
- **Reading Passages** — graded Italian texts with comprehension questions
- **Idiom Explorer** — common Italian idioms with usage examples
- **Grammar Reference** — quick-reference conjugation tables and rules
- **Gufo AI Tutor** — real-time Italian conversation via ElevenLabs voice AI
- **SRS Review System** — due-card queue across vocab and grammar, SM-2 scheduling
- **XP + Levels + Streaks** — gamified progress tracking persisted to the database
- **Achievements** — unlockable badges for milestones
- **Daily Goals** — configurable XP targets with progress bars
- **Leaderboard** — weekly XP rankings across all users

All of this lives at [/italian](/italian).
`

async function run() {
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
    console.log('Connected to MongoDB')

    // Delete old version of this post if it exists (idempotent re-run)
    await Article.deleteOne({ slug: 'italian-learning-app-feature-recap' })

    const post = new Article({
        title: 'Italian Learning App — Feature Recap',
        description: 'A recap of everything shipped in the Italian learning section: deploy stability, Gufo VAD tuning, mobile nav fixes, and a full feature inventory.',
        markdown,
        author: 'Matt',
        category: 'Development',
        tags: ['italian', 'features', 'development', 'recap'],
        published: true,
        createdAt: new Date()
    })

    await post.save()
    console.log(`✅ Blog post created: "${post.title}"`)
    console.log(`   Slug: ${post.slug}`)
    console.log(`   Reading time: ~${post.readingTime} min`)
    await mongoose.disconnect()
}

run().catch(err => {
    console.error('Error:', err.message)
    process.exit(1)
})
