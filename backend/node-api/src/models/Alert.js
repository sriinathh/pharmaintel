const mongoose = require('mongoose')

const AlertSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  level: { type: String, enum: ['warning','info'], default: 'info' },
  text: { type: String }
}, { timestamps: true })

AlertSchema.index({ userId: 1, createdAt: -1 })

module.exports = mongoose.model('Alert', AlertSchema)
