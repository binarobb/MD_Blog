const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('italian/index', {
        agentId: process.env.ELEVENLABS_AGENT_ID || ''
    })
})

module.exports = router
