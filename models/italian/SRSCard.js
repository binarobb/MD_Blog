const mongoose = require('mongoose')

const srsCardSchema = new mongoose.Schema({
    user: {
        type:     mongoose.Schema.Types.ObjectId,
        ref:      'User',
        required: true
    },
    itemType: {
        type:     String,
        required: true,
        enum:     ['vocab', 'grammar', 'idiom']
    },
    itemId: {
        type:     mongoose.Schema.Types.ObjectId,
        required: true
    },
    // Denormalized content — no cross-collection joins needed at review time
    front: { type: String, required: true },   // Italian word / question
    back:  { type: String, required: true },   // English / correct answer

    // SM-2 fields
    interval:    { type: Number, default: 0 },    // days between reviews
    easeFactor:  { type: Number, default: 2.5 },  // SM-2 EF, min 1.3
    repetitions: { type: Number, default: 0 },    // consecutive correct answers
    lapses:      { type: Number, default: 0 },    // times forgotten

    nextReview:   { type: Date, default: Date.now },
    lastReviewed: { type: Date, default: null }

}, { timestamps: true })

// One card per user per content item
srsCardSchema.index({ user: 1, itemType: 1, itemId: 1 }, { unique: true })
// For the "due" query
srsCardSchema.index({ user: 1, nextReview: 1 })

module.exports = mongoose.model('SRSCard', srsCardSchema)
