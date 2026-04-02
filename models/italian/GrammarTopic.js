const mongoose = require('mongoose')

const grammarTopicSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    body: {
        type: String,
        required: true
    },
    order: {
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model('GrammarTopic', grammarTopicSchema)
