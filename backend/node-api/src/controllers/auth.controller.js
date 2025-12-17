const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const env = require('../config/env')

async function register(req, res) {
  const { name, email, password } = req.body
  if (!email || !name) return res.status(400).json({ error: 'Missing fields' })
  try {
    const existing = await User.findOne({ email })
    if (existing) return res.status(409).json({ error: 'Email already exists' })
    const hashed = password ? await bcrypt.hash(password, 10) : null
    const user = await User.create({ name, email, password: hashed })
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role, name: user.name }, env.JWT_SECRET)
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } })
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' })
  }
}

async function login(req, res) {
  const { email, password } = req.body
  if (!email) return res.status(400).json({ error: 'Missing fields' })
  try {
    const user = await User.findOne({ email })
    if (!user) return res.status(401).json({ error: 'Invalid credentials' })
    const ok = user.password ? await bcrypt.compare(password || '', user.password) : true
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' })
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role, name: user.name }, env.JWT_SECRET)
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } })
  } catch (err) {
    res.status(500).json({ error: 'Login failed' })
  }
}

async function me(req, res) {
  try {
    // req.user is set by auth.middleware when token is valid
    const User = require('../models/User')
    const user = await User.findById(req.user.id).select('-password')
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json({ user })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' })
  }
}

module.exports = { register, login, me }
