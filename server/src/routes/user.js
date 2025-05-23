//유저 정보 api 제작 예정

const express = require('express');
const router = express.Router();
const { myinfo,userdata,myposts } = require('../controllers/userController');
router.get('/', myinfo);
router.get('/:userId', userdata);
module.exports = router;