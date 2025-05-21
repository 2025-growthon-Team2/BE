//db에 저장될 유저 정보 리스트

const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    providerId: { type: String, required: true },
    profileimage: { type: String },
    nickname: { type: String },
    email: { type: String },
    emailVerified: { type: Boolean, default: false },
    code: { type: String },
    expiresAt: { type: Date },
    subscription: { type: Object, default: null },
});

module.exports = mongoose.model('User', userSchema);