require('dotenv').config()
const mongoose = require('mongoose')
const VocabCategory = require('../models/italian/VocabCategory')
const VocabItem = require('../models/italian/VocabItem')

async function run() {
  await mongoose.connect(process.env.MONGODB_URI)

  const cats = await VocabCategory.find().sort({ groupOrder: 1, order: 1 }).lean()

  cats.forEach(c => {
    const grp   = c.group    || '(no group)'
    const icon  = c.groupIcon || '  '
    const gord  = c.groupOrder != null ? c.groupOrder : '?'
    console.log(`  gord=${gord}  ${icon}  ${grp}  |  ${c.slug}  |  order=${c.order}`)
  })

  const noGroup = cats.filter(c => !c.group).length
  const noIcon  = cats.filter(c => !c.groupIcon).length
  console.log(`\nTotal categories: ${cats.length} | Missing group: ${noGroup} | Missing groupIcon: ${noIcon}`)

  // Count items per category
  const counts = await VocabItem.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } }
  ])
  console.log(`VocabItem category coverage: ${counts.length} categories have items`)

  // Tags coverage
  const total     = await VocabItem.countDocuments()
  const withTags  = await VocabItem.countDocuments({ 'tags.0': { $exists: true } })
  console.log(`VocabItem tags: ${withTags}/${total} have at least one tag`)

  await mongoose.disconnect()
}

run().catch(async err => {
  console.error(err)
  try { await mongoose.disconnect() } catch {}
  process.exit(1)
})
