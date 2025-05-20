const express = require('express');
const router = express.Router();
const { sendEmail,verifyEmail,accesstoken } = require('../controllers/authController');
const {kakaoLogin} = require('../kakao/login');

router.post('/email', sendEmail);
router.post('/email/verify', verifyEmail);
router.get('/kakao/callback', kakaoLogin);
router.get('/access-token', accesstoken);

module.exports = router;
