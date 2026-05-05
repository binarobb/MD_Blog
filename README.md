# MD Blog

A Markdown-powered blog and Italian language learning platform built with Node.js, Express, MongoDB, and EJS.

**Live:** [wiseops.io](https://wiseops.io)

## Features

- **Blog** — article management (CRUD) with Markdown rendering, category/tag filtering, code-block copy buttons
- **Italian A1–B1 Learning App** — single-page study app with Vocabulary, Verb Drill, Grammar Reference, Grammar Quiz, Sentence Builder, Reading Comprehension, and Idioms; content filtered by level (A1/A2/B1)
- **Gufo Voice Tutor** — ElevenLabs Conversational AI owl button for spoken Italian practice
- **User Auth** — local email/password registration + Google OAuth 2.0 (Passport.js); roles: `admin` / `user`; sessions persisted to MongoDB
- **Contact Form** — validated contact form sending via [Resend](https://resend.com)
- **Security hardened** — Helmet + strict CSP, rate limiting, input validation, secure session cookies; OWASP Top 10 sweep complete through Phase 7

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 18, Express 4 |
| Templating | EJS |
| Database | MongoDB (Mongoose 7) |
| Auth | Passport.js — local + Google OAuth 2.0 |
| Sessions | express-session + connect-mongo |
| Email | Resend SDK |
| Security | Helmet, express-rate-limit, validator |
| Deployment | Rocky Linux 9, PM2, Nginx, DigitalOcean |
| CI/CD | GitHub Actions (auto-deploy on push to `main`) |

## Security

Phased OWASP hardening applied across Phases 1–7:

| Phase | What was done |
|---|---|
| 1 | Helmet + strict Content Security Policy |
| 2 | Session cookies: `httpOnly`, `sameSite: lax`, `secure` in production |
| 3 | Rate limiting: global (200/15 min), auth (10/15 min), contact (5/15 min), ElevenLabs (20/hr) |
| 4 | Input validation and sanitisation on contact form (`validator`) |
| 5 | Auth middleware: `ensureAuthenticated`, `ensureAdmin`; open-redirect protection on `returnTo` |
| 6 | XSS: DOMPurify on Markdown output, newline-stripping on email headers |
| 7 | Fail-fast env-var check on startup; graceful SIGTERM shutdown; structured error logging |

## Authentication

- **Registration** — email + password (min 8 chars); auto-login after register
- **Login** — local strategy via Passport.js; `returnTo` session redirect after login
- **Google OAuth** — `/auth/google` → callback → session
- **Roles** — `admin` can create/edit/delete articles; `user` can access the Italian app

## Italian Learning App

### Content

| Section | Detail |
|---|---|
| Vocabulary | 194 words across 14 categories with category images |
| Verb Drill | 86 verbs (A1–B1) — type or multiple-choice across Presente, Passato Prossimo, Imperfetto |
| Grammar Reference | 8 accordion topics + paginated verb reference (20/page) with search, group filter, tabbed conjugation modal |
| Grammar Quiz | 37 multiple-choice questions |
| Sentence Builder | 30 word-order drag exercises |
| Reading Comprehension | 10 passages (4 A1, 4 A2, 2 B1) with glossary and comprehension questions |
| Idioms | 25 expressions — flip-card study + quiz mode |

### Level System

All content carries a `difficulty` field (`1 = A1`, `2 = A2`, `3 = B1`). The level selector filters every section via the API; preference is persisted in `localStorage`. Reading passages use a matching `level` field.

### API

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

### Database Collections

| Collection | Model |
|---|---|
| `vocabcategories` | `models/italian/VocabCategory.js` |
| `vocabitems` | `models/italian/VocabItem.js` |
| `verbs` | `models/italian/Verb.js` |
| `grammartopics` | `models/italian/GrammarTopic.js` |
| `grammarquestions` | `models/italian/GrammarQuestion.js` |
| `sentenceexercises` | `models/italian/SentenceExercise.js` |
| `readingpassages` | `models/italian/ReadingPassage.js` |
| `idiomexpressions` | `models/italian/IdiomExpression.js` |

### Seeding

```bash
npm run seed-italian
```

Idempotent — safe to re-run. Collections use upsert; grammar questions and sentence exercises are cleared and re-inserted on each run.

## Gufo – Italian Voice Tutor

Gufo (Italian for "owl") is a real-time voice agent powered by [ElevenLabs Conversational AI](https://elevenlabs.io/docs/eleven-agents/overview). It appears as a floating owl button on `/italian`.

- Click the owl → microphone access → WebSocket voice session with the ElevenLabs agent
- Owl animates across four states: idle pulse, connecting spinner, listening waves, speaking waves
- Click again to end the session
- Server-side proxy route at `/api/elevenlabs/signed-url` for future authenticated agents

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas cluster (or local MongoDB)
- [Resend](https://resend.com) account with a verified sending domain
- ElevenLabs account with a Conversational AI agent (for Gufo)
- Google OAuth credentials (optional, for Google login)

### Setup

1. Clone and install:

   ```bash
   git clone https://github.com/binarobb/MD_Blog.git
   cd MD_Blog
   npm install
   ```

2. Copy and fill in the environment file:

   ```bash
   cp .env.example .env
   ```

   Required variables:

   | Variable | Description |
   |---|---|
   | `MONGODB_URI` | MongoDB connection string |
   | `SESSION_SECRET` | Random string (use `openssl rand -base64 32`) |
   | `RESEND_API_KEY` | Resend API key |
   | `EMAIL_TO` | Address that receives contact form messages |
   | `ELEVENLABS_API_KEY` | ElevenLabs API key |
   | `ELEVENLABS_AGENT_ID` | ElevenLabs Conversational AI agent ID |
   | `GOOGLE_CLIENT_ID` | Google OAuth client ID (optional) |
   | `GOOGLE_CLIENT_SECRET` | Google OAuth client secret (optional) |

3. Seed the Italian content:

   ```bash
   npm run seed-italian
   ```

4. Start the development server:

   ```bash
   npm run devStart
   ```

5. Visit `http://localhost:5000`

## Folder Structure

```
server.js                 — App entry point, middleware, core routes
config/
  passport.js             — Passport local + Google OAuth strategies
middleware/
  auth.js                 — ensureAuthenticated, ensureAdmin helpers
models/
  article.js              — Blog article schema
  User.js                 — User schema (local + OAuth)
  italian/                — Italian app Mongoose models
routes/
  articles.js             — Blog CRUD
  auth.js                 — Login, register, Google OAuth, profile
  italian.js              — Italian page + API endpoints
  elevenlabs.js           — ElevenLabs signed-URL proxy
scripts/
  seed-italian.js         — Seeds / refreshes all Italian collections
  generate-vocab-images.js — Generates vocabulary category images
  inject-blog-post.js     — Utility to inject a blog post from a file
views/
  home.ejs  about.ejs  contact.ejs  login.ejs
  auth/                   — Register, login, profile pages
  articles/               — Blog article templates
  italian/index.ejs       — Italian SPA shell
public/
  img/vocab/              — Vocabulary category images
italian-data.js           — Source data for seed script
italian-app.js            — Italian SPA client engine
style.css                 — Global styles
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first.

## License

MIT
