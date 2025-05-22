//알림 관련 라우터 정리

const express = require('express');
const router = express.Router();
const { subscription,sendPush } = require('../controllers/notiController');
router.post('/subscription', subscription);
router.post('/sendpush', sendPush);
module.exports = router;