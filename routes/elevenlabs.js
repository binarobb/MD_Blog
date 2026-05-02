const express = require('express')
const router = express.Router()
const { ensureAuthenticated } = require('../middleware/auth')

router.get('/signed-url', ensureAuthenticated, async (req, res) => {
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

module.exports = router
