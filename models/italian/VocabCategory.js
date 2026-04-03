const mongoose = require('mongoose')

const vocabCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    order: {
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model('VocabCategory', vocabCategorySchema)
