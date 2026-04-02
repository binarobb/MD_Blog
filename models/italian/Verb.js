const mongoose = require('mongoose')

const exampleSchema = new mongoose.Schema({
    it: { type: String, required: true },
    en: { type: String, required: true }
}, { _id: false })

const conjugationSchema = new mongoose.Schema({
    io:       { type: String, default: '' },
    tu:       { type: String, default: '' },
    'lui/lei':{ type: String, default: '' },
    noi:      { type: String, default: '' },
    voi:      { type: String, default: '' },
    loro:     { type: String, default: '' }
}, { _id: false })

const verbSchema = new mongoose.Schema({
    infinitive: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    translation: {
        type: String,
        required: true,
        trim: true
    },
    group: {
        type: String,
        required: true,
        enum: ['-are', '-ere', '-ire', '-ire (isc)', 'irregular']
    },
    conjugation: {
        type: conjugationSchema,
        required: true
    },
    example: {
        type: exampleSchema,
        required: true
    },
    examples: [exampleSchema],
    difficulty: {
        type: Number,
        default: 1,
        min: 1,
        max: 3
    }
})

module.exports = mongoose.model('Verb', verbSchema)
