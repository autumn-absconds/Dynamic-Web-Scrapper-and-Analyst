const functions = require('../requests.js')
// const getRequest = require('../router')
const express = require('express')
const router = express.Router();


router.get('/', functions.getRequest);


module.exports = router;