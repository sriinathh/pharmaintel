const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth.middleware')
const { searchDrugs, getDrug, convertDrug, substitutes, interactions } = require('../controllers/drug.controller')

// public search
router.get('/search', auth, searchDrugs)
router.get('/:id', auth, getDrug)
router.post('/convert', auth, convertDrug)
router.post('/substitutes', auth, substitutes)
router.post('/interactions', auth, interactions)

module.exports = router
