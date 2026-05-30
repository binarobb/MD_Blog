/**
 * One-shot backfill: sets group, groupOrder, and groupIcon on all VocabCategory documents.
 * Safe to re-run — uses updateOne with $set so existing values are overwritten.
 */

require('dotenv').config()
const mongoose = require('mongoose')
const VocabCategory = require('../models/italian/VocabCategory')

const GROUPS = [
  {
    group: 'A1 Essentials',
    groupOrder: 1,
    groupIcon: '🌱',
    slugs: ['greetings', 'numbers', 'colors', 'family', 'days-time', 'common-phrases']
  },
  {
    group: 'A1 Daily Life',
    groupOrder: 2,
    groupIcon: '🏠',
    slugs: ['food-drink', 'around-the-house', 'common-adjectives']
  },
  {
    group: 'A2 Out & About',
    groupOrder: 3,
    groupIcon: '🏙️',
    slugs: ['in-the-city', 'travel']
  },
  {
    group: 'A2 Expression',
    groupOrder: 4,
    groupIcon: '💬',
    slugs: ['emotions', 'weather']
  },
  {
    group: 'B1 Expanding',
    groupOrder: 5,
    groupIcon: '📈',
    slugs: ['health', 'work-professions', 'technology', 'sport-hobbies']
  }
]

async function run() {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('Connected to MongoDB\n')

  let totalUpdated = 0

  for (const { group, groupOrder, groupIcon, slugs } of GROUPS) {
    for (const slug of slugs) {
      const result = await VocabCategory.updateOne(
        { slug },
        { $set: { group, groupOrder, groupIcon } }
      )
      if (result.matchedCount === 0) {
        console.warn(`  ⚠  Not found: ${slug}`)
      } else {
        const changed = result.modifiedCount > 0 ? 'updated' : 'already set'
        console.log(`  ✓  ${slug}  →  ${groupIcon} ${group}  (${changed})`)
        totalUpdated += result.modifiedCount
      }
    }
    console.log()
  }

  // Verify final state
  const missing = await VocabCategory.countDocuments({ group: { $exists: false } })
  console.log(`Documents updated this run: ${totalUpdated}`)
  console.log(`Categories still missing group: ${missing}`)

  await mongoose.disconnect()
}

run().catch(async err => {
  console.error(err)
  try { await mongoose.disconnect() } catch {}
  process.exit(1)
})
