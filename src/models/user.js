const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    providerId: { type: String, required: true },
    profileimage: { type: String },
    nickname: { type: String },
    email: { type: String },
    emailVerified: { type: Boolean, default: false },
    code: { type: String },
    expiresAt: { type: Date },
    subscription: { type: Boolean, default: false }
});

module.exports = mongoose.model('User', userSchema);