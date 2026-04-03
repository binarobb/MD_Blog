const mongoose = require('mongoose')

const questionSchema = new mongoose.Schema({
    text:         { type: String, required: true },
    options:      { type: [String], validate: v => v.length === 4 },
    correctIndex: { type: Number, required: true, min: 0, max: 3 }
}, { _id: false })

const glossSchema = new mongoose.Schema({
    italian: { type: String, required: true },
    english: { type: String, required: true }
}, { _id: false })

const readingPassageSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    level: {
        type: Number,
        required: true,
        enum: [1, 2, 3]   // 1 = A1, 2 = A2, 3 = B1
    },
    body: {
        // HTML string — key vocab wrapped in <mark data-word="italian"> spans
        type: String,
        required: true
    },
    vocabGlossary: [glossSchema],
    questions:     [questionSchema],
    tags:          [String],
    audioUrl: {
        // Hook for ElevenLabs TTS read-aloud — populate later; UI hides play button when null
        type: String,
        default: null
    }
}, { timestamps: true })

module.exports = mongoose.model('ReadingPassage', readingPassageSchema)
