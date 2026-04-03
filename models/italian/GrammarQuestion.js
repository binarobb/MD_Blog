const mongoose = require('mongoose')

const grammarQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
        trim: true
    },
    correctAnswer: {
        type: String,
        required: true,
        trim: true
    },
    options: [{
        type: String,
        trim: true
    }],
    topic: {
        type: String,
        required: true,
        trim: true
    },
    difficulty: {
        type: Number,
        default: 1,
        min: 1,
        max: 3
    }
})

module.exports = mongoose.model('GrammarQuestion', grammarQuestionSchema)
