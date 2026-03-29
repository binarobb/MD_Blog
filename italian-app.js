// italian-app.js — SPA engine for the A1 Italian learning app
// Depends on italian-data.js being loaded first (VERBS, VOCAB, GRAMMAR, PRONOUNS)

;(function () {
  'use strict'

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
    const categories = Object.keys(VOCAB)
    el('vocab-area').innerHTML = `
      <div class="ita-setup-panel">
        <h3>Choose a Category</h3>
        <div class="row g-2 mb-3">
          ${categories.map(cat => `
            <div class="col-6 col-md-4">
              <button class="btn btn-outline-light w-100 ita-cat-btn" data-cat="${cat}">
                ${cat} <span class="badge bg-secondary">${VOCAB[cat].length}</span>
              </button>
            </div>
          `).join('')}
          <div class="col-6 col-md-4">
            <button class="btn btn-outline-light w-100 ita-cat-btn" data-cat="all">
              All Words <span class="badge bg-secondary">${Object.values(VOCAB).flat().length}</span>
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
          ? Object.values(VOCAB).flat()
          : VOCAB[cat].slice())
        state.vocabIndex = 0
        state.vocabCorrect = 0
        state.vocabTotal = 0
        renderVocabQuestion()
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
        ? Object.values(VOCAB).flat()
        : VOCAB[state.vocabCategory])
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
      let verbs = VERBS
      if (state.verbFilter !== 'all') {
        verbs = VERBS.filter(v => {
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
      const otherVerbs = VERBS.filter(v => v.infinitive !== q.verb.infinitive)
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
    const topics = [...new Set(GRAMMAR_QUIZ.map(q => q.topic))]
    el('grammarquiz-area').innerHTML = `
      <div class="ita-setup-panel">
        <h3>Grammar Quiz</h3>
        <p class="text-muted">Choose a topic or practise everything.</p>
        <div class="row g-2 mb-3">
          <div class="col-6 col-md-4">
            <button class="btn btn-outline-light w-100 ita-cat-btn active" data-topic="all">
              All Topics <span class="badge bg-secondary">${GRAMMAR_QUIZ.length}</span>
            </button>
          </div>
          ${topics.map(t => {
            const count = GRAMMAR_QUIZ.filter(q => q.topic === t).length
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
      const pool = selectedTopic === 'all' ? GRAMMAR_QUIZ : GRAMMAR_QUIZ.filter(q => q.topic === selectedTopic)
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
    state.sentenceQueue = shuffle(SENTENCES).slice(0, 12)
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
        ${GRAMMAR.map((g, i) => `
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
          ${VERBS.map((v, idx) => `
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
    init() {
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
