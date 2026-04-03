# My Markdown Blog

A Markdown-powered blog platform built with Node.js, Express, MongoDB, and EJS, with an integrated Italian language learning SPA and an ElevenLabs voice tutor.

## Features

- Article management (CRUD) with Markdown rendering
- Code block copy button, card flip UI, footer
- **Italian A1–B1 Learning App** — multi-level SPA (Vocabulary, Verb Drill, Grammar Reference, Grammar Quiz, Sentence Builder, Reading Comprehension, Idioms) backed by MongoDB with per-level filtering
- **Verb Reference** — 86 verbs (A1/A2/B1) with paginated grid, search, group filter, and tabbed conjugation modal (Presente, Passato Prossimo, Imperfetto)
- **Gufo Voice Tutor** — ElevenLabs Conversational AI voice agent embedded as a floating owl button on the Italian page
- **Level selector** — filter all content by A1 / A2 / B1 or show everything; preference persisted in `localStorage`
- **Empty-state handling** — graceful "No content at this level" UI with a shortcut back to All Levels

## Italian Learning App

### Content Overview

| Section | Description |
|---|---|
| Vocabulary | 194 words across 14 categories (Greetings, Colors, Food & Drink, etc.) |
| Verb Drill | 86 verbs (A1–B1) — type or multiple-choice conjugation practice across Presente, Passato Prossimo, and Imperfetto |
| Grammar Reference | 8 accordion topics + paginated verb reference (20/page) with search, group filter, and tabbed conjugation modal |
| Grammar Quiz | 37 multiple-choice grammar questions |
| Sentence Builder | 30 word-order exercises |
| Reading Comprehension | 10 passages (4 A1, 4 A2, 2 B1) with glossary and comprehension questions |
| Idioms | 25 idiom expressions with flip-card study and quiz modes |

### Level System

All content carries a `difficulty` field (`1 = A1, 2 = A2, 3 = B1`). The level selector filters every section — vocab, verbs, grammar, sentences, idioms — via the API. Reading passages use a `level` field with the same values.

### Database Collections

| Collection | Model file |
|---|---|
| `vocabcategories` | `models/italian/VocabCategory.js` |
| `vocabitems` | `models/italian/VocabItem.js` |
| `verbs` | `models/italian/Verb.js` — 86 verbs (A1/A2/B1) with 3-tense conjugations |
| `grammartopics` | `models/italian/GrammarTopic.js` |
| `grammarquestions` | `models/italian/GrammarQuestion.js` |
| `sentenceexercises` | `models/italian/SentenceExercise.js` |
| `readingpassages` | `models/italian/ReadingPassage.js` — 10 passages (4 A1, 4 A2, 2 B1) |
| `idiomexpressions` | `models/italian/IdiomExpression.js` — 25 idiom expressions |

### API Endpoints

All endpoints are mounted under `/italian/api`:

```
GET /italian/api/vocab/categories
GET /italian/api/vocab/:category        (?level=a1|a2|b1)
GET /italian/api/verbs                  (?group=-are|-ere|-ire|irregular|reflexive &level=a1|a2|b1)
GET /italian/api/grammar/topics
GET /italian/api/grammar/questions      (?topic= &level=a1|a2|b1)
GET /italian/api/sentences              (?level=a1|a2|b1)
GET /italian/api/reading                (?level=a1|a2|b1 &page= &limit=)
GET /italian/api/reading/:id
GET /italian/api/idioms                 (?level=a1|a2|b1)
```

### Seeding the Database

```bash
npm run seed-italian
```

Idempotent — safe to re-run. All collections use upsert; grammar questions and sentence exercises are cleared and re-inserted.

### Models

Mongoose models live in `models/italian/`:

- `VocabCategory.js`
- `VocabItem.js`
- `Verb.js`
- `GrammarTopic.js`
- `GrammarQuestion.js`
- `SentenceExercise.js`
- `ReadingPassage.js`
- `IdiomExpression.js`

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
  article.js
  italian/
    VocabCategory.js     VocabItem.js         Verb.js
    GrammarTopic.js      GrammarQuestion.js   SentenceExercise.js
    ReadingPassage.js    IdiomExpression.js
routes/
  articles.js             — Blog CRUD routes
  italian.js              — Italian page + API
  elevenlabs.js           — ElevenLabs signed-URL proxy
scripts/
  seed-italian.js         — Populates / refreshes all Italian collections
  generate-vocab-images.js
views/
  italian/index.ejs       — Italian SPA shell
  articles/               — Blog article templates
public/
  img/vocab/              — Vocabulary category images
italian-data.js           — Source data (consumed only by seed script)
italian-app.js            — Italian SPA engine (fetches from API at runtime)
style.css                 — Global + Italian app styles
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

MIT
