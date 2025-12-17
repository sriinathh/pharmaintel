const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth.middleware')
const { requireRole } = require('../middleware/role.middleware')
const { stats, listUsers } = require('../controllers/admin.controller')

router.get('/stats', auth, requireRole('admin'), stats)
router.get('/users', auth, requireRole('admin'), listUsers)

module.exports = router
