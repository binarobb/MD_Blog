const express = require('express')
const rateLimit = require('express-rate-limit')
const router = express.Router()
const isDev = process.env.NODE_ENV !== 'production'

// Per-route rate limiters
const signedUrlLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: 'Audio request limit reached. Please try again in an hour.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isDev,
})

const ttsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  message: 'Too many pronunciation requests. Please wait a moment.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isDev,
})

// In-memory TTS cache: Map<text, Buffer> with FIFO eviction at 500 entries
const TTS_CACHE_MAX = 500
const ttsCache = new Map()

router.get('/signed-url', signedUrlLimiter, async (req, res) => {
  const apiKey = process.env.ELEVENLABS_API_KEY
  const agentId = process.env.ELEVENLABS_AGENT_ID

  if (!apiKey || !agentId) {
    return res.status(500).json({ error: 'ElevenLabs not configured' })
  }

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${encodeURIComponent(agentId)}`,
      {
        method: 'GET',
        headers: {
          'xi-api-key': apiKey,
        },
      }
    )

    if (!response.ok) {
      console.error('ElevenLabs signed-url error:', response.status)
      return res.status(502).json({ error: 'Failed to get signed URL' })
    }

    const body = await response.json()
    res.send(body.signed_url)
  } catch (err) {
    console.error('ElevenLabs signed-url fetch error:', err.message)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.post('/tts', ttsLimiter, async (req, res) => {
  const apiKey = process.env.ELEVENLABS_API_KEY
  const voiceId = process.env.ELEVENLABS_VOICE_ID

  if (!apiKey || !voiceId) {
    return res.status(503).json({ error: 'TTS not configured' })
  }

  const { text } = req.body
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return res.status(400).json({ error: 'text is required' })
  }
  if (text.length > 5000) {
    return res.status(400).json({ error: 'text exceeds 5000 character limit' })
  }

  const cacheKey = text.trim()
  if (ttsCache.has(cacheKey)) {
    const cached = ttsCache.get(cacheKey)
    res.set('Content-Type', 'audio/mpeg')
    res.set('Cache-Control', 'public, max-age=86400')
    return res.send(cached)
  }

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: cacheKey,
          model_id: 'eleven_multilingual_v2',
          voice_settings: { stability: 0.5, similarity_boost: 0.75 },
        }),
      }
    )

    if (!response.ok) {
      const msg = await response.text().catch(() => '')
      console.error('ElevenLabs TTS error:', response.status, msg)
      return res.status(502).json({ error: 'TTS request failed' })
    }

    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // FIFO eviction
    if (ttsCache.size >= TTS_CACHE_MAX) {
      ttsCache.delete(ttsCache.keys().next().value)
    }
    ttsCache.set(cacheKey, buffer)

    res.set('Content-Type', 'audio/mpeg')
    res.set('Cache-Control', 'public, max-age=86400')
    res.send(buffer)
  } catch (err) {
    console.error('ElevenLabs TTS fetch error:', err.message)
    res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router
