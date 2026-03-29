# My Markdown Blog

A Markdown-powered blog platform built with Node.js, Express, MongoDB, and EJS.

## Features
- Article management (CRUD)
- Markdown rendering
- Code block copy button
- About and contact pages
- Card flip UI
- Footer
- **Italian A1 Learning App** — SPA with vocabulary, verb conjugation, grammar quizzes, and sentence builder
- **Gufo Voice Tutor** — ElevenLabs Conversational AI voice agent embedded as a floating owl button on the Italian page

## Gufo – Italian Voice Tutor

Gufo (Italian for "owl") is a real-time voice conversation agent powered by [ElevenLabs Conversational AI](https://elevenlabs.io/docs/eleven-agents/overview). It appears as a floating owl button on the `/italian` page and allows users to practice Italian through voice conversation.

### How It Works
- Click the owl button → browser requests microphone access → WebSocket voice session opens with the ElevenLabs agent
- The owl animates based on state: idle pulse, connecting spinner, listening waves, speaking waves
- Click again to end the session

### Architecture
- **Client-side**: Uses `@elevenlabs/client` SDK (loaded via CDN) to connect directly using the public agent ID
- **Server-side route** (`routes/elevenlabs.js`): Proxy endpoint at `/api/elevenlabs/signed-url` for future use with private/authenticated agents (requires `convai_write` API key permission)
- Agent ID: configured in `.env` as `ELEVENLABS_AGENT_ID`
- API key: stored in `.env` as `ELEVENLABS_API_KEY` (not exposed to browser)

### Configuration
Add to your `.env` file:
```
ELEVENLABS_API_KEY=your-elevenlabs-api-key
ELEVENLABS_AGENT_ID=your-agent-id
```

The agent is currently set to **public** (no auth required), so the client connects directly with the agent ID. To switch to authenticated mode, enable auth on the agent in the ElevenLabs dashboard and ensure your API key has `convai_write` permission — the signed URL route is already in place.

## Getting Started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the server:
   ```bash
   node server.js
   ```
3. Visit `http://localhost:3000`

## Folder Structure
- `models/` - Mongoose models
- `routes/` - Express routes (`articles.js`, `italian.js`, `elevenlabs.js`)
- `views/` - EJS templates
- `public/` - Static assets (CSS, JS)

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
MIT
