// scripts/seed-italian.js
// Migrates all hardcoded italian-data.js content into MongoDB.
// Safe to re-run — uses upsert so existing documents are updated, not duplicated.

require('dotenv').config({ path: require('path').join(__dirname, '../.env') })
const mongoose = require('mongoose')

const { VERBS, VOCAB, GRAMMAR, GRAMMAR_QUIZ, SENTENCES } = require('../italian-data')

const VocabCategory    = require('../models/italian/VocabCategory')
const VocabItem        = require('../models/italian/VocabItem')
const Verb             = require('../models/italian/Verb')
const GrammarTopic     = require('../models/italian/GrammarTopic')
const GrammarQuestion  = require('../models/italian/GrammarQuestion')
const SentenceExercise = require('../models/italian/SentenceExercise')

// Build slug from a category name (e.g. "Food & Drink" → "food-drink")
function toSlug(str) {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

async function seedCategories() {
    const categoryNames = Object.keys(VOCAB)
    const results = []

    for (let i = 0; i < categoryNames.length; i++) {
        const name = categoryNames[i]
        const slug = toSlug(name)
        const doc = await VocabCategory.findOneAndUpdate(
            { slug },
            { name, slug, order: i },
            { upsert: true, new: true }
        )
        results.push(doc)
    }

    console.log(`  VocabCategories: ${results.length} upserted`)
    return results
}

async function seedVocabItems(categories) {
    // Build a lookup map: slug → category doc
    const categoryMap = {}
    for (const cat of categories) {
        categoryMap[cat.slug] = cat
    }

    let total = 0
    for (const [name, items] of Object.entries(VOCAB)) {
        const slug = toSlug(name)
        const category = categoryMap[slug]
        if (!category) {
            console.warn(`  WARNING: No category found for "${name}" (slug: ${slug})`)
            continue
        }

        for (const item of items) {
            // Map existing public/img/vocab/<slug>/ directory convention
            const imageBase = `/img/vocab/${slug}/`
            await VocabItem.findOneAndUpdate(
                { category: category._id, italian: item.it },
                {
                    category: category._id,
                    italian: item.it,
                    english: item.en,
                    imageUrl: imageBase,
                    difficulty: 1
                },
                { upsert: true, new: true }
            )
            total++
        }
    }

    console.log(`  VocabItems: ${total} upserted`)
}

async function seedVerbs() {
    let total = 0
    for (const verb of VERBS) {
        await Verb.findOneAndUpdate(
            { infinitive: verb.infinitive },
            {
                infinitive: verb.infinitive,
                translation: verb.translation,
                group: verb.group,
                conjugation: verb.conjugation,
                example: verb.example,
                examples: verb.examples || [],
                difficulty: 1
            },
            { upsert: true, new: true }
        )
        total++
    }
    console.log(`  Verbs: ${total} upserted`)
}

async function seedGrammarTopics() {
    let total = 0
    for (let i = 0; i < GRAMMAR.length; i++) {
        const topic = GRAMMAR[i]
        const slug = toSlug(topic.title)
        await GrammarTopic.findOneAndUpdate(
            { slug },
            {
                title: topic.title,
                slug,
                body: topic.body,
                order: i
            },
            { upsert: true, new: true }
        )
        total++
    }
    console.log(`  GrammarTopics: ${total} upserted`)
}

async function seedGrammarQuestions() {
    // GrammarQuestion has no unique natural key, so we clear and re-insert
    // to avoid growing duplicates on re-runs
    await GrammarQuestion.deleteMany({})
    const docs = GRAMMAR_QUIZ.map(q => ({
        question:      q.q,
        correctAnswer: q.a,
        options:       q.opts,
        topic:         q.topic,
        difficulty:    1
    }))
    await GrammarQuestion.insertMany(docs)
    console.log(`  GrammarQuestions: ${docs.length} inserted`)
}

async function seedSentences() {
    // Same clear-and-reinsert strategy as GrammarQuestions
    await SentenceExercise.deleteMany({})
    const docs = SENTENCES.map(s => ({
        english:    s.en,
        words:      s.words,
        difficulty: 1
    }))
    await SentenceExercise.insertMany(docs)
    console.log(`  SentenceExercises: ${docs.length} inserted`)
}

async function run() {
    const uri = process.env.MONGODB_URI
    if (!uri) {
        console.error('ERROR: MONGODB_URI is not set in .env')
        process.exit(1)
    }

    console.log('Connecting to MongoDB...')
    await mongoose.connect(uri)
    console.log('Connected.\n')

    console.log('Seeding Italian content:')
    const categories = await seedCategories()
    await seedVocabItems(categories)
    await seedVerbs()
    await seedGrammarTopics()
    await seedGrammarQuestions()
    await seedSentences()

    console.log('\nSeed complete.')
    await mongoose.disconnect()
}

run().catch(err => {
    console.error('Seed failed:', err)
    process.exit(1)
})
