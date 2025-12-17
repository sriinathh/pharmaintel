const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth.middleware')
const { listReports, createReport, getReport, generateReport, deleteReport } = require('../controllers/report.controller')

router.get('/', auth, listReports)
router.post('/', auth, createReport)
router.post('/generate', auth, generateReport)
router.get('/:id', auth, getReport)
router.delete('/:id', auth, deleteReport)

module.exports = router
