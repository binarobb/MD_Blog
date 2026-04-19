const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String  // Optional — OAuth-only users won't have one
    },
    displayName: {
        type: String,
        required: true,
        trim: true
    },
    avatar: {
        type: String,
        default: ''
    },
    role: {
        type: String,
        enum: ['learner', 'admin'],
        default: 'learner'
    },
    googleId: {
        type: String,
        sparse: true,
        unique: true
    },
    provider: {
        type: String,
        enum: ['local', 'google'],
        default: 'local'
    }
}, { timestamps: true })

// Hash password before save (only if modified)
userSchema.pre('save', async function (next) {
    if (!this.isModified('password') || !this.password) return next()
    try {
        const salt = await bcrypt.genSalt(12)
        this.password = await bcrypt.hash(this.password, salt)
        next()
    } catch (err) {
        next(err)
    }
})

// Compare candidate password against stored hash
userSchema.methods.comparePassword = async function (candidate) {
    if (!this.password) return false
    return bcrypt.compare(candidate, this.password)
}

module.exports = mongoose.model('User', userSchema)
