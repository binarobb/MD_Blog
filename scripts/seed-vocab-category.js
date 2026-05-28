#!/usr/bin/env node
/**
 * scripts/seed-vocab-category.js
 *
 * AI-powered vocab seeder — uses GPT-4o to generate Italian vocabulary
 * for a given category, then upserts it into MongoDB.
 *
 * Usage:
 *   node scripts/seed-vocab-category.js \
 *     --slug restaurant \
 *     --name "Restaurant" \
 *     --group "Food & Dining" \
 *     --groupOrder 3 \
 *     --groupIcon "🍽️" \
 *     --difficulty 2 \
 *     --count 25 \
 *     [--dry-run] \
 *     [--output ./out.json]
 *
 * Prerequisites:
 *   OPENAI_API_KEY and MONGODB_URI set in .env
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') })
const axios    = require('axios')
const mongoose = require('mongoose')
const fs       = require('fs')

const VocabCategory = require('../models/italian/VocabCategory')
const VocabItem     = require('../models/italian/VocabItem')

// ── CLI arg parsing ──────────────────────────────────────────────────
function arg(flag, fallback) {
  const i = process.argv.indexOf(flag)
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback
}
function hasFlag(flag) { return process.argv.includes(flag) }

const slug       = arg('--slug',       null)
const name       = arg('--name',       null)
const group      = arg('--group',      null)
const groupOrder = parseInt(arg('--groupOrder', '99'), 10)
const groupIcon  = arg('--groupIcon',  '📚')
const difficulty = parseInt(arg('--difficulty',  '1'), 10) // 1=A1, 2=A2, 3=B1
const count      = parseInt(arg('--count',       '20'), 10)
const dryRun     = hasFlag('--dry-run')
const outputPath = arg('--output', null)

if (!slug || !name) {
  console.error('Usage: node scripts/seed-vocab-category.js --slug <slug> --name <name> --group <group> --groupOrder <n> --groupIcon <emoji> [--difficulty 1|2|3] [--count 20] [--dry-run] [--output path.json]')
  process.exit(1)
}

const OPENAI_KEY = process.env.OPENAI_API_KEY
if (!OPENAI_KEY) { console.error('❌  OPENAI_API_KEY not set in .env'); process.exit(1) }

const CEFR_LABEL = { 1: 'A1', 2: 'A2', 3: 'B1' }
const cefrLabel  = CEFR_LABEL[difficulty] || 'A2'

// ── GPT-4o call ──────────────────────────────────────────────────────
async function generateVocab(existingItalian = []) {
  const exclusionNote = existingItalian.length
    ? `\n\nDo NOT include any of these already-seeded Italian words: ${existingItalian.slice(0, 60).join(', ')}.`
    : ''

  const systemPrompt = `You are an expert Italian language teacher creating vocabulary lists for an Italian learning app. Return ONLY valid JSON — no markdown, no code fences, no commentary.`

  const userPrompt = `Generate ${count} Italian vocabulary words for the category "${name}" appropriate for ${cefrLabel}-level English-speaking learners.

Each item must be a JSON object with exactly these fields:
- "italian": the Italian word or short phrase (with article where appropriate, e.g. "il ristorante")
- "english": the English translation (concise)
- "tags": array of 0–3 related category slugs (e.g. ["food-drink", "travel"]) — omit if no strong cross-category overlap
- "exampleSentence": a simple Italian sentence using the word, appropriate for ${cefrLabel} level${exclusionNote}

Return a raw JSON array of ${count} objects. No wrapper object, no markdown.`

  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-4o',
      temperature: 0.7,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userPrompt }
      ]
    },
    {
      headers: {
        Authorization: `Bearer ${OPENAI_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 60000
    }
  )

  const raw = response.data.choices[0].message.content.trim()
  // Strip markdown code fence if GPT ignores instructions
  const cleaned = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
  return JSON.parse(cleaned)
}

// ── Main ─────────────────────────────────────────────────────────────
async function main() {
  if (!dryRun) {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅  Connected to MongoDB')
  }

  // Fetch existing words for this category to avoid duplicates in prompt
  let existingItalian = []
  if (!dryRun) {
    const cat = await VocabCategory.findOne({ slug })
    if (cat) {
      const existing = await VocabItem.find({ category: cat._id }).select('italian').lean()
      existingItalian = existing.map(v => v.italian)
      if (existingItalian.length) {
        console.log(`ℹ️   ${existingItalian.length} existing words will be excluded from GPT prompt`)
      }
    }
  }

  console.log(`🤖  Calling GPT-4o for ${count} "${name}" (${cefrLabel}) words…`)
  let items
  try {
    items = await generateVocab(existingItalian)
  } catch (err) {
    console.error('❌  GPT-4o error:', err.response?.data || err.message)
    process.exit(1)
  }

  if (!Array.isArray(items)) {
    console.error('❌  GPT-4o did not return an array. Got:', typeof items)
    process.exit(1)
  }

  console.log(`✅  GPT-4o returned ${items.length} items`)

  if (outputPath) {
    fs.writeFileSync(outputPath, JSON.stringify(items, null, 2))
    console.log(`💾  Saved to ${outputPath}`)
  }

  if (dryRun) {
    console.log('\n── DRY RUN preview (first 5) ──')
    items.slice(0, 5).forEach((it, i) => {
      console.log(`  ${i + 1}. ${it.italian} → ${it.english}`)
      if (it.exampleSentence) console.log(`     "${it.exampleSentence}"`)
    })
    console.log('\n✅  Dry run complete — nothing written to DB')
    return
  }

  // Upsert category
  const category = await VocabCategory.findOneAndUpdate(
    { slug },
    { name, slug, group, groupOrder, groupIcon },
    { upsert: true, new: true }
  )
  console.log(`✅  Category "${name}" upserted (id: ${category._id})`)

  // Upsert each item
  let inserted = 0, updated = 0, errors = 0
  for (const item of items) {
    if (!item.italian || !item.english) { errors++; continue }
    try {
      const result = await VocabItem.findOneAndUpdate(
        { category: category._id, italian: item.italian },
        {
          category:        category._id,
          italian:         item.italian,
          english:         item.english,
          difficulty,
          tags:            Array.isArray(item.tags) ? item.tags : [],
          exampleSentence: item.exampleSentence || ''
        },
        { upsert: true, new: true, includeResultMetadata: true }
      )
      if (result.lastErrorObject?.updatedExisting) updated++
      else inserted++
    } catch (err) {
      console.warn(`  ⚠️  Skip "${item.italian}": ${err.message}`)
      errors++
    }
  }

  console.log(`\n📊  Results: ${inserted} inserted, ${updated} updated, ${errors} errors`)
  await mongoose.disconnect()
}

main().catch(err => {
  console.error('❌  Fatal:', err)
  process.exit(1)
})
