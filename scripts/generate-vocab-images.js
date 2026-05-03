#!/usr/bin/env node
/**
 * scripts/generate-vocab-images.js
 *
 * Generates DALL-E 3 illustrations for every Italian A1 vocabulary word.
 *
 * Usage:
 *   node scripts/generate-vocab-images.js              # all categories
 *   node scripts/generate-vocab-images.js "Food & Drink"  # one category
 *
 * Prerequisites:
 *   OPENAI_API_KEY set in .env or environment
 *
 * Output:
 *   public/img/vocab/{category-slug}/{word-slug}.png
 *
 * Estimated cost: ~$0.04 per image (DALL-E 3 standard 1024x1024)
 * Total for all ~130 words: ~$5.20
 *
 * The script is fully resumable — already-generated files are skipped.
 */

require('dotenv').config()
const fs   = require('fs')
const path = require('path')
const https = require('https')
const vm   = require('vm')
const axios = require('axios')

// ── Load VOCAB from italian-data.js without modifying it ────────────
const dataCode = fs.readFileSync(path.join(__dirname, '../italian-data.js'), 'utf8')
  .replace(/\bconst\b/g, 'var').replace(/\blet\b/g, 'var')
const sandbox  = {}
vm.runInNewContext(dataCode, sandbox)
const VOCAB = sandbox.VOCAB
if (!VOCAB) { console.error('❌  Could not read VOCAB from italian-data.js'); process.exit(1) }

// ── Config ────────────────────────────────────────────────────────────
const OPENAI_KEY = process.env.OPENAI_API_KEY
if (!OPENAI_KEY) { console.error('❌  OPENAI_API_KEY not set in .env'); process.exit(1) }

const OUT_DIR    = path.join(__dirname, '../public/img/vocab')
const DELAY_MS   = 13000   // ~4.5 req/min — safely under DALL-E 3 tier-1 limit (5/min)
const MODEL      = 'dall-e-3'
const SIZE       = '1024x1024'
const QUALITY    = 'standard'

// ── Slug helpers (must match italian-app.js vocabImgUrl) ─────────────
function wordSlug(enWord) {
  return enWord
    .toLowerCase()
    .replace(/^(the|a|an)\s+/i, '')  // strip leading article
    .replace(/\(.*?\)/g, ' ')         // remove parentheticals
    .replace(/[\/\.…]+/g, ' ')        // slashes / dots → space
    .replace(/[^a-z0-9]+/g, '-')      // non-alphanumeric → hyphen
    .replace(/^-+|-+$/g, '')          // trim hyphens
}

function catSlug(cat) {
  return cat
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// ── Per-category accent colours (vary backgrounds across categories) ───
const CAT_ACCENT = {
  'Greetings':          'warm cobalt blue',
  'Numbers':            'Venetian red',
  'Colors':             'deep ochre yellow',
  'Family':             'terracotta orange',
  'Food & Drink':       'olive green',
  'Days & Time':        'slate indigo',
  'Common Adjectives':  'burnt sienna',
  'Around the House':   'sage green',
  'In the City':        'dusty rose',
  'Common Phrases':     'warm cobalt blue',
  'Travel':             'Mediterranean teal',
  'Emotions':           'deep plum',
  'Health':             'celadon green',
  'Weather':            'steel blue',
  'Work & Professions': 'charcoal with warm highlights',
  'Technology':         'midnight blue',
  'Sport & Hobbies':    'forest green',
}

// ── Image prompt ──────────────────────────────────────────────────────
function buildPrompt(enWord, catName) {
  const subject = enWord
    .replace(/^(the|a|an)\s+/i, '')
    .replace(/\(.*?\)/g, '')
    .replace(/[\.…\/]+/g, ' ')
    .trim()

  const accent = CAT_ACCENT[catName] || 'terracotta'

  return (
    `A clean flat vector-style illustration for an Italian language vocabulary flashcard. ` +
    `The single subject is "${subject}" — centered, filling most of the frame, instantly recognizable at a glance. ` +
    `Style: bold confident outlines, flat solid color fills, zero gradients, zero textures, zero shadows. ` +
    `Background: a single solid ${accent} rectangle — nothing else. The subject sits directly on it. ` +
    `The subject itself uses 2–4 flat colors maximum. Shapes are clean and geometric, slightly simplified but not cartoonishly cute. ` +
    `Think high-quality app icon or modern educational flashcard illustration — crisp, professional, immediately readable. ` +
    `No scenes, no secondary objects, no decorative elements, no patterns, no depth effects. ` +
    `No text, no letters, no numbers, no borders, no frames, no writing of any kind.`
  )
}

// ── Helpers ───────────────────────────────────────────────────────────
function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest)
    https.get(url, res => {
      if (res.statusCode !== 200) {
        res.resume()
        fs.unlink(dest, () => {})
        return reject(new Error(`HTTP ${res.statusCode} downloading image`))
      }
      res.pipe(file)
      file.on('finish', () => { file.close(); resolve() })
      file.on('error', err => { fs.unlink(dest, () => {}); reject(err) })
    }).on('error', err => { fs.unlink(dest, () => {}); reject(err) })
  })
}

