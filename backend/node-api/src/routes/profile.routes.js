const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth.middleware')
const { getProfile, updateProfile, getActivity } = require('../controllers/profile.controller')

router.get('/', auth, getProfile)
router.patch('/', auth, updateProfile)
router.get('/activity', auth, getActivity)

module.exports = router
