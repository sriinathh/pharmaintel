const User = require('../models/User')
const Profile = require('../models/Profile')
const Activity = require('../models/Activity')
const mongoose = require('mongoose')

function sanitizeUser(userDoc) {
  if (!userDoc) return null
  const u = userDoc.toObject ? userDoc.toObject() : userDoc
  delete u.password
  return u
}

// GET /api/profile
async function getProfile(req, res) {
  try {
    const userId = req.user.id

    const user = await User.findById(userId).select('-password')
    const profile = await Profile.findOne({ userId })

    const merged = Object.assign({}, sanitizeUser(user) || {}, profile ? profile.toObject() : {})
    // normalize keys expected by frontend: avatar vs avatarUrl
    if (merged.avatarUrl && !merged.avatar) merged.avatar = merged.avatarUrl

    res.json(merged)
  } catch (err) {
    console.error('getProfile error', err)
    res.status(500).json({ error: 'Failed to fetch profile' })
  }
}

// PATCH /api/profile
async function updateProfile(req, res) {
  try {
    const userId = req.user.id
    const patch = req.body || {}

    // Allowed fields for user and profile
    const allowedUser = ['name', 'language', 'interests', 'plan', 'avatar']
    const allowedProfile = ['bio', 'organization', 'specialization', 'experienceYears', 'avatarUrl', 'preferences']

    // Split incoming patch to userPatch and profilePatch
    const userPatch = {}
    const profilePatch = {}
    Object.keys(patch).forEach((k) => {
      if (allowedUser.includes(k)) userPatch[k] = patch[k]
      if (allowedProfile.includes(k)) profilePatch[k] = patch[k]
    })

    // Prevent role/email change from user
    if (patch.role && patch.role !== req.user.role) return res.status(403).json({ error: 'Cannot change role' })
    if (patch.email && patch.email !== req.user.email) return res.status(403).json({ error: 'Email is read-only' })

    // Update user document if needed
    let user
    if (Object.keys(userPatch).length) {
      user = await User.findByIdAndUpdate(userId, { $set: userPatch }, { new: true }).select('-password')
    } else {
      user = await User.findById(userId).select('-password')
    }

    // Upsert profile
    let profile = await Profile.findOneAndUpdate({ userId }, { $set: profilePatch }, { upsert: true, new: true, setDefaultsOnInsert: true })

    // Log activity for profile update
    await Activity.create({ userId: mongoose.Types.ObjectId(userId), type: 'profile_update', description: 'Profile updated', metadata: { changed: Object.keys(patch) } })

    const merged = Object.assign({}, sanitizeUser(user) || {}, profile ? profile.toObject() : {})
    if (merged.avatarUrl && !merged.avatar) merged.avatar = merged.avatarUrl

    res.json(merged)
  } catch (err) {
    console.error('updateProfile error', err)
    res.status(500).json({ error: 'Failed to update profile' })
  }
}

// GET /api/profile/activity
async function getActivity(req, res) {
  try {
    const userId = req.user.id
    const { limit = 20 } = req.query
    const items = await Activity.find({ userId }).sort({ createdAt: -1 }).limit(Number(limit))
    res.json({ items })
  } catch (err) {
    console.error('getActivity error', err)
    res.status(500).json({ error: 'Failed to fetch activity' })
  }
}

module.exports = { getProfile, updateProfile, getActivity }
