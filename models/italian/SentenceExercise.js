const mongoose = require('mongoose')

const sentenceExerciseSchema = new mongoose.Schema({
    english: {
        type: String,
        required: true,
        trim: true
    },
    words: [{
        type: String,
        trim: true
    }],
    difficulty: {
        type: Number,
        default: 1,
        min: 1,
        max: 3
    }
})

module.exports = mongoose.model('SentenceExercise', sentenceExerciseSchema)
