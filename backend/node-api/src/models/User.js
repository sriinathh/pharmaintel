const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, index: true },
  password: { type: String },
  role: { type: String, enum: ['student', 'pharmacist', 'researcher', 'admin'], default: 'student' },
  language: { type: String, default: 'en' },
  interests: [String],
  avatar: { type: String },
  plan: { type: String, enum: ['Free', 'Pro', 'Enterprise'], default: 'Free' }
}, { timestamps: true })

UserSchema.index({ email: 1 })

module.exports = mongoose.model('User', UserSchema)
