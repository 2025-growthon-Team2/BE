//db에 저장될 유저 정보 리스트

const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    providerId: { type: String, required: true },
    kakaomail: {type: String, required: true},
    profileimage: { type: String },
    nickname: { type: String },
    email: { type: String },
    emailVerified: { type: Boolean, default: false },
    code: { type: String },
    expiresAt: { type: Date },
    subscription: { type: Object, default: null },
    role: { type: String },
    writtenPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Talent' }],
    appliedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Talent' }]
});

module.exports = mongoose.model('User', userSchema);