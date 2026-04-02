# My Markdown Blog

A Markdown-powered blog platform built with Node.js, Express, MongoDB, and EJS.

## Features
- Article management (CRUD)
- Markdown rendering
- Code block copy button
- About and contact pages
- Card flip UI
- Footer
- **Italian A1 Learning App** — SPA with vocabulary, verb conjugation, grammar quizzes, and sentence builder backed by MongoDB
- **Gufo Voice Tutor** — ElevenLabs Conversational AI voice agent embedded as a floating owl button on the Italian page

## Italian A1 Learning App — MongoDB Backend

All Italian learning content (vocabulary, verbs, grammar topics, quiz questions, and sentence exercises) is stored in MongoDB Atlas and served via a JSON API. The frontend fetches data on load rather than relying on hardcoded JavaScript.

### Database Collections
| Collection | Description |
|---|---|
| `vocabcategories` | The 10 vocabulary categories (Greetings, Colors, etc.) |
| `vocabitems` | ~137 vocabulary words linked to their category |
| `verbs` | 30 A1 verbs with full present-tense conjugations and examples |
| `grammartopics` | 8 grammar reference topics with HTML body content |
| `grammarquestions` | 37 multiple-choice grammar quiz questions |
| `sentenceexercises` | 30 sentence builder exercises |

### API Endpoints
All endpoints are mounted under `/italian/api`:

```
GET /italian/api/vocab/categories
GET /italian/api/vocab/:category        (?page=, ?limit=)
GET /italian/api/verbs                  (?group=-are|-ere|-ire|irregular)
GET /italian/api/grammar/topics
GET /italian/api/grammar/questions      (?topic=, ?limit=)
GET /italian/api/sentences              (?limit=)
```

Admin CRUD endpoints (requires active admin session):
```
POST/PUT/DELETE /italian/admin/vocab/:id
POST/PUT/DELETE /italian/admin/verbs/:id
POST/PUT/DELETE /italian/admin/grammar/questions/:id
POST/PUT/DELETE /italian/admin/sentences/:id
```

### Seeding the Database
To populate (or re-populate) the database from the source data in `italian-data.js`:
```bash
npm run seed-italian
```
The seed script is idempotent — safe to re-run. Grammar questions and sentences are cleared and re-inserted; all other collections use upsert.

### Models
Mongoose models live in `models/italian/`:
- `VocabCategory.js`
- `VocabItem.js`
- `Verb.js`
- `GrammarTopic.js`
- `GrammarQuestion.js`
- `SentenceExercise.js`

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

## Getting Started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment — copy `.env.example` to `.env` and fill in values:
   ```
   MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/blogDB
   SESSION_SECRET=<random string>
   ELEVENLABS_API_KEY=...
   ELEVENLABS_AGENT_ID=...
   ```
3. Seed the Italian content:
   ```bash
   npm run seed-italian
   ```
4. Start the dev server:
   ```bash
   npm run devStart
   ```
5. Visit `http://localhost:5000`

## Folder Structure
```
models/
  article.js              — Blog article schema
  italian/
    VocabCategory.js
    VocabItem.js
    Verb.js
    GrammarTopic.js
    GrammarQuestion.js
    SentenceExercise.js
routes/
  articles.js             — Blog CRUD routes
  italian.js              — Italian app page + API + admin CRUD
  elevenlabs.js           — ElevenLabs proxy
scripts/
  seed-italian.js         — Database seeder for Italian content
  generate-vocab-images.js
views/                    — EJS templates
public/                   — Static assets
italian-data.js           — Source data (used by seed script; no longer loaded in browser)
italian-app.js            — Italian SPA engine (fetches from API)
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
MIT

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
