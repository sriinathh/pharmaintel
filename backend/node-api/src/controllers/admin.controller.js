const User = require('../models/User')
const Report = require('../models/Report')

async function stats(req, res) {
  try {
    const users = await User.countDocuments()
    const reports = await Report.countDocuments()
    res.json({ users, reports })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats' })
  }
}

async function listUsers(req, res) {
  try {
    const users = await User.find().select('-password').limit(200)
    res.json(users)
  } catch (err) {
    res.status(500).json({ error: 'Failed to list users' })
  }
}

module.exports = { stats, listUsers }
