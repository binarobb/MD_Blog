// italian-app.js — SPA engine for the A1 Italian learning app
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
    sentences:   []
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

  function normalize(s) {
    return s.trim().toLowerCase()
      .replace(/[\u2018\u2019\u0060]/g, "'")
      .replace(/[\u2013\u2014]/g, '-')
  }

  // ── State ────────────────────────────────────────────────────────
  const state = {
    section: 'dashboard',       // dashboard | vocab | verbs | grammar | grammarquiz | sentences
    // vocab quiz
    vocabCategory: null,
    vocabQueue: [],
    vocabIndex: 0,
    vocabCorrect: 0,
    vocabTotal: 0,
    vocabMode: 'mc',           // mc = multiple-choice, type = type-in
    vocabDirection: 'it-en',   // it-en or en-it
    // verb drill
    verbQueue: [],
    verbIndex: 0,
    verbCorrect: 0,
    verbTotal: 0,
    verbMode: 'type',          // type or mc
    verbFilter: 'all',         // all | -are | -ere | -ire | irregular
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
  }

  // ── Data loader ──────────────────────────────────────────────────
  async function loadData() {
    const BASE = '/italian/api'

    const [categoriesRes, verbsRes, grammarTopicsRes, grammarQuestionsRes, sentencesRes] =
      await Promise.all([
        fetch(`${BASE}/vocab/categories`),
        fetch(`${BASE}/verbs`),
        fetch(`${BASE}/grammar/topics`),
        fetch(`${BASE}/grammar/questions`),
        fetch(`${BASE}/sentences`)
      ])

    if (!categoriesRes.ok || !verbsRes.ok || !grammarTopicsRes.ok ||
        !grammarQuestionsRes.ok || !sentencesRes.ok) {
      throw new Error('Failed to load Italian content from server')
    }

    const [categories, verbs, grammarTopics, grammarQuestions, sentences] =
      await Promise.all([
        categoriesRes.json(),
        verbsRes.json(),
        grammarTopicsRes.json(),
        grammarQuestionsRes.json(),
        sentencesRes.json()
      ])

    // Fetch all vocab items for each category in parallel
    const vocabResponses = await Promise.all(
      categories.map(cat => fetch(`${BASE}/vocab/${cat.slug}`))
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
    appData.grammar     = grammarTopics   // [{title, body}, ...]
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
    const vocabStats = stats.vocab || { correct: 0, total: 0, sessions: 0 }
    const verbStats = stats.verbs || { correct: 0, total: 0, sessions: 0 }
    const grammarStats = stats.grammarquiz || { correct: 0, total: 0, sessions: 0 }
    const sentenceStats = stats.sentences || { correct: 0, total: 0, sessions: 0 }
    const vocabPct = vocabStats.total ? Math.round(vocabStats.correct / vocabStats.total * 100) : 0
    const verbPct = verbStats.total ? Math.round(verbStats.correct / verbStats.total * 100) : 0
    const grammarPct = grammarStats.total ? Math.round(grammarStats.correct / grammarStats.total * 100) : 0
    const sentencePct = sentenceStats.total ? Math.round(sentenceStats.correct / sentenceStats.total * 100) : 0

    el('dash-content').innerHTML = `
      <div class="row g-3">
        <div class="col-md-6">
          <div class="content-card h-100">
            <div class="card-body d-flex flex-column">
              <h4 class="card-title">Vocabulary</h4>
              <p class="text-muted">${vocabStats.sessions} session${vocabStats.sessions !== 1 ? 's' : ''} completed</p>
              <div class="ita-progress-bar mb-2"><div class="ita-progress-fill" style="width:${vocabPct}%"></div></div>
              <p class="mb-0"><strong>${vocabStats.correct}</strong> / ${vocabStats.total} correct (${vocabPct}%)</p>
              <button class="btn btn-primary mt-auto" onclick="ItalianApp.startVocab()">Practice Vocabulary</button>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="content-card h-100">
            <div class="card-body d-flex flex-column">
              <h4 class="card-title">Verb Conjugation</h4>
              <p class="text-muted">${verbStats.sessions} session${verbStats.sessions !== 1 ? 's' : ''} completed</p>
              <div class="ita-progress-bar mb-2"><div class="ita-progress-fill" style="width:${verbPct}%"></div></div>
              <p class="mb-0"><strong>${verbStats.correct}</strong> / ${verbStats.total} correct (${verbPct}%)</p>
              <button class="btn btn-primary mt-auto" onclick="ItalianApp.startVerbs()">Practice Verbs</button>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="content-card h-100">
            <div class="card-body d-flex flex-column">
              <h4 class="card-title">Grammar Quiz</h4>
              <p class="text-muted">${grammarStats.sessions} session${grammarStats.sessions !== 1 ? 's' : ''} completed</p>
              <div class="ita-progress-bar mb-2"><div class="ita-progress-fill" style="width:${grammarPct}%"></div></div>
              <p class="mb-0"><strong>${grammarStats.correct}</strong> / ${grammarStats.total} correct (${grammarPct}%)</p>
              <button class="btn btn-primary mt-auto" onclick="ItalianApp.startGrammarQuiz()">Practice Grammar</button>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="content-card h-100">
            <div class="card-body d-flex flex-column">
              <h4 class="card-title">Sentence Builder</h4>
              <p class="text-muted">${sentenceStats.sessions} session${sentenceStats.sessions !== 1 ? 's' : ''} completed</p>
              <div class="ita-progress-bar mb-2"><div class="ita-progress-fill" style="width:${sentencePct}%"></div></div>
              <p class="mb-0"><strong>${sentenceStats.correct}</strong> / ${sentenceStats.total} correct (${sentencePct}%)</p>
              <button class="btn btn-primary mt-auto" onclick="ItalianApp.startSentences()">Build Sentences</button>
            </div>
          </div>
        </div>
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
        <p class="text-muted">You'll be given an infinitive and a subject pronoun — conjugate the verb in the present tense.</p>
        <div class="d-flex gap-3 flex-wrap align-items-center mb-3">
          <div>
            <label class="form-label mb-1">Verb Group</label><br>
            <div class="btn-group btn-group-sm" role="group">
              <input type="radio" class="btn-check" name="vfilter" id="vf-all" value="all" checked>
              <label class="btn btn-outline-light" for="vf-all">All 30</label>
              <input type="radio" class="btn-check" name="vfilter" id="vf-are" value="-are">
              <label class="btn btn-outline-light" for="vf-are">-are</label>
              <input type="radio" class="btn-check" name="vfilter" id="vf-ere" value="-ere">
              <label class="btn btn-outline-light" for="vf-ere">-ere</label>
              <input type="radio" class="btn-check" name="vfilter" id="vf-ire" value="-ire">
              <label class="btn btn-outline-light" for="vf-ire">-ire</label>
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
      state.verbMode = document.querySelector('input[name="verbmode"]:checked').value
      let verbs = appData.verbs
      if (state.verbFilter !== 'all') {
        verbs = appData.verbs.filter(v => {
          if (state.verbFilter === 'irregular') return v.group === 'irregular'
          return v.group.startsWith(state.verbFilter)
        })
      }
      // build question queue: each verb × random pronoun (pick 10–15 questions per round)
      const questions = []
      verbs.forEach(v => {
        const pronoun = PRONOUNS[Math.floor(Math.random() * PRONOUNS.length)]
        questions.push({ verb: v, pronoun, answer: v.conjugation[pronoun] })
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

    if (state.verbMode === 'type') {
      el('verb-area').innerHTML = `
        <div class="ita-quiz-header">
          <span class="text-muted">${progress}</span>
          <div class="ita-progress-bar"><div class="ita-progress-fill" style="width:${(state.verbIndex / state.verbQueue.length) * 100}%"></div></div>
          <span class="text-muted">${state.verbCorrect} correct</span>
        </div>
        <div class="ita-quiz-prompt">
          <span class="ita-lang-label">${q.verb.group}</span>
          <h2 class="mb-1"><span class="ita-pronoun">${q.pronoun}</span> ______</h2>
          <p class="text-muted mb-0">${q.verb.infinitive} — <em>${q.verb.translation}</em></p>
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
      const wrongs = []
      // other pronouns of same verb
      const otherFromSame = Object.entries(q.verb.conjugation)
        .filter(([p, c]) => p !== q.pronoun && c !== q.answer)
        .map(([, c]) => c)
      wrongs.push(...pick(otherFromSame, 2))
      // from other verbs same pronoun
      const otherVerbs = appData.verbs.filter(v => v.infinitive !== q.verb.infinitive)
      const fromOthers = pick(otherVerbs, 3).map(v => v.conjugation[q.pronoun]).filter(c => c !== q.answer)
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
          <span class="ita-lang-label">${q.verb.group}</span>
          <h2 class="mb-1"><span class="ita-pronoun">${q.pronoun}</span> ______</h2>
          <p class="text-muted mb-0">${q.verb.infinitive} — <em>${q.verb.translation}</em></p>
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
    const pct = Math.round(state.sentenceCorrect / state.sentenceTotal * 100)
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

  // ── Grammar Reference ────────────────────────────────────────────
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
        <h3>All 30 Verbs — Present Tense Reference</h3>
        <p class="text-muted mb-3" style="font-size:0.9rem">Click any card to enlarge &amp; flip for examples</p>
        <div class="ita-verb-ref-grid">
          ${appData.verbs.map((v, idx) => `
            <div class="ita-verb-ref-card" data-verb-idx="${idx}" role="button" tabindex="0">
              <div class="ita-verb-flip-inner">
                <div class="ita-verb-front">
                  <h5 class="card-title mb-1">${v.infinitive} <span class="badge bg-secondary">${v.group}</span></h5>
                  <p class="text-muted mb-2" style="font-size:0.85rem">${v.translation}</p>
                  <table class="ita-conj-table">
                    ${PRONOUNS.map(p => `<tr><td>${p}</td><td><strong>${v.conjugation[p]}</strong></td></tr>`).join('')}
                  </table>
                  <p class="text-muted mt-2 mb-0" style="font-size:0.82rem"><em>${v.example.it}</em><br>${v.example.en}</p>
                </div>
                <div class="ita-verb-back">
                  <h5 class="card-title mb-1">${v.infinitive} <span class="badge bg-secondary">${v.group}</span></h5>
                  <p class="text-muted mb-2" style="font-size:0.85rem">${v.translation}</p>
                  <h6 style="color:var(--brand);margin-bottom:0.6rem">Usage Examples</h6>
                  ${(v.examples || []).map(ex => `
                    <div class="ita-example-pair">
                      <div class="ita-example-it"><em>${ex.it}</em></div>
                      <div class="ita-example-en">${ex.en}</div>
                    </div>
                  `).join('')}
                  <p class="text-muted mt-2 mb-0" style="font-size:0.78rem">Click to flip back</p>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Overlay for enlarged card -->
      <div class="ita-card-overlay d-none" id="verb-card-overlay">
        <div class="ita-card-overlay-backdrop"></div>
        <div class="ita-card-enlarged" id="verb-card-enlarged"></div>
      </div>`

    // accordion toggles
    el('grammar-area').querySelectorAll('.ita-grammar-toggle').forEach(toggle => {
      toggle.addEventListener('click', () => {
        const body = el('grammar-body-' + toggle.dataset.idx)
        body.classList.toggle('d-none')
        toggle.querySelector('.ita-chevron').classList.toggle('ita-chevron-open')
      })
      toggle.addEventListener('keydown', e => { if (e.key === 'Enter') toggle.click() })
    })

    // verb card click-to-enlarge
    el('grammar-area').querySelectorAll('.ita-verb-ref-card').forEach(card => {
      card.addEventListener('click', () => openVerbCard(card))
      card.addEventListener('keydown', e => { if (e.key === 'Enter') openVerbCard(card) })
    })
  }

  function openVerbCard(card) {
    const overlay = el('verb-card-overlay')
    const enlarged = el('verb-card-enlarged')
    const clone = card.cloneNode(true)
    clone.classList.add('ita-enlarged-active')
    enlarged.innerHTML = ''
    enlarged.appendChild(clone)
    overlay.classList.remove('d-none')
    document.body.style.overflow = 'hidden'

    // flip on click inside enlarged card
    clone.addEventListener('click', e => {
      e.stopPropagation()
      clone.classList.toggle('ita-verb-flipped')
    })

    // close on backdrop or Escape
    const close = () => {
      overlay.classList.add('d-none')
      document.body.style.overflow = ''
    }
    overlay.querySelector('.ita-card-overlay-backdrop').onclick = close
    const escHandler = e => {
      if (e.key === 'Escape') { close(); document.removeEventListener('keydown', escHandler) }
    }
    document.addEventListener('keydown', escHandler)
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
    startVocab,
    startVerbs,
    startGrammarQuiz,
    startSentences,
    renderGrammar,
    resetStats,
    async init() {
      // Show loading spinner inside dash-content while data fetches from API
      const dashContent = el('dash-content')
      if (dashContent) {
        dashContent.innerHTML = '<div class="text-center py-5"><div class="spinner-border text-light" role="status"><span class="visually-hidden">Loading…</span></div><p class="mt-3 text-muted">Loading Italian content…</p></div>'
      }

      try {
        await loadData()
      } catch (err) {
        console.error('Italian app failed to load data:', err)
        const dashContent = el('dash-content')
        if (dashContent) {
          dashContent.innerHTML = '<div class="alert alert-danger m-3">Failed to load content. Please refresh the page.</div>'
        }
        return
      }

      document.querySelectorAll('.ita-tab').forEach(tab => {
        tab.addEventListener('click', e => {
          e.preventDefault()
          const section = tab.dataset.section
          if (section === 'vocab') startVocab()
          else if (section === 'verbs') startVerbs()
          else if (section === 'grammarquiz') startGrammarQuiz()
          else if (section === 'sentences') startSentences()
          else if (section === 'grammar') renderGrammar()
          else showSection(section)
        })
      })
      showSection('dashboard')
    }
  }
})()
