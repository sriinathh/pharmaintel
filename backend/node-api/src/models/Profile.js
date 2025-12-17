const mongoose = require('mongoose')

const ProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  bio: { type: String, default: '' },
  organization: { type: String, default: '' },
  specialization: { type: String, default: '' },
  experienceYears: { type: Number, default: 0 },
  avatarUrl: { type: String, default: '' },
  preferences: { type: Object, default: {} }
}, { timestamps: true })

module.exports = mongoose.model('Profile', ProfileSchema)
