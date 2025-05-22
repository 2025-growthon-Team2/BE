//알림 관련 라우터 정리

const express = require('express');
const router = express.Router();
const { newpost,applypost,matchpost,thispost,allposts } = require('../controllers/postController');
router.post('/', newpost);
router.post('/:postId/apply', applypost);
router.post('/:postId/match', matchpost);
router.get('/:postId', thispost);
module.exports = router;