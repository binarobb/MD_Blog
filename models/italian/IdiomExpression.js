const mongoose = require('mongoose')

const idiomSchema = new mongoose.Schema({
    idiom: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    meaning: {
        // Natural English meaning — what a native speaker would say
        type: String,
        required: true,
        trim: true
    },
    literalTranslation: {
        // Word-for-word English — shows why it's idiomatic
        type: String,
        trim: true,
        default: null
    },
    example: {
        it: { type: String, required: true },
        en: { type: String, required: true }
    },
    difficulty: {
        type: Number,
        default: 2,
        min: 2,
        max: 3   // A2=2, B1=3
    },
    tags: [String],
    audioUrl: {
        // Hook for ElevenLabs TTS pronunciation — populate later; UI hides speaker icon when null
        type: String,
        default: null
    }
}, { timestamps: true })

module.exports = mongoose.model('IdiomExpression', idiomSchema)
