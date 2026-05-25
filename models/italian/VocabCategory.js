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
    },
    group: {
        type: String,
        trim: true
    },
    groupOrder: {
        type: Number,
        default: 99
    },
    groupIcon: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    }
})

module.exports = mongoose.model('VocabCategory', vocabCategorySchema)
