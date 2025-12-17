const express = require('express')
const router = express.Router()
const { queryAI } = require('../controllers/ai.controller')

router.post('/query', queryAI)

module.exports = router
