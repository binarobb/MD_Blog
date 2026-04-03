const mongoose = require('mongoose')

const vocabItemSchema = new mongoose.Schema({
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'VocabCategory',
        required: true
    },
    italian: {
        type: String,
        required: true,
        trim: true
    },
    english: {
        type: String,
        required: true,
        trim: true
    },
    imageUrl: {
        type: String,
        default: ''
    },
    audioUrl: {
        type: String,
        default: ''
    },
    difficulty: {
        type: Number,
        default: 1,
        min: 1,
        max: 3
    },
    tags: [{
        type: String,
        trim: true
    }]
})

// Compound index: same word shouldn't appear twice in same category
vocabItemSchema.index({ category: 1, italian: 1 }, { unique: true })

module.exports = mongoose.model('VocabItem', vocabItemSchema)
