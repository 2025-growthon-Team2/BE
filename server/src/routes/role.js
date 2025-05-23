const express = require('express');
const router = express.Router();
const { myrole } = require('../controllers/roleController');
router.post('/my', myrole);
module.exports = router;