// italian-app.js — SPA engine for the Italian learning app (A1/A2/B1)
// Data is fetched from /italian/api/* endpoints at initialisation

;(function () {
  'use strict'

  // ── Module-level data (populated by loadData on init) ────────────
  const PRONOUNS = ['io', 'tu', 'lui/lei', 'noi', 'voi', 'loro']
  const appData = {
    verbs:       [],
    vocab:       {},   // { 'Greetings': [{it, en}, ...], ... }
    grammar:     [],
    grammarQuiz: [],
    sentences:   [],
    reading:     [],
    idioms:      []
  }

  // ── Helpers ──────────────────────────────────────────────────────
  function shuffle(arr) {
    const a = arr.slice()
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[a[i], a[j]] = [a[j], a[i]]
    }
    return a
  }

  function pick(arr, n) { return shuffle(arr).slice(0, n) }

  function el(id) { return document.getElementById(id) }

  function emptyState(areaId, sectionLabel) {
    const levelLabel = state.level === 'all' ? '' : state.level.toUpperCase()
    el(areaId).innerHTML = `
      <div class="ita-empty-state text-center py-5">
        <div style="font-size:3rem;margin-bottom:1rem">📭</div>
        <h4>No ${levelLabel ? levelLabel + ' ' : ''}${sectionLabel} content yet</h4>
        <p class="text-muted mb-4">There isn't enough content at the <strong>${levelLabel || 'current'}</strong> level for this section.<br>
          Try switching to <strong>All Levels</strong> to see everything.</p>
        <button class="btn btn-primary" onclick="ItalianApp.setLevel('all')">Show All Levels</button>
      </div>`
  }

  function normalize(s) {
    return s.trim().toLowerCase()
      .replace(/[\u2018\u2019\u0060]/g, "'")
      .replace(/[\u2013\u2014]/g, '-')
  }

  // ── State ────────────────────────────────────────────────────────
  const state = {
    section: 'dashboard',
    level: 'all',          // 'all' | 'a1' | 'a2' | 'b1'
    activeTense: 'presenteIndicativo',  // 'presenteIndicativo' | 'passatoProssimo' | 'imperfetto'
    // vocab quiz
    vocabCategory: null,
    vocabQueue: [],
    vocabIndex: 0,
    vocabCorrect: 0,
    vocabTotal: 0,
    vocabMode: 'mc',
    vocabDirection: 'it-en',
    // verb drill
    verbQueue: [],
    verbIndex: 0,
    verbCorrect: 0,
    verbTotal: 0,
    verbMode: 'type',
    verbFilter: 'all',
    verbTense: 'presenteIndicativo',   // 'presenteIndicativo' | 'passatoProssimo' | 'imperfetto'
    // grammar quiz
    grammarQueue: [],
    grammarIndex: 0,
    grammarCorrect: 0,
    grammarTotal: 0,
    grammarFilter: 'all',
    // sentence builder
    sentenceQueue: [],
    sentenceIndex: 0,
    sentenceCorrect: 0,
    sentenceTotal: 0,
    sentencePicked: [],
    // reading
    readingPassage: null,
    readingQuizIndex: 0,
    readingQuizCorrect: 0,
    readingQuizTotal: 0,
    // idioms
    idiomMode: 'study',   // 'study' | 'quiz'
    idiomStudyIndex: 0,
    idiomQuizQueue: [],
    idiomQuizIndex: 0,
    idiomQuizCorrect: 0,
    idiomQuizTotal: 0,
    verbRefPage:    0,
    verbRefSearch:  '',
    verbRefGroup:   'all',
    verbRefTense:   'presenteIndicativo'
  }

  // ── Data loader ──────────────────────────────────────────────────
  async function loadData() {
    const BASE = '/italian/api'
    const lvl = state.level !== 'all' ? `?level=${state.level}` : ''

    const [categoriesRes, verbsRes, grammarTopicsRes, grammarQuestionsRes, sentencesRes, readingRes, idiomsRes] =
      await Promise.all([
        fetch(`${BASE}/vocab/categories`),
        fetch(`${BASE}/verbs${lvl}`),
        fetch(`${BASE}/grammar/topics`),
        fetch(`${BASE}/grammar/questions${lvl}`),
        fetch(`${BASE}/sentences${lvl}`),
        fetch(`${BASE}/reading${lvl}`),
        fetch(`${BASE}/idioms${lvl}`)
      ])

    if (!categoriesRes.ok || !verbsRes.ok || !grammarTopicsRes.ok ||
        !grammarQuestionsRes.ok || !sentencesRes.ok) {
      throw new Error('Failed to load Italian content from server')
    }

    const [categories, verbs, grammarTopics, grammarQuestions, sentences, readingPayload, idioms] =
      await Promise.all([
        categoriesRes.json(),
        verbsRes.json(),
        grammarTopicsRes.json(),
        grammarQuestionsRes.json(),
        sentencesRes.json(),
        readingRes.ok ? readingRes.json() : Promise.resolve({ passages: [] }),
        idiomsRes.ok ? idiomsRes.json() : Promise.resolve([])
      ])

    // Fetch all vocab items for each category in parallel, respecting level filter
    const vocabResponses = await Promise.all(
      categories.map(cat => fetch(`${BASE}/vocab/${cat.slug}${lvl}`))
    )
    const vocabData = await Promise.all(vocabResponses.map(r => r.json()))

    // Rebuild VOCAB map: category name → [{it, en}] (matches existing app format)
    const vocab = {}
    categories.forEach((cat, i) => {
      vocab[cat.name] = (vocabData[i].items || []).map(item => ({
        it: item.italian,
        en: item.english
      }))
    })

    appData.verbs       = verbs
    appData.vocab       = vocab
    appData.grammar     = grammarTopics
    appData.grammarQuiz = grammarQuestions.map(q => ({
      q:     q.question,
      a:     q.correctAnswer,
      opts:  q.options,
      topic: q.topic
    }))
    appData.sentences = sentences.map(s => ({
      en:    s.english,
      words: s.words
    }))
    appData.reading = readingPayload.passages || []
    appData.idioms  = Array.isArray(idioms) ? idioms : []
  }

  // ── Level selector ───────────────────────────────────────────────
  function setLevel(level) {
    state.level = level
    try { localStorage.setItem('italian_level', level) } catch {}
    document.querySelectorAll('.ita-level-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.level === level)
    })
    // Reload data for the new level then re-render the active section
    loadData().then(() => {
      const s = state.section
      if      (s === 'dashboard')   renderDashboard()
      else if (s === 'grammar')     renderGrammar()
      else if (s === 'reading')     renderReadingList()
      else if (s === 'idioms')      renderIdiomsSetup()
      else if (s === 'vocab')       startVocab()
      else if (s === 'verbs')       startVerbs()
      else if (s === 'grammarquiz') startGrammarQuiz()
      else if (s === 'sentences')   startSentences()
    }).catch(err => console.error('Level reload failed:', err))
  }

  // ── Persistence (localStorage) ──────────────────────────────────
  const STORAGE_KEY = 'italian_a1_stats'
  function loadStats() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {} } catch { return {} }
  }
  function saveStats(key, correct, total) {
    const s = loadStats()
    if (!s[key]) s[key] = { correct: 0, total: 0, sessions: 0 }
    s[key].correct += correct
    s[key].total += total
    s[key].sessions += 1
    s[key].lastPracticed = new Date().toISOString()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s))
  }
  function getStats() { return loadStats() }

  // ── Navigation ───────────────────────────────────────────────────
  function showSection(name) {
    state.section = name
    // Always restore scroll — modals and overlays set overflow:hidden when open.
    // If the user navigates away (e.g. taps the tab bar while a modal is visible)
    // without dismissing it first, scroll would stay locked forever.
    document.body.style.overflow = ''
    // Dismiss any lingering overlays so they can't ghost behind the new section
    const fcOverlay = el('fc-overlay')
    if (fcOverlay && !fcOverlay.classList.contains('d-none')) {
      fcOverlay.classList.add('d-none')
    }
    const verbModal = el('verb-ref-modal-overlay')
    if (verbModal && !verbModal.classList.contains('d-none')) {
      verbModal.classList.add('d-none')
    }
    document.querySelectorAll('.ita-section').forEach(s => s.classList.add('d-none'))
    el('section-' + name).classList.remove('d-none')
    document.querySelectorAll('.ita-tab').forEach(t => t.classList.remove('active'))
    const tab = document.querySelector(`.ita-tab[data-section="${name}"]`)
    if (tab) tab.classList.add('active')
    if (name === 'dashboard') renderDashboard()
  }

  // ── Dashboard ────────────────────────────────────────────────────
  function renderDashboard() {
    const stats = getStats()
    const vocabStats    = stats.vocab      || { correct: 0, total: 0, sessions: 0 }
    const verbStats     = stats.verbs      || { correct: 0, total: 0, sessions: 0 }
    const grammarStats  = stats.grammarquiz|| { correct: 0, total: 0, sessions: 0 }
    const sentenceStats = stats.sentences  || { correct: 0, total: 0, sessions: 0 }
    const readingStats  = stats.reading    || { correct: 0, total: 0, sessions: 0 }
    const idiomStats    = stats.idioms     || { correct: 0, total: 0, sessions: 0 }
    const vocabPct    = vocabStats.total    ? Math.round(vocabStats.correct    / vocabStats.total    * 100) : 0
    const verbPct     = verbStats.total     ? Math.round(verbStats.correct     / verbStats.total     * 100) : 0
    const grammarPct  = grammarStats.total  ? Math.round(grammarStats.correct  / grammarStats.total  * 100) : 0
    const sentencePct = sentenceStats.total ? Math.round(sentenceStats.correct / sentenceStats.total * 100) : 0
    const readingPct  = readingStats.total  ? Math.round(readingStats.correct  / readingStats.total  * 100) : 0
    const idiomPct    = idiomStats.total    ? Math.round(idiomStats.correct    / idiomStats.total    * 100) : 0

    const card = (title, desc, stats, pct, btnLabel, onclick) => `
      <div class="col-md-6">
        <div class="content-card h-100">
          <div class="card-body d-flex flex-column">
            <h4 class="card-title">${title}</h4>
            <p class="text-muted">${desc}</p>
            <p class="text-muted">${stats.sessions} session${stats.sessions !== 1 ? 's' : ''} completed</p>
            <div class="ita-progress-bar mb-2"><div class="ita-progress-fill" style="width:${pct}%"></div></div>
            <p class="mb-0"><strong>${stats.correct}</strong> / ${stats.total} correct (${pct}%)</p>
            <button class="btn btn-primary mt-auto" onclick="${onclick}">${btnLabel}</button>
          </div>
        </div>
      </div>`

    el('dash-content').innerHTML = `
      <div class="row g-3">
        ${card('Vocabulary', 'Topic-based word practice.', vocabStats, vocabPct, 'Practice Vocabulary', 'ItalianApp.startVocab()')}
        ${card('Verb Conjugation', 'Presente, passato prossimo &amp; imperfetto.', verbStats, verbPct, 'Practice Verbs', 'ItalianApp.startVerbs()')}
        ${card('Grammar Quiz', 'Articles, gender, prepositions &amp; more.', grammarStats, grammarPct, 'Practice Grammar', 'ItalianApp.startGrammarQuiz()')}
        ${card('Sentence Builder', 'Arrange words into correct Italian sentences.', sentenceStats, sentencePct, 'Build Sentences', 'ItalianApp.startSentences()')}
        ${card('Reading (A2/B1)', 'Passages with vocab glossary &amp; comprehension quiz.', readingStats, readingPct, 'Read &amp; Practise', 'ItalianApp.startReading()')}
        ${card('Idioms (A2/B1)', 'Idiomatic expressions with flip cards &amp; quiz.', idiomStats, idiomPct, 'Explore Idioms', 'ItalianApp.startIdioms()')}
      </div>
      <div class="mt-3 text-center">
        <button class="btn btn-outline-secondary btn-sm" onclick="ItalianApp.resetStats()">Reset all progress</button>
      </div>`
  }

  // ── Vocab Quiz ───────────────────────────────────────────────────
  function startVocab() {
    showSection('vocab')
    renderVocabSetup()
  }

  function renderVocabSetup() {
    const categories = Object.keys(appData.vocab)
    const totalItems = Object.values(appData.vocab).flat().length
    if (totalItems === 0) {
      return emptyState('vocab-area', 'Vocabulary')
    }
    el('vocab-area').innerHTML = `
      <div class="ita-setup-panel">
        <h3>Choose a Category</h3>
        <div class="row g-2 mb-3">
          ${categories.map(cat => `
            <div class="col-6 col-md-4">
              <button class="btn btn-outline-light w-100 ita-cat-btn" data-cat="${cat}">
                ${cat} <span class="badge bg-secondary">${appData.vocab[cat].length}</span>
              </button>
            </div>
          `).join('')}
          <div class="col-6 col-md-4">
            <button class="btn btn-outline-light w-100 ita-cat-btn" data-cat="all">
              All Words <span class="badge bg-secondary">${Object.values(appData.vocab).flat().length}</span>
            </button>
          </div>
        </div>
        <div class="d-flex gap-3 flex-wrap align-items-center mb-3">
          <div>
            <label class="form-label mb-1">Mode</label><br>
            <div class="btn-group btn-group-sm" role="group">
              <input type="radio" class="btn-check" name="vmode" id="vmode-mc" value="mc" checked>
              <label class="btn btn-outline-light" for="vmode-mc">Multiple Choice</label>
              <input type="radio" class="btn-check" name="vmode" id="vmode-type" value="type">
              <label class="btn btn-outline-light" for="vmode-type">Type Answer</label>
              <input type="radio" class="btn-check" name="vmode" id="vmode-flip" value="flip">
              <label class="btn btn-outline-light" for="vmode-flip">Flash Cards</label>
            </div>
          </div>
          <div>
            <label class="form-label mb-1">Direction</label><br>
            <div class="btn-group btn-group-sm" role="group">
              <input type="radio" class="btn-check" name="vdir" id="vdir-it" value="it-en" checked>
              <label class="btn btn-outline-light" for="vdir-it">IT → EN</label>
              <input type="radio" class="btn-check" name="vdir" id="vdir-en" value="en-it">
              <label class="btn btn-outline-light" for="vdir-en">EN → IT</label>
            </div>
          </div>
        </div>
      </div>`

    el('vocab-area').querySelectorAll('.ita-cat-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const cat = btn.dataset.cat
        state.vocabMode = document.querySelector('input[name="vmode"]:checked').value
        state.vocabDirection = document.querySelector('input[name="vdir"]:checked').value
        state.vocabCategory = cat
        state.vocabQueue = shuffle(cat === 'all'
          ? Object.entries(appData.vocab).flatMap(([c, words]) => words.map(w => ({ ...w, _cat: c })))
          : appData.vocab[cat].map(w => ({ ...w, _cat: cat })))
        state.vocabIndex = 0
        state.vocabCorrect = 0
        state.vocabTotal = 0
        if (state.vocabMode === 'flip') {
          renderVocabFlashCards(state.vocabQueue)
        } else {
          renderVocabQuestion()
        }
      })
    })
  }

  function renderVocabQuestion() {
    if (state.vocabIndex >= state.vocabQueue.length) {
      return renderVocabResults()
    }
    const item = state.vocabQueue[state.vocabIndex]
    const isItEn = state.vocabDirection === 'it-en'
    const prompt = isItEn ? item.it : item.en
    const answer = isItEn ? item.en : item.it
    const progress = `${state.vocabIndex + 1} / ${state.vocabQueue.length}`

    if (state.vocabMode === 'mc') {
      // build 3 wrong options from same category or all
      const pool = (state.vocabCategory === 'all'
        ? Object.values(appData.vocab).flat()
        : appData.vocab[state.vocabCategory])
        .filter(w => (isItEn ? w.en : w.it) !== answer)
      const wrongs = pick(pool, 3).map(w => isItEn ? w.en : w.it)
      const options = shuffle([answer, ...wrongs])

      el('vocab-area').innerHTML = `
        <div class="ita-quiz-header">
          <span class="text-muted">${progress}</span>
          <div class="ita-progress-bar"><div class="ita-progress-fill" style="width:${(state.vocabIndex / state.vocabQueue.length) * 100}%"></div></div>
          <span class="text-muted">${state.vocabCorrect} correct</span>
        </div>
        <div class="ita-quiz-prompt">
          <span class="ita-lang-label">${isItEn ? 'Italian' : 'English'}</span>
          <h2 class="mb-0">${prompt}</h2>
        </div>
        <div class="row g-2 mt-3" id="mc-options">
          ${options.map((opt, i) => `
            <div class="col-6">
              <button class="btn btn-outline-light w-100 ita-option-btn" data-answer="${opt.replace(/"/g, '&quot;')}">${opt}</button>
            </div>
          `).join('')}
        </div>
        <div id="vocab-feedback" class="mt-3"></div>`

      el('mc-options').querySelectorAll('.ita-option-btn').forEach(btn => {
        btn.addEventListener('click', () => handleVocabMC(btn, answer))
      })
    } else {
      el('vocab-area').innerHTML = `
        <div class="ita-quiz-header">
          <span class="text-muted">${progress}</span>
          <div class="ita-progress-bar"><div class="ita-progress-fill" style="width:${(state.vocabIndex / state.vocabQueue.length) * 100}%"></div></div>
          <span class="text-muted">${state.vocabCorrect} correct</span>
        </div>
        <div class="ita-quiz-prompt">
          <span class="ita-lang-label">${isItEn ? 'Italian' : 'English'}</span>
          <h2 class="mb-0">${prompt}</h2>
        </div>
        <form id="type-form" class="mt-3" autocomplete="off">
          <div class="input-group">
            <input type="text" id="type-input" class="form-control form-control-lg" placeholder="Type the ${isItEn ? 'English' : 'Italian'}…" autofocus>
            <button type="submit" class="btn btn-primary">Check</button>
          </div>
        </form>
        <div id="vocab-feedback" class="mt-3"></div>`

      el('type-input').focus()
      el('type-form').addEventListener('submit', e => {
        e.preventDefault()
        handleVocabType(answer)
      })
    }
  }

  function handleVocabMC(btn, answer) {
    // prevent double-click
    if (btn.closest('#mc-options').dataset.answered) return
    btn.closest('#mc-options').dataset.answered = '1'
    state.vocabTotal++
    const chosen = btn.dataset.answer
    const correct = normalize(chosen) === normalize(answer)
    if (correct) state.vocabCorrect++

    // highlight
    btn.closest('#mc-options').querySelectorAll('.ita-option-btn').forEach(b => {
      b.disabled = true
      if (normalize(b.dataset.answer) === normalize(answer)) b.classList.add('ita-correct')
      else if (b === btn && !correct) b.classList.add('ita-wrong')
    })

    el('vocab-feedback').innerHTML = correct
      ? '<div class="ita-feedback-correct">Correct!</div>'
      : `<div class="ita-feedback-wrong">The answer is: <strong>${answer}</strong></div>`

    setTimeout(() => { state.vocabIndex++; renderVocabQuestion() }, correct ? 1000 : 2000)
  }

  function handleVocabType(answer) {
    const input = el('type-input')
    if (input.dataset.answered) return
    input.dataset.answered = '1'
    state.vocabTotal++
    const typed = normalize(input.value)
    // accept any of the slash-separated answers
    const acceptables = answer.split('/').map(s => normalize(s))
    const correct = acceptables.some(a => typed === a)
    if (correct) state.vocabCorrect++

    input.disabled = true
    input.classList.add(correct ? 'ita-input-correct' : 'ita-input-wrong')
    el('vocab-feedback').innerHTML = correct
      ? '<div class="ita-feedback-correct">Correct!</div>'
      : `<div class="ita-feedback-wrong">The answer is: <strong>${answer}</strong></div>`

    setTimeout(() => { state.vocabIndex++; renderVocabQuestion() }, correct ? 1200 : 2500)
  }

  // ── Vocab image URL helpers ─────────────────────────────────────
  function ita_slug(str) {
    return str
      .toLowerCase()
      .replace(/^(the|a|an)\s+/i, '')
      .replace(/\(.*?\)/g, ' ')
      .replace(/[\/\.…]+/g, ' ')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  function cat_slug(str) {
    return str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  function vocabImgUrl(enWord, catName) {
    const base = (window.VOCAB_CDN_BASE || '').replace(/\/$/, '')
    return `${base}/public/img/vocab/${cat_slug(catName || 'vocab')}/${ita_slug(enWord)}.png`
  }

  // ── Wikipedia image cache ─────────────────────────────────────
  const wikiImgCache = new Map()

  async function fetchWikiImage(enTerm) {
    if (wikiImgCache.has(enTerm)) return wikiImgCache.get(enTerm)
    try {
      const search = enTerm
        .split('/')[0]
        .replace(/^(the|a|an)\s+/i, '')
        .replace(/\(.*?\)/g, '')
        .replace(/\.{2,}$/, '')
        .trim()
      if (!search) { wikiImgCache.set(enTerm, null); return null }
      const resp = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(search)}`
      )
      if (!resp.ok) { wikiImgCache.set(enTerm, null); return null }
      const data = await resp.json()
      const src = data.thumbnail?.source ?? null
      wikiImgCache.set(enTerm, src)
      return src
    } catch {
      wikiImgCache.set(enTerm, null)
      return null
    }
  }

  const FC_PAGE_SIZE = 8

  function renderVocabFlashCards(words, page) {
    if (page === undefined) page = 0
    const totalPages = Math.ceil(words.length / FC_PAGE_SIZE)
    const pageWords = words.slice(page * FC_PAGE_SIZE, (page + 1) * FC_PAGE_SIZE)
    const isFirst = page === 0
    const isLast = page >= totalPages - 1

    el('vocab-area').innerHTML = `
      <div class="d-flex justify-content-between align-items-center mb-3">
        <p class="text-muted mb-0">Click a card to enlarge and flip it.</p>
        <span class="text-muted small">Page ${page + 1} of ${totalPages}</span>
      </div>
      <div class="ita-flashcard-grid">
        ${pageWords.map((item, i) => `
          <div class="ita-flip-card" data-idx="${i}">
            <div class="ita-flip-inner">
              <div class="ita-flip-front">
                <div class="ita-flip-media">
                  <div class="ita-flip-skeleton"></div>
                  <img class="ita-flip-img" alt="${item.en}">
                </div>
                <div class="ita-flip-word">${item.it}</div>
              </div>
              <div class="ita-flip-back">
                <div class="ita-flip-en">${item.en}</div>
              </div>
            </div>
          </div>`).join('')}
      </div>
      <div class="ita-card-overlay d-none" id="fc-overlay">
        <div class="ita-card-overlay-backdrop"></div>
        <div class="ita-flip-card-overlay-wrap" id="fc-enlarged"></div>
      </div>
      <div class="d-flex justify-content-between align-items-center mt-4">
        <button class="btn btn-outline-light" onclick="ItalianApp.startVocab()">← Back to Setup</button>
        <div class="d-flex align-items-center gap-3">
          <button class="btn btn-outline-light" id="fc-prev" ${isFirst ? 'disabled' : ''}>← Prev</button>
          <span class="text-muted small">${page + 1} / ${totalPages}</span>
          <button class="btn btn-outline-light" id="fc-next" ${isLast ? 'disabled' : ''}>Next →</button>
        </div>
      </div>`

    const prevBtn = document.getElementById('fc-prev')
    const nextBtn = document.getElementById('fc-next')
    if (prevBtn) prevBtn.addEventListener('click', () => renderVocabFlashCards(words, page - 1))
    if (nextBtn) nextBtn.addEventListener('click', () => renderVocabFlashCards(words, page + 1))

    const cards = el('vocab-area').querySelectorAll('.ita-flip-card')
    cards.forEach(card => {
      card.addEventListener('click', () => openFlipCardFocus(card))
    })

    // Load static vocab images; fall back to Wikipedia if not yet generated
    pageWords.forEach((item, i) => {
      const card = cards[i]
      if (!card) return
      const skeleton = card.querySelector('.ita-flip-skeleton')
      const img = card.querySelector('.ita-flip-img')

      img.onload = () => {
        img.classList.add('loaded')
        if (skeleton) skeleton.style.display = 'none'
      }
      img.onerror = () => {
        img.onerror = null
        fetchWikiImage(item.en).then(src => {
          if (src) {
            img.src = src
          } else {
            if (skeleton) skeleton.classList.add('ita-flip-skeleton-none')
          }
        })
      }
      img.src = vocabImgUrl(item.en, item._cat)
    })
  }

  function openFlipCardFocus(card) {
    const overlay = document.getElementById('fc-overlay')
    const enlarged = document.getElementById('fc-enlarged')
    if (!overlay || !enlarged) return

    const rect = card.getBoundingClientRect()
    const ENLARGED_W = Math.min(380, window.innerWidth - 32)
    const ENLARGED_H = 520
    const targetLeft = (window.innerWidth  - ENLARGED_W) / 2
    const targetTop  = Math.max(16, (window.innerHeight - ENLARGED_H) / 2)

    // Show overlay backdrop, fading in while card flies
    overlay.classList.remove('d-none')
    const backdrop = overlay.querySelector('.ita-card-overlay-backdrop')
    backdrop.style.opacity = '0'
    backdrop.style.transition = 'opacity 0.35s ease'
    // Keep enlarged slot invisible until fly finishes
    enlarged.style.visibility = 'hidden'
    enlarged.innerHTML = ''
    requestAnimationFrame(() => { backdrop.style.opacity = '1' })
    document.body.style.overflow = 'hidden'

    // Build a fixed-position flying clone starting at the card's grid position
    const flyClone = card.cloneNode(true)
    flyClone.classList.remove('is-flipped')
    Object.assign(flyClone.style, {
      position:     'fixed',
      left:         rect.left   + 'px',
      top:          rect.top    + 'px',
      width:        rect.width  + 'px',
      height:       rect.height + 'px',
      margin:       '0',
      zIndex:       '1060',
      pointerEvents:'none',
      borderRadius: '12px',
      overflow:     'hidden',
      boxShadow:    '0 4px 16px rgba(0,0,0,0.3)',
      transition:   [
        'left   0.4s cubic-bezier(0.4,0,0.2,1)',
        'top    0.4s cubic-bezier(0.4,0,0.2,1)',
        'width  0.4s cubic-bezier(0.4,0,0.2,1)',
        'height 0.4s cubic-bezier(0.4,0,0.2,1)',
        'box-shadow 0.4s ease'
      ].join(',')
    })

    // Transfer already-loaded image so the fly clone looks right
    const origImg = card.querySelector('.ita-flip-img')
    const flyImg  = flyClone.querySelector('.ita-flip-img')
    const flySkel = flyClone.querySelector('.ita-flip-skeleton')
    if (origImg && flyImg && origImg.src) {
      flyImg.src = origImg.src
      if (origImg.classList.contains('loaded')) {
        flyImg.classList.add('loaded')
        if (flySkel) flySkel.style.display = 'none'
      }
    }

    document.body.appendChild(flyClone)
    flyClone.getBoundingClientRect() // force reflow before animating

    requestAnimationFrame(() => {
      flyClone.style.left      = targetLeft + 'px'
      flyClone.style.top       = targetTop  + 'px'
      flyClone.style.width     = ENLARGED_W + 'px'
      flyClone.style.height    = ENLARGED_H + 'px'
      flyClone.style.boxShadow = '0 20px 64px rgba(0,0,0,0.7)'
    })

    // After flight lands: swap in the real enlarged card
    setTimeout(() => {
      flyClone.remove()

      const clone = card.cloneNode(true)
      clone.classList.remove('is-flipped')
      const oImg = card.querySelector('.ita-flip-img')
      const cImg = clone.querySelector('.ita-flip-img')
      const cSkel = clone.querySelector('.ita-flip-skeleton')
      if (oImg && cImg && oImg.src) {
        cImg.src = oImg.src
        if (oImg.classList.contains('loaded')) {
          cImg.classList.add('loaded')
          if (cSkel) cSkel.style.display = 'none'
        }
      }

      enlarged.innerHTML = ''
      enlarged.appendChild(clone)
      enlarged.style.visibility = ''

      clone.addEventListener('click', e => {
        e.stopPropagation()
        clone.classList.toggle('is-flipped')
      })
    }, 420)

    const close = () => {
      flyClone.remove() // safety: remove if user closes mid-flight
      backdrop.style.opacity = ''
      backdrop.style.transition = ''
      enlarged.style.visibility = ''
      overlay.classList.add('d-none')
      document.body.style.overflow = ''
      document.removeEventListener('keydown', escHandler)
    }
    backdrop.onclick = close
    const escHandler = e => { if (e.key === 'Escape') close() }
    document.addEventListener('keydown', escHandler)
  }

  function renderVocabResults() {
    const pct = state.vocabTotal ? Math.round(state.vocabCorrect / state.vocabTotal * 100) : 0
    saveStats('vocab', state.vocabCorrect, state.vocabTotal)

    let message = ''
    if (pct === 100) message = 'Perfetto! Flawless round!'
    else if (pct >= 80) message = 'Ottimo! Great work!'
    else if (pct >= 60) message = 'Bene! Keep practicing!'
    else message = 'Coraggio! Review and try again.'

    el('vocab-area').innerHTML = `
      <div class="text-center ita-results">
        <h2>${message}</h2>
        <div class="ita-score-ring">
          <svg viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="52" stroke="var(--border)" stroke-width="8" fill="none"/>
            <circle cx="60" cy="60" r="52" stroke="var(--brand)" stroke-width="8" fill="none"
              stroke-dasharray="${Math.round(2 * Math.PI * 52)}"
              stroke-dashoffset="${Math.round(2 * Math.PI * 52 * (1 - pct / 100))}"
              stroke-linecap="round" transform="rotate(-90 60 60)"/>
          </svg>
          <span class="ita-score-text">${pct}%</span>
        </div>
        <p class="mt-2">${state.vocabCorrect} of ${state.vocabTotal} correct</p>
        <div class="d-flex gap-2 justify-content-center mt-3">
          <button class="btn btn-primary" onclick="ItalianApp.startVocab()">New Round</button>
          <button class="btn btn-outline-light" onclick="ItalianApp.showSection('dashboard')">Dashboard</button>
        </div>
      </div>`
  }

  // ── Verb Conjugation Drill ───────────────────────────────────────
  function startVerbs() {
    showSection('verbs')
    renderVerbSetup()
  }

  function renderVerbSetup() {
    el('verb-area').innerHTML = `
      <div class="ita-setup-panel">
        <h3>Verb Conjugation Drill</h3>
        <p class="text-muted">Choose a tense, verb group, and quiz mode.</p>
        <div class="d-flex gap-3 flex-wrap align-items-center mb-3">
          <div>
            <label class="form-label mb-1">Tense</label><br>
            <div class="btn-group btn-group-sm" role="group">
              <input type="radio" class="btn-check" name="vtense" id="vt-pres" value="presenteIndicativo" checked>
              <label class="btn btn-outline-light" for="vt-pres">Presente</label>
              <input type="radio" class="btn-check" name="vtense" id="vt-pp" value="passatoProssimo">
              <label class="btn btn-outline-light" for="vt-pp">Passato Prossimo</label>
              <input type="radio" class="btn-check" name="vtense" id="vt-imp" value="imperfetto">
              <label class="btn btn-outline-light" for="vt-imp">Imperfetto</label>
            </div>
          </div>
          <div>
            <label class="form-label mb-1">Verb Group</label><br>
            <div class="btn-group btn-group-sm" role="group">
              <input type="radio" class="btn-check" name="vfilter" id="vf-all" value="all" checked>
              <label class="btn btn-outline-light" for="vf-all">All</label>
              <input type="radio" class="btn-check" name="vfilter" id="vf-are" value="-are">
              <label class="btn btn-outline-light" for="vf-are">-are</label>
              <input type="radio" class="btn-check" name="vfilter" id="vf-ere" value="-ere">
              <label class="btn btn-outline-light" for="vf-ere">-ere</label>
              <input type="radio" class="btn-check" name="vfilter" id="vf-ire" value="-ire">
              <label class="btn btn-outline-light" for="vf-ire">-ire</label>
              <input type="radio" class="btn-check" name="vfilter" id="vf-ref" value="reflexive">
              <label class="btn btn-outline-light" for="vf-ref">Reflexive</label>
              <input type="radio" class="btn-check" name="vfilter" id="vf-irr" value="irregular">
              <label class="btn btn-outline-light" for="vf-irr">Irregular</label>
            </div>
          </div>
          <div>
            <label class="form-label mb-1">Mode</label><br>
            <div class="btn-group btn-group-sm" role="group">
              <input type="radio" class="btn-check" name="verbmode" id="vm-type" value="type" checked>
              <label class="btn btn-outline-light" for="vm-type">Type Answer</label>
              <input type="radio" class="btn-check" name="verbmode" id="vm-mc" value="mc">
              <label class="btn btn-outline-light" for="vm-mc">Multiple Choice</label>
            </div>
          </div>
        </div>
        <button class="btn btn-primary btn-lg" id="start-verb-drill">Start Drill</button>
      </div>`

    el('start-verb-drill').addEventListener('click', () => {
      state.verbFilter = document.querySelector('input[name="vfilter"]:checked').value
      state.verbMode   = document.querySelector('input[name="verbmode"]:checked').value
      state.verbTense  = document.querySelector('input[name="vtense"]:checked').value
      if (!appData.verbs || appData.verbs.length === 0) {
        return emptyState('verb-area', 'Verb Drill')
      }
      let verbs = appData.verbs
      if (state.verbFilter !== 'all') {
        verbs = appData.verbs.filter(v => {
          if (state.verbFilter === 'irregular') return v.group === 'irregular'
          if (state.verbFilter === 'reflexive') return v.group === 'reflexive'
          return v.group.startsWith(state.verbFilter)
        })
      }
      // build question queue
      const tenseKey = state.verbTense
      const questions = []
      verbs.forEach(v => {
        // get conjugation table for the selected tense
        const conjTable = (tenseKey === 'presenteIndicativo')
          ? (v.tenses && v.tenses.presenteIndicativo && v.tenses.presenteIndicativo.io
              ? v.tenses.presenteIndicativo : v.conjugation)   // fallback for A1 verbs without tenses yet
          : (v.tenses && v.tenses[tenseKey] && v.tenses[tenseKey].io
              ? v.tenses[tenseKey] : null)
        if (!conjTable) return  // skip verbs without data for this tense
        const pronoun = PRONOUNS[Math.floor(Math.random() * PRONOUNS.length)]
        const answer = conjTable[pronoun]
        if (!answer) return
        questions.push({ verb: v, pronoun, answer, tenseKey })
      })
      state.verbQueue = shuffle(questions).slice(0, Math.min(15, questions.length))
      state.verbIndex = 0
      state.verbCorrect = 0
      state.verbTotal = 0
      renderVerbQuestion()
    })
  }

  function renderVerbQuestion() {
    if (state.verbIndex >= state.verbQueue.length) return renderVerbResults()

    const q = state.verbQueue[state.verbIndex]
    const progress = `${state.verbIndex + 1} / ${state.verbQueue.length}`
    const tenseLabel = { presenteIndicativo: 'Presente', passatoProssimo: 'Passato Prossimo', imperfetto: 'Imperfetto' }[q.tenseKey] || 'Presente'

    if (state.verbMode === 'type') {
      el('verb-area').innerHTML = `
        <div class="ita-quiz-header">
          <span class="text-muted">${progress}</span>
          <div class="ita-progress-bar"><div class="ita-progress-fill" style="width:${(state.verbIndex / state.verbQueue.length) * 100}%"></div></div>
          <span class="text-muted">${state.verbCorrect} correct</span>
        </div>
        <div class="ita-quiz-prompt">
          <span class="ita-lang-label">${q.verb.group} &middot; ${tenseLabel}</span>
          <h2 class="mb-1"><span class="ita-pronoun">${q.pronoun}</span> ______</h2>
          <p class="text-muted mb-0">${q.verb.infinitive} &mdash; <em>${q.verb.translation}</em></p>
        </div>
        <form id="verb-form" class="mt-3" autocomplete="off">
          <div class="input-group">
            <input type="text" id="verb-input" class="form-control form-control-lg" placeholder="Conjugated form…" autofocus>
            <button type="submit" class="btn btn-primary">Check</button>
          </div>
        </form>
        <div id="verb-feedback" class="mt-3"></div>`

      el('verb-input').focus()
      el('verb-form').addEventListener('submit', e => {
        e.preventDefault()
        handleVerbType(q)
      })
    } else {
      // MC mode — 3 wrong conjugations from same verb or other verbs
      const conjTable = q.tenseKey === 'presenteIndicativo'
        ? (q.verb.tenses && q.verb.tenses.presenteIndicativo && q.verb.tenses.presenteIndicativo.io
            ? q.verb.tenses.presenteIndicativo : q.verb.conjugation)
        : (q.verb.tenses && q.verb.tenses[q.tenseKey] ? q.verb.tenses[q.tenseKey] : q.verb.conjugation)
      const wrongs = []
      const otherFromSame = Object.entries(conjTable)
        .filter(([p, c]) => p !== q.pronoun && c !== q.answer)
        .map(([, c]) => c)
      wrongs.push(...pick(otherFromSame, 2))
      const otherVerbs = appData.verbs.filter(v => v.infinitive !== q.verb.infinitive)
      const fromOthers = pick(otherVerbs, 3).map(v => {
        const t = v.tenses && v.tenses[q.tenseKey] && v.tenses[q.tenseKey].io ? v.tenses[q.tenseKey] : v.conjugation
        return t ? t[q.pronoun] : null
      }).filter(c => c && c !== q.answer)
      wrongs.push(...fromOthers)
      const uniqueWrongs = [...new Set(wrongs)].filter(w => w !== q.answer).slice(0, 3)
      const options = shuffle([q.answer, ...uniqueWrongs])

      el('verb-area').innerHTML = `
        <div class="ita-quiz-header">
          <span class="text-muted">${progress}</span>
          <div class="ita-progress-bar"><div class="ita-progress-fill" style="width:${(state.verbIndex / state.verbQueue.length) * 100}%"></div></div>
          <span class="text-muted">${state.verbCorrect} correct</span>
        </div>
        <div class="ita-quiz-prompt">
          <span class="ita-lang-label">${q.verb.group} &middot; ${tenseLabel}</span>
          <h2 class="mb-1"><span class="ita-pronoun">${q.pronoun}</span> ______</h2>
          <p class="text-muted mb-0">${q.verb.infinitive} &mdash; <em>${q.verb.translation}</em></p>
        </div>
        <div class="row g-2 mt-3" id="verb-mc-options">
          ${options.map(opt => `
            <div class="col-6">
              <button class="btn btn-outline-light w-100 ita-option-btn" data-answer="${opt}">${opt}</button>
            </div>
          `).join('')}
        </div>
        <div id="verb-feedback" class="mt-3"></div>`

      el('verb-mc-options').querySelectorAll('.ita-option-btn').forEach(btn => {
        btn.addEventListener('click', () => handleVerbMC(btn, q))
      })
    }
  }

  function handleVerbType(q) {
    const input = el('verb-input')
    if (input.dataset.answered) return
    input.dataset.answered = '1'
    state.verbTotal++
    const typed = normalize(input.value)
    const correct = typed === normalize(q.answer)
    if (correct) state.verbCorrect++

    input.disabled = true
    input.classList.add(correct ? 'ita-input-correct' : 'ita-input-wrong')
    el('verb-feedback').innerHTML = correct
      ? `<div class="ita-feedback-correct">Esatto! <span class="text-muted ms-2"><em>${q.verb.example.it}</em></span></div>`
      : `<div class="ita-feedback-wrong">The answer is: <strong>${q.answer}</strong><br><span class="text-muted"><em>${q.verb.example.it}</em> — ${q.verb.example.en}</span></div>`

    setTimeout(() => { state.verbIndex++; renderVerbQuestion() }, correct ? 1200 : 2800)
  }

  function handleVerbMC(btn, q) {
    if (btn.closest('#verb-mc-options').dataset.answered) return
    btn.closest('#verb-mc-options').dataset.answered = '1'
    state.verbTotal++
    const chosen = btn.dataset.answer
    const correct = normalize(chosen) === normalize(q.answer)
    if (correct) state.verbCorrect++

    btn.closest('#verb-mc-options').querySelectorAll('.ita-option-btn').forEach(b => {
      b.disabled = true
      if (normalize(b.dataset.answer) === normalize(q.answer)) b.classList.add('ita-correct')
      else if (b === btn && !correct) b.classList.add('ita-wrong')
    })

    el('verb-feedback').innerHTML = correct
      ? `<div class="ita-feedback-correct">Esatto! <span class="text-muted ms-2"><em>${q.verb.example.it}</em></span></div>`
      : `<div class="ita-feedback-wrong">The answer is: <strong>${q.answer}</strong><br><span class="text-muted"><em>${q.verb.example.it}</em> — ${q.verb.example.en}</span></div>`

    setTimeout(() => { state.verbIndex++; renderVerbQuestion() }, correct ? 1000 : 2500)
  }

  function renderVerbResults() {
    const pct = state.verbTotal ? Math.round(state.verbCorrect / state.verbTotal * 100) : 0
    saveStats('verbs', state.verbCorrect, state.verbTotal)

    let message = ''
    if (pct === 100) message = 'Perfetto! Every conjugation nailed!'
    else if (pct >= 80) message = 'Ottimo lavoro! Almost perfect!'
    else if (pct >= 60) message = 'Bene! The irregular verbs will come with practice.'
    else message = 'Non mollare! Review the conjugation tables and try again.'

    el('verb-area').innerHTML = `
      <div class="text-center ita-results">
        <h2>${message}</h2>
        <div class="ita-score-ring">
          <svg viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="52" stroke="var(--border)" stroke-width="8" fill="none"/>
            <circle cx="60" cy="60" r="52" stroke="var(--brand)" stroke-width="8" fill="none"
              stroke-dasharray="${Math.round(2 * Math.PI * 52)}"
              stroke-dashoffset="${Math.round(2 * Math.PI * 52 * (1 - pct / 100))}"
              stroke-linecap="round" transform="rotate(-90 60 60)"/>
          </svg>
          <span class="ita-score-text">${pct}%</span>
        </div>
        <p class="mt-2">${state.verbCorrect} of ${state.verbTotal} correct</p>
        <div class="d-flex gap-2 justify-content-center mt-3">
          <button class="btn btn-primary" onclick="ItalianApp.startVerbs()">New Drill</button>
          <button class="btn btn-outline-light" onclick="ItalianApp.showSection('dashboard')">Dashboard</button>
        </div>
      </div>`
  }

  // ── Grammar Quiz ─────────────────────────────────────────────────
  function startGrammarQuiz() {
    showSection('grammarquiz')
    if (!appData.grammarQuiz || appData.grammarQuiz.length === 0) {
      return emptyState('grammarquiz-area', 'Grammar Quiz')
    }
    renderGrammarQuizSetup()
  }

  function renderGrammarQuizSetup() {
    const topics = [...new Set(appData.grammarQuiz.map(q => q.topic))]
    el('grammarquiz-area').innerHTML = `
      <div class="ita-setup-panel">
        <h3>Grammar Quiz</h3>
        <p class="text-muted">Choose a topic or practise everything.</p>
        <div class="row g-2 mb-3">
          <div class="col-6 col-md-4">
            <button class="btn btn-outline-light w-100 ita-cat-btn active" data-topic="all">
              All Topics <span class="badge bg-secondary">${appData.grammarQuiz.length}</span>
            </button>
          </div>
          ${topics.map(t => {
            const count = appData.grammarQuiz.filter(q => q.topic === t).length
            return `<div class="col-6 col-md-4">
              <button class="btn btn-outline-light w-100 ita-cat-btn" data-topic="${t}">
                ${t} <span class="badge bg-secondary">${count}</span>
              </button>
            </div>`
          }).join('')}
        </div>
        <button class="btn btn-primary" id="start-grammar-quiz-btn">Start Quiz</button>
      </div>`
    let selectedTopic = 'all'
    el('grammarquiz-area').querySelectorAll('.ita-cat-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        el('grammarquiz-area').querySelectorAll('.ita-cat-btn').forEach(b => b.classList.remove('active'))
        btn.classList.add('active')
        selectedTopic = btn.dataset.topic
      })
    })
    el('start-grammar-quiz-btn').addEventListener('click', () => {
      const pool = selectedTopic === 'all' ? appData.grammarQuiz : appData.grammarQuiz.filter(q => q.topic === selectedTopic)
      state.grammarQueue = shuffle(pool).slice(0, Math.min(15, pool.length))
      state.grammarIndex = 0
      state.grammarCorrect = 0
      state.grammarTotal = state.grammarQueue.length
      state.grammarFilter = selectedTopic
      renderGrammarQuestion()
    })
  }

  function renderGrammarQuestion() {
    const q = state.grammarQueue[state.grammarIndex]
    if (!q) return renderGrammarResults()
    const num = state.grammarIndex + 1
    const total = state.grammarTotal
    const pct = Math.round((num - 1) / total * 100)
    const opts = shuffle(q.opts)

    el('grammarquiz-area').innerHTML = `
      <div class="ita-quiz-header">
        <span>${num} / ${total}</span>
        <div class="ita-progress-bar"><div class="ita-progress-fill" style="width:${pct}%"></div></div>
        <span class="badge bg-secondary">${q.topic}</span>
      </div>
      <div class="ita-quiz-prompt mb-3">
        <p style="font-size:1.2rem;margin-bottom:0">${q.q}</p>
      </div>
      <div class="d-grid gap-2">
        ${opts.map(o => `<button class="btn btn-outline-light ita-option-btn" data-val="${o.replace(/"/g, '&quot;')}">${o}</button>`).join('')}
      </div>
      <div id="grammar-feedback" class="mt-3"></div>`

    let answered = false
    el('grammarquiz-area').querySelectorAll('.ita-option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (answered) return
        answered = true
        const chosen = btn.dataset.val
        const correct = chosen === q.a
        if (correct) state.grammarCorrect++

        el('grammarquiz-area').querySelectorAll('.ita-option-btn').forEach(b => {
          b.disabled = true
          if (b.dataset.val === q.a) b.classList.add('ita-correct')
          if (b === btn && !correct) b.classList.add('ita-wrong')
        })

        el('grammar-feedback').innerHTML = correct
          ? '<p class="ita-feedback-correct">Correct!</p>'
          : `<p class="ita-feedback-wrong">The answer is: <strong>${q.a}</strong></p>`

        setTimeout(() => { state.grammarIndex++; renderGrammarQuestion() }, 1200)
      })
    })
  }

  function renderGrammarResults() {
    const pct = Math.round(state.grammarCorrect / state.grammarTotal * 100)
    const dash = 2 * Math.PI * 52
    const offset = dash - (dash * pct / 100)
    saveStats('grammarquiz', state.grammarCorrect, state.grammarTotal)

    el('grammarquiz-area').innerHTML = `
      <div class="ita-results text-center">
        <h3>Grammar Quiz Complete!</h3>
        <div class="ita-score-ring">
          <svg viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="52" fill="none" stroke="var(--border)" stroke-width="8"/>
            <circle cx="60" cy="60" r="52" fill="none" stroke="var(--brand)" stroke-width="8"
              stroke-dasharray="${dash}" stroke-dashoffset="${offset}"
              stroke-linecap="round" transform="rotate(-90 60 60)"/>
          </svg>
          <div class="ita-score-text">${pct}%</div>
        </div>
        <p><strong>${state.grammarCorrect}</strong> / ${state.grammarTotal} correct</p>
        <button class="btn btn-primary me-2" onclick="ItalianApp.startGrammarQuiz()">Try Again</button>
        <button class="btn btn-outline-light" onclick="ItalianApp.showSection('dashboard')">Dashboard</button>
      </div>`
  }

  // ── Sentence Builder ─────────────────────────────────────────────
  function startSentences() {
    showSection('sentences')
    if (!appData.sentences || appData.sentences.length === 0) {
      return emptyState('sentence-area', 'Sentence Builder')
    }
    state.sentenceQueue = shuffle(appData.sentences).slice(0, 12)
    state.sentenceIndex = 0
    state.sentenceCorrect = 0
    state.sentenceTotal = state.sentenceQueue.length
    state.sentencePicked = []
    renderSentence()
  }

  function renderSentence() {
    const s = state.sentenceQueue[state.sentenceIndex]
    if (!s) return renderSentenceResults()
    const num = state.sentenceIndex + 1
    const total = state.sentenceTotal
    const pct = Math.round((num - 1) / total * 100)
    state.sentencePicked = []
    const scrambled = shuffle(s.words)

    el('sentence-area').innerHTML = `
      <div class="ita-quiz-header">
        <span>${num} / ${total}</span>
        <div class="ita-progress-bar"><div class="ita-progress-fill" style="width:${pct}%"></div></div>
      </div>
      <div class="ita-quiz-prompt mb-3">
        <div class="ita-lang-label">Translate into Italian</div>
        <p style="font-size:1.2rem;margin-bottom:0">${s.en}</p>
      </div>
      <div class="ita-sentence-answer mb-3" id="sentence-answer"></div>
      <div class="ita-sentence-words" id="sentence-words">
        ${scrambled.map((w, i) => `<button class="btn btn-outline-light ita-word-btn" data-idx="${i}" data-word="${w.replace(/"/g, '&quot;')}">${w}</button>`).join('')}
      </div>
      <div class="mt-3">
        <button class="btn btn-secondary btn-sm me-2" id="sentence-undo-btn" disabled>Undo</button>
        <button class="btn btn-primary" id="sentence-check-btn" disabled>Check</button>
      </div>
      <div id="sentence-feedback" class="mt-3"></div>`

    const answerEl = el('sentence-answer')
    const checkBtn = el('sentence-check-btn')
    const undoBtn = el('sentence-undo-btn')
    let locked = false

    el('sentence-words').querySelectorAll('.ita-word-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (locked) return
        btn.disabled = true
        btn.classList.add('ita-word-used')
        state.sentencePicked.push({ word: btn.dataset.word, btn })
        renderAnswer()
      })
    })

    undoBtn.addEventListener('click', () => {
      if (locked || !state.sentencePicked.length) return
      const last = state.sentencePicked.pop()
      last.btn.disabled = false
      last.btn.classList.remove('ita-word-used')
      renderAnswer()
    })

    function renderAnswer() {
      answerEl.innerHTML = state.sentencePicked.map(p => `<span class="ita-answer-word">${p.word}</span>`).join(' ')
      checkBtn.disabled = state.sentencePicked.length !== s.words.length
      undoBtn.disabled = state.sentencePicked.length === 0
    }

    checkBtn.addEventListener('click', () => {
      if (locked) return
      locked = true
      const userAnswer = state.sentencePicked.map(p => p.word).join(' ')
      const correctAnswer = s.words.join(' ')
      const isCorrect = userAnswer === correctAnswer
      if (isCorrect) state.sentenceCorrect++

      answerEl.classList.add(isCorrect ? 'ita-sentence-correct' : 'ita-sentence-wrong')
      el('sentence-feedback').innerHTML = isCorrect
        ? '<p class="ita-feedback-correct">Perfetto!</p>'
        : `<p class="ita-feedback-wrong">Correct order: <strong>${correctAnswer}</strong></p>`

      setTimeout(() => { state.sentenceIndex++; renderSentence() }, 1800)
    })
  }

  function renderSentenceResults() {
    const pct = state.sentenceTotal > 0 ? Math.round(state.sentenceCorrect / state.sentenceTotal * 100) : 0
    const dash = 2 * Math.PI * 52
    const offset = dash - (dash * pct / 100)
    saveStats('sentences', state.sentenceCorrect, state.sentenceTotal)

    el('sentence-area').innerHTML = `
      <div class="ita-results text-center">
        <h3>Sentence Builder Complete!</h3>
        <div class="ita-score-ring">
          <svg viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="52" fill="none" stroke="var(--border)" stroke-width="8"/>
            <circle cx="60" cy="60" r="52" fill="none" stroke="var(--brand)" stroke-width="8"
              stroke-dasharray="${dash}" stroke-dashoffset="${offset}"
              stroke-linecap="round" transform="rotate(-90 60 60)"/>
          </svg>
          <div class="ita-score-text">${pct}%</div>
        </div>
        <p><strong>${state.sentenceCorrect}</strong> / ${state.sentenceTotal} correct</p>
        <button class="btn btn-primary me-2" onclick="ItalianApp.startSentences()">Try Again</button>
        <button class="btn btn-outline-light" onclick="ItalianApp.showSection('dashboard')">Dashboard</button>
      </div>`
  }

  // ── Reading Comprehension ────────────────────────────────────────
  function readingLevelBadge(level) {
    const map = { 1: ['bg-success', 'A1'], 2: ['bg-info text-dark', 'A2'], 3: ['bg-warning text-dark', 'B1'] }
    const [cls, label] = map[level] || ['bg-secondary', level]
    return `<span class="badge ${cls}">${label}</span>`
  }

  function startReading() {
    showSection('reading')
    renderReadingList()
  }

  function renderReadingList() {
    const passages = appData.reading
    if (!passages.length) {
      el('reading-area').innerHTML = `<div class="alert alert-info mt-4">No reading passages available for the current level. Try selecting "All" or "A2" in the level filter.</div>`
      return
    }
    el('reading-area').innerHTML = `
      <h3 class="mb-3">Reading Comprehension</h3>
      <div class="row g-3">
        ${passages.map(p => `
          <div class="col-md-6">
            <div class="content-card h-100 ita-reading-card" role="button" tabindex="0" data-id="${p._id}">
              <div class="card-body d-flex flex-column">
                <div class="d-flex justify-content-between align-items-start mb-2">
                  <h5 class="card-title mb-0">${p.title}</h5>
                  ${readingLevelBadge(p.level)}
                </div>
                <p class="text-muted small mb-2">${(p.tags || []).join(' · ')}</p>
                <p class="text-muted small">${p.questions ? p.questions.length : 0} comprehension questions</p>
                <button class="btn btn-sm btn-primary mt-auto ita-reading-open" data-id="${p._id}">Read &amp; Practise</button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>`

    el('reading-area').querySelectorAll('.ita-reading-open').forEach(btn => {
      btn.addEventListener('click', () => openPassage(btn.dataset.id))
    })
  }

  function openPassage(id) {
    const passage = appData.reading.find(p => p._id === id)
    if (!passage) return
    state.readingPassage = passage
    state.readingQuizIndex = 0
    state.readingQuizCorrect = 0
    state.readingQuizTotal = passage.questions ? passage.questions.length : 0

    const audioHook = passage.audioUrl
      ? `<button class="btn btn-sm btn-outline-light mb-3" onclick="window.open('${passage.audioUrl}')">&#9654; Listen</button>`
      : ''

    const glossaryHtml = (passage.vocabGlossary || []).length
      ? `<div class="ita-reading-glossary mt-4">
          <h6>Vocab Glossary</h6>
          <div class="row g-2">
            ${passage.vocabGlossary.map(g => `
              <div class="col-6 col-md-4">
                <span class="ita-gloss-item"><strong>${g.italian}</strong> — ${g.english}</span>
              </div>`).join('')}
          </div>
        </div>`
      : ''

    el('reading-area').innerHTML = `
      <div class="d-flex justify-content-between align-items-center mb-3">
        <button class="btn btn-sm btn-outline-light" onclick="ItalianApp.startReading()">← Back</button>
        ${readingLevelBadge(passage.level)}
      </div>
      <h3>${passage.title}</h3>
      ${audioHook}
      <div class="ita-reading-body">${passage.body}</div>
      ${glossaryHtml}
      <div class="mt-4">
        ${passage.questions && passage.questions.length
          ? `<button class="btn btn-primary" id="start-reading-quiz">Start Comprehension Quiz (${passage.questions.length} questions)</button>`
          : ''}
      </div>`

    // Tooltip glossary on marked words
    el('reading-area').querySelectorAll('mark[data-word]').forEach(mark => {
      const word = mark.dataset.word
      const gloss = (passage.vocabGlossary || []).find(g => g.italian === word)
      if (gloss) {
        mark.title = gloss.english
        mark.classList.add('ita-gloss-mark')
      }
    })

    const quizBtn = document.getElementById('start-reading-quiz')
    if (quizBtn) quizBtn.addEventListener('click', renderReadingQuestion)
  }

  function renderReadingQuestion() {
    const passage = state.readingPassage
    if (!passage || state.readingQuizIndex >= passage.questions.length) return renderReadingResults()
    const q = passage.questions[state.readingQuizIndex]
    const progress = `${state.readingQuizIndex + 1} / ${passage.questions.length}`
    const opts = shuffle(q.options.map((o, i) => ({ text: o, idx: i })))

    el('reading-area').innerHTML = `
      <div class="ita-quiz-header">
        <span class="text-muted">${progress}</span>
        <div class="ita-progress-bar"><div class="ita-progress-fill" style="width:${(state.readingQuizIndex / passage.questions.length) * 100}%"></div></div>
        <span class="text-muted">${state.readingQuizCorrect} correct</span>
      </div>
      <div class="ita-quiz-prompt mb-3">
        <span class="ita-lang-label">${passage.title}</span>
        <p style="font-size:1.1rem;margin-bottom:0">${q.text}</p>
      </div>
      <div class="d-grid gap-2">
        ${opts.map(o => `<button class="btn btn-outline-light ita-option-btn" data-idx="${o.idx}">${o.text}</button>`).join('')}
      </div>
      <div id="reading-feedback" class="mt-3"></div>`

    let answered = false
    el('reading-area').querySelectorAll('.ita-option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (answered) return
        answered = true
        const chosen = parseInt(btn.dataset.idx, 10)
        const correct = chosen === q.correctIndex
        if (correct) state.readingQuizCorrect++
        el('reading-area').querySelectorAll('.ita-option-btn').forEach(b => {
          b.disabled = true
          if (parseInt(b.dataset.idx, 10) === q.correctIndex) b.classList.add('ita-correct')
          else if (b === btn && !correct) b.classList.add('ita-wrong')
        })
        el('reading-feedback').innerHTML = correct
          ? '<p class="ita-feedback-correct">Correct!</p>'
          : `<p class="ita-feedback-wrong">The answer is: <strong>${q.options[q.correctIndex]}</strong></p>`
        setTimeout(() => { state.readingQuizIndex++; renderReadingQuestion() }, 1300)
      })
    })
  }

  function renderReadingResults() {
    const total = state.readingQuizTotal
    const correct = state.readingQuizCorrect
    const pct = total ? Math.round(correct / total * 100) : 0
    const dash = 2 * Math.PI * 52
    saveStats('reading', correct, total)
    el('reading-area').innerHTML = `
      <div class="ita-results text-center">
        <h3>Quiz Complete!</h3>
        <div class="ita-score-ring">
          <svg viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="52" fill="none" stroke="var(--border)" stroke-width="8"/>
            <circle cx="60" cy="60" r="52" fill="none" stroke="var(--brand)" stroke-width="8"
              stroke-dasharray="${dash}" stroke-dashoffset="${dash - (dash * pct / 100)}"
              stroke-linecap="round" transform="rotate(-90 60 60)"/>
          </svg>
          <div class="ita-score-text">${pct}%</div>
        </div>
        <p><strong>${correct}</strong> / ${total} correct</p>
        <button class="btn btn-primary me-2" onclick="ItalianApp.startReading()">More Passages</button>
        <button class="btn btn-outline-light" onclick="ItalianApp.showSection('dashboard')">Dashboard</button>
      </div>`
  }

  // ── Idioms ────────────────────────────────────────────────────────
  function startIdioms() {
    showSection('idioms')
    renderIdiomsSetup()
  }

  function renderIdiomsSetup() {
    const idioms = appData.idioms
    if (!idioms.length) {
      el('idioms-area').innerHTML = `<div class="alert alert-info mt-4">No idioms available for the current level. Try selecting "All" or "A2" in the level filter.</div>`
      return
    }
    el('idioms-area').innerHTML = `
      <div class="ita-setup-panel">
        <h3>Italian Idioms</h3>
        <p class="text-muted">${idioms.length} expressions available at the current level.</p>
        <div class="d-flex gap-2 flex-wrap">
          <button class="btn btn-primary btn-lg" id="idioms-study-btn">Study Mode (Flip Cards)</button>
          <button class="btn btn-outline-light btn-lg" id="idioms-quiz-btn">Quiz Mode</button>
        </div>
      </div>`
    el('idioms-study-btn').addEventListener('click', () => {
      state.idiomMode = 'study'
      state.idiomStudyIndex = 0
      renderIdiomStudy()
    })
    el('idioms-quiz-btn').addEventListener('click', () => {
      state.idiomMode = 'quiz'
      state.idiomQuizQueue = shuffle(idioms).slice(0, Math.min(15, idioms.length))
      state.idiomQuizIndex = 0
      state.idiomQuizCorrect = 0
      state.idiomQuizTotal = state.idiomQuizQueue.length
      renderIdiomQuiz()
    })
  }

  function renderIdiomStudy() {
    const idioms = appData.idioms
    if (!idioms.length) return renderIdiomsSetup()
    const i = state.idiomStudyIndex
    const idiom = idioms[i]
    const levelLabel = idiom.difficulty === 3 ? 'B1' : 'A2'
    const levelBadge = `<span class="badge ${idiom.difficulty === 3 ? 'bg-warning text-dark' : 'bg-info text-dark'}">${levelLabel}</span>`
    const audioHook = idiom.audioUrl
      ? `<button class="btn btn-sm btn-outline-light mt-2" onclick="window.open('${idiom.audioUrl}')">&#9654; Listen</button>`
      : ''

    el('idioms-area').innerHTML = `
      <div class="d-flex justify-content-between align-items-center mb-4">
        <button class="btn btn-sm btn-outline-light" onclick="ItalianApp.startIdioms()">← Back</button>
        <span class="text-muted">${i + 1} / ${idioms.length}</span>
        ${levelBadge}
      </div>
      <div class="ita-idiom-card" id="idiom-flip-card">
        <div class="ita-idiom-flip-inner" id="idiom-flip-inner">
          <div class="ita-idiom-front">
            <div class="ita-idiom-text">${idiom.idiom}</div>
            <p class="text-muted mt-3 mb-0 small">Tap to reveal meaning</p>
            ${audioHook}
          </div>
          <div class="ita-idiom-back">
            <div class="ita-idiom-meaning"><strong>${idiom.meaning}</strong></div>
            ${idiom.literalTranslation ? `<p class="text-muted mt-2 mb-1 small"><em>Literal:</em> ${idiom.literalTranslation}</p>` : ''}
            <hr>
            <div class="ita-idiom-example-it"><em>${idiom.example && idiom.example.it ? idiom.example.it : ''}</em></div>
            <div class="ita-idiom-example-en text-muted small mt-1">${idiom.example && idiom.example.en ? idiom.example.en : ''}</div>
          </div>
        </div>
      </div>
      <div class="d-flex justify-content-center gap-3 mt-4">
        <button class="btn btn-outline-light" id="idiom-prev" ${i === 0 ? 'disabled' : ''}>← Prev</button>
        <button class="btn btn-outline-light" id="idiom-next" ${i >= idioms.length - 1 ? 'disabled' : ''}>Next →</button>
      </div>`

    el('idiom-flip-card').addEventListener('click', () => {
      el('idiom-flip-inner').classList.toggle('ita-idiom-flipped')
    })
    const prevBtn = el('idiom-prev')
    const nextBtn = el('idiom-next')
    if (prevBtn) prevBtn.addEventListener('click', () => { state.idiomStudyIndex--; renderIdiomStudy() })
    if (nextBtn) nextBtn.addEventListener('click', () => { state.idiomStudyIndex++; renderIdiomStudy() })
  }

  function renderIdiomQuiz() {
    if (state.idiomQuizIndex >= state.idiomQuizQueue.length) return renderIdiomResults()
    const idiom = state.idiomQuizQueue[state.idiomQuizIndex]
    const progress = `${state.idiomQuizIndex + 1} / ${state.idiomQuizQueue.length}`
    // Quiz: show the Italian idiom, pick the correct English meaning
    const wrongPool = appData.idioms.filter(x => x._id !== idiom._id)
    const wrongs = pick(wrongPool, 3).map(x => x.meaning)
    const options = shuffle([idiom.meaning, ...wrongs])

    el('idioms-area').innerHTML = `
      <div class="ita-quiz-header">
        <span class="text-muted">${progress}</span>
        <div class="ita-progress-bar"><div class="ita-progress-fill" style="width:${(state.idiomQuizIndex / state.idiomQuizQueue.length) * 100}%"></div></div>
        <span class="text-muted">${state.idiomQuizCorrect} correct</span>
      </div>
      <div class="ita-quiz-prompt mb-3">
        <span class="ita-lang-label">What does this idiom mean?</span>
        <h3 class="mb-0">${idiom.idiom}</h3>
        ${idiom.literalTranslation ? `<p class="text-muted small mb-0 mt-1"><em>Literal:</em> ${idiom.literalTranslation}</p>` : ''}
      </div>
      <div class="d-grid gap-2">
        ${options.map(o => `<button class="btn btn-outline-light ita-option-btn" data-val="${o.replace(/"/g, '&quot;')}">${o}</button>`).join('')}
      </div>
      <div id="idiom-feedback" class="mt-3"></div>`

    let answered = false
    el('idioms-area').querySelectorAll('.ita-option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (answered) return
        answered = true
        const chosen = btn.dataset.val
        const correct = chosen === idiom.meaning
        if (correct) state.idiomQuizCorrect++
        el('idioms-area').querySelectorAll('.ita-option-btn').forEach(b => {
          b.disabled = true
          if (b.dataset.val === idiom.meaning) b.classList.add('ita-correct')
          else if (b === btn && !correct) b.classList.add('ita-wrong')
        })
        el('idiom-feedback').innerHTML = correct
          ? `<p class="ita-feedback-correct">Esatto! <em>${idiom.example && idiom.example.it ? idiom.example.it : ''}</em></p>`
          : `<p class="ita-feedback-wrong">It means: <strong>${idiom.meaning}</strong></p>`
        setTimeout(() => { state.idiomQuizIndex++; renderIdiomQuiz() }, 1400)
      })
    })
  }

  function renderIdiomResults() {
    const total   = state.idiomQuizTotal
    const correct = state.idiomQuizCorrect
    const pct     = total ? Math.round(correct / total * 100) : 0
    const dash     = 2 * Math.PI * 52
    saveStats('idioms', correct, total)
    el('idioms-area').innerHTML = `
      <div class="ita-results text-center">
        <h3>Idioms Quiz Complete!</h3>
        <div class="ita-score-ring">
          <svg viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="52" fill="none" stroke="var(--border)" stroke-width="8"/>
            <circle cx="60" cy="60" r="52" fill="none" stroke="var(--brand)" stroke-width="8"
              stroke-dasharray="${dash}" stroke-dashoffset="${dash - (dash * pct / 100)}"
              stroke-linecap="round" transform="rotate(-90 60 60)"/>
          </svg>
          <div class="ita-score-text">${pct}%</div>
        </div>
        <p><strong>${correct}</strong> / ${total} correct</p>
        <button class="btn btn-primary me-2" onclick="ItalianApp.startIdioms()">Try Again</button>
        <button class="btn btn-outline-light" onclick="ItalianApp.showSection('dashboard')">Dashboard</button>
      </div>`
  }

  // ── Grammar Reference ────────────────────────────────────────────
  // ── Verb Reference helpers ───────────────────────────────────────
  const TENSE_LABELS = {
    presenteIndicativo: 'Presente',
    passatoProssimo:    'Passato Prossimo',
    imperfetto:         'Imperfetto'
  }
  const DIFF_BADGE = { 1: ['bg-success',          'A1'],
                       2: ['bg-info text-dark',    'A2'],
                       3: ['bg-warning text-dark', 'B1'] }

  function diffBadge(d) {
    const [cls, label] = DIFF_BADGE[d] || ['bg-secondary', d]
    return `<span class="badge ${cls}">${label}</span>`
  }

  function groupBadge(g) {
    return `<span class="badge bg-secondary">${g}</span>`
  }

  function filteredVerbs() {
    const search = state.verbRefSearch.toLowerCase().trim()
    const group  = state.verbRefGroup
    return appData.verbs.filter(v => {
      if (group !== 'all' && v.group !== group) return false
      if (search && !v.infinitive.includes(search) && !v.translation.toLowerCase().includes(search)) return false
      return true
    })
  }

  function renderVerbRefPage() {
    const all      = filteredVerbs()
    const perPage  = 20
    const totalPg  = Math.max(1, Math.ceil(all.length / perPage))
    if (state.verbRefPage >= totalPg) state.verbRefPage = totalPg - 1
    if (state.verbRefPage < 0)        state.verbRefPage = 0
    const slice   = all.slice(state.verbRefPage * perPage, (state.verbRefPage + 1) * perPage)
    const prevDis = state.verbRefPage === 0 ? 'disabled' : ''
    const nextDis = state.verbRefPage >= totalPg - 1 ? 'disabled' : ''

    // collect unique groups for filter
    const groups = ['all', ...new Set(appData.verbs.map(v => v.group))]

    el('verb-ref-toolbar').innerHTML = `
      <div class="ita-verb-ref-left">
        <input id="verb-ref-search" type="search" class="ita-verb-ref-search form-control form-control-sm"
          placeholder="Search verbs…" value="${state.verbRefSearch}" aria-label="Search verbs">
        <select id="verb-ref-group" class="ita-verb-ref-filter form-select form-select-sm" aria-label="Filter by group">
          ${groups.map(g => `<option value="${g}" ${g === state.verbRefGroup ? 'selected' : ''}>${g === 'all' ? 'All groups' : g}</option>`).join('')}
        </select>
      </div>
      <div class="ita-verb-ref-right">
        <button class="btn btn-sm btn-outline-secondary ${prevDis}" id="verb-ref-prev" ${prevDis}>&#8592; Prev</button>
        <span class="ita-verb-ref-pginfo">Page ${state.verbRefPage + 1} of ${totalPg} <small class="text-muted">(${all.length} verbs)</small></span>
        <button class="btn btn-sm btn-outline-secondary ${nextDis}" id="verb-ref-next" ${nextDis}>Next &#8594;</button>
      </div>`

    el('verb-ref-grid').innerHTML = slice.map((v, i) => {
      const globalIdx = appData.verbs.indexOf(v)
      return `
        <div class="ita-verb-ref-card" data-verb-idx="${globalIdx}" role="button" tabindex="0">
          <div class="ita-vrc-infinitive">${v.infinitive}</div>
          <div class="ita-vrc-translation">${v.translation}</div>
          <div class="ita-vrc-badges">${diffBadge(v.difficulty)} ${groupBadge(v.group)}</div>
        </div>`
    }).join('')

    // toolbar events
    const searchInput = el('verb-ref-search')
    const groupSel    = el('verb-ref-group')
    searchInput.addEventListener('input', () => {
      state.verbRefSearch = searchInput.value
      state.verbRefPage   = 0
      renderVerbRefPage()
    })
    groupSel.addEventListener('change', () => {
      state.verbRefGroup = groupSel.value
      state.verbRefPage  = 0
      renderVerbRefPage()
    })
    el('verb-ref-prev') && el('verb-ref-prev').addEventListener('click', () => {
      if (state.verbRefPage > 0) { state.verbRefPage--; renderVerbRefPage() }
    })
    el('verb-ref-next') && el('verb-ref-next').addEventListener('click', () => {
      if (state.verbRefPage < totalPg - 1) { state.verbRefPage++; renderVerbRefPage() }
    })

    // card click → modal
    el('verb-ref-grid').querySelectorAll('.ita-verb-ref-card').forEach(card => {
      card.addEventListener('click',   () => openVerbRefModal(appData.verbs[+card.dataset.verbIdx]))
      card.addEventListener('keydown', e => { if (e.key === 'Enter') openVerbRefModal(appData.verbs[+card.dataset.verbIdx]) })
    })
  }

  function openVerbRefModal(verb) {
    state.verbRefTense = state.verbRefTense || 'presenteIndicativo'
    const TENSE_KEYS = ['presenteIndicativo', 'passatoProssimo', 'imperfetto']
    const PRONOUNS_LIST = ['io', 'tu', 'lui/lei', 'noi', 'voi', 'loro']

    const renderTenseTable = (tenseKey) => {
      const conj = (verb.tenses || {})[tenseKey] || verb.conjugation || {}
      return `
        <table class="ita-tense-table">
          ${PRONOUNS_LIST.map(p => `<tr><td class="ita-pron">${p}</td><td class="ita-form">${conj[p] || '—'}</td></tr>`).join('')}
        </table>`
    }

    const renderModal = () => {
      el('verb-ref-modal-overlay').innerHTML = `
        <div class="ita-verb-modal" role="dialog" aria-modal="true" aria-label="${verb.infinitive} conjugation">
          <div class="ita-verb-modal-header">
            <div>
              <span class="ita-verb-modal-title">${verb.infinitive}</span>
              ${diffBadge(verb.difficulty)} ${groupBadge(verb.group)}
              <div class="ita-verb-modal-trans">${verb.translation}</div>
            </div>
            <button class="btn-close btn-close-white" id="verb-modal-close" aria-label="Close"></button>
          </div>
          <div class="ita-verb-modal-tabs" role="tablist">
            ${TENSE_KEYS.map(k => `
              <button class="ita-verb-modal-tab ${k === state.verbRefTense ? 'active' : ''}"
                data-tense="${k}" role="tab" aria-selected="${k === state.verbRefTense}">
                ${TENSE_LABELS[k]}
              </button>`).join('')}
          </div>
          <div class="ita-verb-modal-body">
            <div class="ita-tense-section">
              <h6 class="ita-tense-heading">${TENSE_LABELS[state.verbRefTense]}</h6>
              ${state.verbRefTense === 'passatoProssimo' ? `<p class="ita-aux-note">Auxiliary: <strong>${verb.auxiliaryVerb || '—'}</strong> + <em>${verb.pastParticiple || '—'}</em></p>` : ''}
              ${renderTenseTable(state.verbRefTense)}
            </div>
            <div class="ita-verb-modal-examples">
              <h6 class="ita-examples-heading">Examples</h6>
              ${(verb.examples || [verb.example]).filter(Boolean).map(ex =>
                `<div class="ita-ex-pair"><div class="ita-ex-it"><em>${ex.it}</em></div><div class="ita-ex-en">${ex.en}</div></div>`
              ).join('')}
            </div>
          </div>
        </div>`

      el('verb-modal-close').addEventListener('click', closeModal)
      el('verb-ref-modal-overlay').querySelectorAll('.ita-verb-modal-tab').forEach(btn => {
        btn.addEventListener('click', () => {
          state.verbRefTense = btn.dataset.tense
          renderModal()
        })
      })
    }

    const closeModal = () => {
      el('verb-ref-modal-overlay').classList.add('d-none')
      document.body.style.overflow = ''
      document.removeEventListener('keydown', escHandler)
    }
    const escHandler = e => { if (e.key === 'Escape') closeModal() }

    el('verb-ref-modal-overlay').classList.remove('d-none')
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', escHandler)
    el('verb-ref-modal-overlay').onclick = e => { if (e.target === el('verb-ref-modal-overlay')) closeModal() }
    renderModal()
  }

  function renderGrammar() {
    showSection('grammar')
    el('grammar-area').innerHTML = `
      <div class="ita-grammar-list">
        ${appData.grammar.map((g, i) => `
          <div class="content-card mb-3 ita-grammar-card">
            <div class="card-body">
              <h3 class="card-title ita-grammar-toggle" data-idx="${i}" role="button" tabindex="0">
                ${g.title}
                <span class="ita-chevron">&#9662;</span>
              </h3>
              <div class="ita-grammar-body d-none" id="grammar-body-${i}">
                ${g.body}
              </div>
            </div>
          </div>
        `).join('')}
      </div>

      <div class="mt-4">
        <h3 class="mb-1">Verb Reference</h3>
        <p class="text-muted mb-3" style="font-size:0.9rem">Click any verb to see full conjugation across tenses.</p>
        <div class="ita-verb-ref-toolbar" id="verb-ref-toolbar"></div>
        <div class="ita-verb-ref-grid" id="verb-ref-grid"></div>
      </div>

      <!-- Verb conjugation modal -->
      <div class="ita-verb-modal-overlay d-none" id="verb-ref-modal-overlay"></div>`

    // accordion toggles
    el('grammar-area').querySelectorAll('.ita-grammar-toggle').forEach(toggle => {
      toggle.addEventListener('click', () => {
        const body = el('grammar-body-' + toggle.dataset.idx)
        body.classList.toggle('d-none')
        toggle.querySelector('.ita-chevron').classList.toggle('ita-chevron-open')
      })
      toggle.addEventListener('keydown', e => { if (e.key === 'Enter') toggle.click() })
    })

    renderVerbRefPage()
  }

  // ── Streak ───────────────────────────────────────────────────────
  function initStreak() {
    const STREAK_KEY = 'italian_streak'
    const today = new Date().toISOString().slice(0, 10)
    let data = {}
    try { data = JSON.parse(localStorage.getItem(STREAK_KEY) || '{}') } catch (_) {}
    const last = data.lastDate || ''
    const streak = data.streak || 0
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
    let newStreak = streak
    if (last === today) {
      newStreak = streak
    } else if (last === yesterday) {
      newStreak = streak + 1
    } else if (last !== today) {
      newStreak = 1
    }
    try { localStorage.setItem(STREAK_KEY, JSON.stringify({ streak: newStreak, lastDate: today })) } catch (_) {}
    const countEl = document.getElementById('ita-streak-count')
    const streakEl = document.getElementById('ita-streak')
    if (countEl) countEl.textContent = newStreak
    if (streakEl && newStreak > 1) streakEl.classList.add('streak-lit')
  }

  // Mark streak active on any answered question (call after any correct/wrong)
  function bumpStreak() {
    const STREAK_KEY = 'italian_streak'
    const today = new Date().toISOString().slice(0, 10)
    let data = {}
    try { data = JSON.parse(localStorage.getItem(STREAK_KEY) || '{}') } catch (_) {}
    if (data.lastDate !== today) {
      data.streak = (data.streak || 0) + 1
      data.lastDate = today
      try { localStorage.setItem(STREAK_KEY, JSON.stringify(data)) } catch (_) {}
      const countEl = document.getElementById('ita-streak-count')
      const streakEl = document.getElementById('ita-streak')
      if (countEl) countEl.textContent = data.streak
      if (streakEl) streakEl.classList.add('streak-lit')
    }
  }

  // ── Lesson of the Day ────────────────────────────────────────────
  function renderLessonOfDay() {
    const container = document.getElementById('lesson-of-day')
    if (!container) return
    const vocab   = Object.values(appData.vocab || {}).flat().filter(v => v.it && v.en)
    const grammar = (appData.grammar || [])
    const idioms  = (appData.idioms  || [])
    if (!vocab.length && !grammar.length) return
    const today = new Date().toISOString().slice(0, 10)
    const seed  = today.replace(/-/g, '') | 0
    const pick  = (arr, n) => {
      const out = []
      for (let i = 0; i < n && arr.length; i++) { out.push(arr[(seed + i * 7) % arr.length]) }
      return out
    }
    const words      = pick(vocab, 5)
    const grammarTip = grammar.length ? grammar[seed % grammar.length] : null
    const idiom      = idioms.length  ? idioms[seed  % idioms.length]  : null
    container.innerHTML = `
      <div class="ls-lotd">
        <div class="ls-lotd-header">
          <span class="ls-lotd-badge">Today</span>
          <h3>&#x1F4DA; Lesson of the Day</h3>
        </div>
        ${words.length ? `<div class="ls-lotd-grid">${words.map(w => `
          <div class="ls-lotd-word">
            <div class="ls-word-it">${w.it}</div>
            <div class="ls-word-en">${w.en}</div>
          </div>`).join('')}</div>` : ''}
        ${grammarTip ? `
        <div class="content-card ita-grammar-card ls-lotd-grammar-card">
          <div class="card-body" style="padding:0.75rem 1rem;">
            <h3 class="card-title ita-grammar-toggle ls-lotd-grammar-toggle" role="button" tabindex="0" style="font-size:0.95rem;margin:0;">
              &#x1F4D6; ${grammarTip.title}
              <span class="lotd-expand-icon">+</span>
            </h3>
            <div class="ita-grammar-body d-none" id="lotd-grammar-body">
              ${grammarTip.body}
            </div>
          </div>
        </div>` : ''}
        ${idiom ? `<div class="ls-lotd-idiom"><strong>${idiom.idiom || idiom.expression || idiom.italian || ''}</strong>${idiom.meaning ? ' — ' + idiom.meaning : idiom.english ? ' — ' + idiom.english : ''}</div>` : ''}
        <div class="ls-lotd-footer"><span>&#x1F550;</span> Updated daily — come back tomorrow for a new lesson!</div>
      </div>`
    // Wire grammar accordion inside LOTD (rendered after main tab listeners)
    const grammarToggle = container.querySelector('.ls-lotd-grammar-toggle')
    if (grammarToggle) {
      grammarToggle.addEventListener('click', () => {
        const body = document.getElementById('lotd-grammar-body')
        const icon = grammarToggle.querySelector('.lotd-expand-icon')
        body.classList.toggle('d-none')
        icon.textContent = body.classList.contains('d-none') ? '+' : '\u2212'
      })
      grammarToggle.addEventListener('keydown', e => { if (e.key === 'Enter') grammarToggle.click() })
    }
  }

  // ── Reset ────────────────────────────────────────────────────────
  function resetStats() {
    if (confirm('Reset all Italian learning progress?')) {
      localStorage.removeItem(STORAGE_KEY)
      renderDashboard()
    }
  }

  // ── Public API ───────────────────────────────────────────────────
  window.ItalianApp = {
    showSection,
    setLevel,
    startVocab,
    startVerbs,
    startGrammarQuiz,
    startSentences,
    startReading,
    openPassage,
    startIdioms,
    renderIdiomStudy,
    renderReadingPassage: openPassage, // alias for results back-button
    openVerbRefModal,
    renderGrammar,
    resetStats,
    async init() {
      const dashContent = el('dash-content')
      if (dashContent) {
        dashContent.innerHTML = '<div class="text-center py-5"><div class="spinner-border text-light" role="status"><span class="visually-hidden">Loading…</span></div><p class="mt-3 text-muted">Loading Italian content…</p></div>'
      }

      // Restore level preference
      try {
        const savedLevel = localStorage.getItem('italian_level') || 'all'
        state.level = savedLevel
        document.querySelectorAll('.ita-level-btn').forEach(btn => {
          btn.classList.toggle('active', btn.dataset.level === savedLevel)
        })
      } catch (_) { /* localStorage unavailable */ }

      // Wire level selector
      document.querySelectorAll('.ita-level-btn').forEach(btn => {
        btn.addEventListener('click', () => setLevel(btn.dataset.level))
      })

      try {
        await loadData()
      } catch (err) {
        console.error('Italian app failed to load data:', err)
        if (dashContent) {
          dashContent.innerHTML = '<div class="alert alert-danger m-3">Failed to load content. Please refresh the page.</div>'
        }
        return
      }

      document.querySelectorAll('.ita-tab').forEach(tab => {
        tab.addEventListener('click', e => {
          e.preventDefault()
          const section = tab.dataset.section
          if      (section === 'vocab')       startVocab()
          else if (section === 'verbs')       startVerbs()
          else if (section === 'grammarquiz') startGrammarQuiz()
          else if (section === 'sentences')   startSentences()
          else if (section === 'reading')     startReading()
          else if (section === 'idioms')      startIdioms()
          else if (section === 'grammar')     renderGrammar()
          else showSection(section)
        })
      })

      initStreak()
      renderLessonOfDay()
      showSection('dashboard')
    }
  }
})()