async function generateImage(enWord, catName) {
  const prompt = buildPrompt(enWord, catName)
  const resp = await axios.post(
    'https://api.openai.com/v1/images/generations',
    { model: MODEL, prompt, n: 1, size: SIZE, quality: QUALITY, response_format: 'url' },
    {
      headers: { Authorization: `Bearer ${OPENAI_KEY}`, 'Content-Type': 'application/json' },
      timeout: 90000
    }
  )
  return resp.data.data[0].url
}

// ── Main ──────────────────────────────────────────────────────────────
async function main() {
  const filterCat = process.argv[2]   // optional: "Food & Drink"

  const categories = filterCat
    ? (VOCAB[filterCat] ? [filterCat] : null)
    : Object.keys(VOCAB)

  if (!categories) {
    console.error(`❌  Unknown category "${filterCat}"`)
    console.error('    Available:', Object.keys(VOCAB).join(', '))
    process.exit(1)
  }

  let total = 0
  categories.forEach(cat => { total += VOCAB[cat].length })
  let generated = 0, skipped = 0, failed = 0

  console.log(`\n🎨  Generating ${total} vocab card image${total !== 1 ? 's' : ''}`)
  if (filterCat) console.log(`    Category: ${filterCat}`)
  console.log(`    Output:   ${OUT_DIR}`)
  console.log(`    Delay:    ${DELAY_MS / 1000}s between requests`)
  console.log(`    Est. cost: ~$${(total * 0.04).toFixed(2)} (DALL-E 3 standard)\n`)

  for (const cat of categories) {
    const catDir = path.join(OUT_DIR, catSlug(cat))
    fs.mkdirSync(catDir, { recursive: true })

    console.log(`\n── ${cat} ─────────────────────────────────`)

    for (const word of VOCAB[cat]) {
      const filename = wordSlug(word.en) + '.png'
      const filepath = path.join(catDir, filename)

      if (fs.existsSync(filepath)) {
        console.log(`  ⏭  skip   ${filename}`)
        skipped++
        continue
      }

      console.log(`  ⏳  gen    ${filename}  ("${word.it}" / "${word.en}")`)

      let success = false
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          const imgUrl = await generateImage(word.en, cat)
          await downloadImage(imgUrl, filepath)
          console.log(`  ✅  saved  ${filename}`)
          generated++
          success = true
          break
        } catch (err) {
          const msg = err.response?.data?.error?.message || err.message
          if (attempt < 2) {
            console.warn(`  ⚠️   retry  (${msg})`)
            await sleep(5000)
          } else {
            console.error(`  ❌  fail   ${filename}: ${msg}`)
            failed++
          }
        }
      }

      if (success) await sleep(DELAY_MS)
    }
  }

  console.log('\n' + '─'.repeat(50))
  console.log(`✨  Done — ${generated} generated, ${skipped} skipped, ${failed} failed`)
  if (generated > 0) {
    console.log(`💰  Actual cost: ~$${(generated * 0.04).toFixed(2)}`)
    console.log(`📁  Images at:   ${OUT_DIR}`)
    console.log(`\n💡  Next steps:`)
    console.log(`    1. Upload public/img/vocab/ to your CDN`)
    console.log(`    2. Set CDN_BASE=https://your-cdn.example.com in .env`)
    console.log(`    3. Restart the server`)
  }
}

main().catch(err => { console.error('\n❌  Fatal:', err.message); process.exit(1) })
